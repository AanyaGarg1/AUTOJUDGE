const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { RandomForestClassifier, RandomForestRegression } = require('ml-random-forest');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const app = express();
app.use(cors());
app.use(express.json());

// Load model
let modelData;
try {
    modelData = JSON.parse(fs.readFileSync('model.json', 'utf8'));
    console.log("Model loaded successfully.");
} catch (err) {
    console.error("Failed to load model. Please run train_model.js first.");
    process.exit(1);
}

const classifier = RandomForestClassifier.load(modelData.classifier);
const regressor = RandomForestRegression.load(modelData.regressor);
const classMapInverse = { 0: "Easy", 1: "Medium", 2: "Hard" };

function extractFeatures(description, input_desc, output_desc) {
    const combinedText = `${description} ${input_desc} ${output_desc}`.toLowerCase();
    const tokens = tokenizer.tokenize(combinedText);

    // Feature 1: Log-scale Length
    const textLength = Math.log(combinedText.length + 1);

    // Feature 2: High-Level Math Symbols Ratio
    const mathSymbols = ["+", "-", "*", "/", ">", "<", "=", "∑", "∏", "log", "exp", "sqrt", "%", "^", "!", "∞", "∫", "mod", "xor"];
    const mathCount = tokens.filter(t => mathSymbols.includes(t)).length;
    const mathRatio = mathCount / (tokens.length + 1);

    // Feature 3: Advanced Algorithmic Tokens
    const indicators = {
        simple: ["sum", "print", "add", "number", "even", "odd", "easy", "positive"],
        medium: ["sort", "binary", "greedy", "bfs", "dfs", "minimum", "maximum", "adjacency", "edge", "node"],
        hard: ["dp", "flow", "segment", "tree", "heavy", "decomposition", "bitmask", "centroid", "fft", "prime", "modulo", "spanning", "kruskal", "dinic", "network"]
    };

    let detectedTags = [];
    const keywordFeatures = Object.keys(indicators).map(key => {
        const found = indicators[key].some(kw => combinedText.includes(kw));
        if (found) detectedTags.push(key);
        return found ? 1 : 0;
    });

    // Feature 4: Structural Indicators (Ratio of unique technical terms)
    const uniqueWords = new Set(tokens).size;
    const complexityRatio = uniqueWords / (tokens.length + 1);

    return {
        features: [textLength, mathCount, mathRatio, complexityRatio, ...keywordFeatures],
        diagnostics: {
            textLength: combinedText.length,
            mathCount,
            detectedTags,
            vocabularyDiversity: (complexityRatio * 100).toFixed(1) + "%"
        }
    };
}

app.post('/predict', (req, res) => {
    const { description, input_description, output_description } = req.body;

    if (!description || !input_description || !output_description) {
        return res.status(400).json({ error: "Missing descriptions" });
    }

    const { features, diagnostics } = extractFeatures(description, input_description, output_description);

    const classPredIndex = classifier.predict([features])[0];
    const scorePred = regressor.predict([features])[0];

    res.json({
        problem_class: classMapInverse[classPredIndex],
        problem_score: Math.round(scorePred),
        diagnostics
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
