const fs = require('fs');
const { RandomForestClassifier, RandomForestRegression } = require('ml-random-forest');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const metadata = JSON.parse(fs.readFileSync('cf_300_metadata.json', 'utf8'));

// Feature extraction logic (Calibrated)
function extractFeatures(description, tags, solvedCount) {
    const combinedText = (description + " " + tags.join(" ")).toLowerCase();
    const tokens = tokenizer.tokenize(combinedText);

    // Feature 1: Log-scale Length
    const textLength = Math.log(combinedText.length + 1);

    // Feature 2: High-Level Math Symbols Ratio
    const mathSymbols = ["+", "-", "*", "/", ">", "<", "=", "∑", "∏", "log", "exp", "sqrt", "%", "^", "!", "∞", "mod", "xor"];
    const mathCount = tokens.filter(t => mathSymbols.includes(t)).length;
    const mathRatio = mathCount / (tokens.length + 1);

    // Feature 3: Algorithmic Complexity Indicators
    const indicators = {
        simple: ["implementation", "brute force", "math", "even", "odd", "sum"],
        medium: ["greedy", "binary search", "sort", "dfs", "bfs", "constructive"],
        hard: ["dp", "graphs", "trees", "data structures", "string suffix", "flows", "geometry", "probabilities", "bitmask"]
    };

    const keywordFeatures = Object.keys(indicators).map(key => {
        return indicators[key].some(kw => combinedText.includes(kw)) ? 1 : 0;
    });

    // Feature 4: Social Difficulty (Log of solved count - Higher solved = Easier)
    const solvedFactor = Math.log(solvedCount + 1);

    return [textLength, mathCount, mathRatio, solvedFactor, ...keywordFeatures];
}

console.log(`Deep training with ${metadata.length} real-world metadata samples...`);

const trainingData = metadata.map(p => {
    // We use the name and tags as proxy for "description content" since we have 300 metadata points
    // This allows us to train on the SCALE of difficulty rather than just noise.
    return {
        features: extractFeatures(p.name, p.tags, p.solvedCount),
        class: p.rating < 1200 ? 0 : (p.rating < 1900 ? 1 : 2),
        score: p.rating
    };
});

const X = trainingData.map(d => d.features);
const yClass = trainingData.map(d => d.class);
const yScore = trainingData.map(d => d.score);

const classifier = new RandomForestClassifier({ nEstimators: 300, maxDepth: 25 });
classifier.train(X, yClass);
console.log("Deep Classifier trained.");

const regressor = new RandomForestRegression({ nEstimators: 300, maxDepth: 25 });
regressor.train(X, yScore);
console.log("Deep Regressor trained.");

const modelData = {
    classifier: classifier.toJSON(),
    regressor: regressor.toJSON(),
    isDeepCalibrated: true
};

fs.writeFileSync('model.json', JSON.stringify(modelData));
console.log("Model updated with 300 real-world samples.");
