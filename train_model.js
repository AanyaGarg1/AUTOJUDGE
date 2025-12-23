const fs = require('fs');
const csv = require('csv-parser');
const { RandomForestClassifier, RandomForestRegression } = require('ml-random-forest');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Real Anchor Data
const anchors = [
    {
        title: "Watermelon",
        text: "divide a watermelon weighing w kilos into two parts, such that each part weighs an even number of kilos. Both parts must have a positive weight. determine if such a division is possible.",
        input: "one integer w",
        output: "YES or NO",
        rating: 800,
        class: "Easy"
    },
    {
        title: "Way Too Long Words",
        text: "automate the abbreviation of words. If a word's length is strictly greater than 10 characters, it should be replaced with an abbreviation. first letter, then number of letters between first and last, then last letter.",
        input: "number of words n, then n strings",
        output: "abbreviated words",
        rating: 800,
        class: "Easy"
    },
    {
        title: "Next Round",
        text: "contest with n participants, given scores and k. calculate how many participants will advance. score equal or greater than the k-th place participant. score must be positive.",
        input: "integers n and k, then n scores",
        output: "number of participants who advance",
        rating: 800,
        class: "Easy"
    },
    {
        title: "Yarik and Array",
        text: "finding maximum sum of a non-empty subarray where any two adjacent elements must have alternating parities, one even, one odd.",
        input: "t test cases, n integers",
        output: "maximum subarray sum",
        rating: 1100,
        class: "Easy"
    },
    {
        title: "Queue Sort",
        text: " Vlad has array of n integers and wants to sort in non-decreasing order. extract first element, insert at end, swap until strictly greater. minimum operations to sort or impossible -1.",
        input: "t test cases, n integers",
        output: "minimum operations or -1",
        rating: 1200,
        class: "Medium"
    },
    {
        title: "Counting Graphs",
        text: "given a weighted tree with n vertices. find number of weighted graphs such that maximum spanning tree is the same tree. weights are up to s. modulo 998244353.",
        input: "t test cases, n and s, then n-1 edges with weights",
        output: "number of graphs modulo 998244353",
        rating: 2000,
        class: "Hard"
    },
    {
        title: "Minimum Spanning Tree",
        text: "given a graph with n vertices and m edges. find the sum of weights of edges in the minimum spanning tree of the graph. using kruskal or prim.",
        input: "n and m, then m edges with weights u, v, w",
        output: "minimum weight sum",
        rating: 1600,
        class: "Medium"
    },
    {
        title: "Directing Edges",
        text: "given a graph with undirected and directed edges. find a way to direct undirected edges such that there are no cycles. print directions.",
        input: "t test cases, n and m, then m edges (type, u, v)",
        output: "YES/NO and the directed edges",
        rating: 1900,
        class: "Medium"
    },
    {
        title: "Maximum Flow",
        text: "given a flow network with source s and sink t. find the maximum amount of flow that can be sent from s to t using edmonds-karp or dinic algorithm.",
        input: "n vertices, m edges, vertex capacities",
        output: "maximum flow value",
        rating: 2400,
        class: "Hard"
    },
    {
        title: "Bitmask DP Task",
        text: "given n items each with cost and value. find maximum value to get with budget b. n is small around 20. use bitmasks.",
        input: "n and b, then n items",
        output: "maximum total value",
        rating: 2200,
        class: "Hard"
    }
];

const mathSymbolsList = ["+", "-", "*", "/", ">", "<", "=", "∑", "∏", "log", "exp", "sqrt", "%", "^", "!", "∞", "∫", "mod", "xor"];

function extractFeatures(description, input_desc, output_desc) {
    const combinedText = `${description} ${input_desc} ${output_desc}`.toLowerCase();

    // Feature 1: Log-scale Length
    const textLength = Math.log(combinedText.length + 1);

    // Feature 2: High-Level Math Symbols (Direct regex count, not relying on tokenizer)
    let mathCount = 0;
    mathSymbolsList.forEach(sym => {
        const escaped = sym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const matches = combinedText.match(new RegExp(escaped, 'g'));
        if (matches) mathCount += matches.length;
    });

    const tokens = tokenizer.tokenize(combinedText) || [];
    const mathRatio = mathCount / (tokens.length + 1);

    // Feature 3: Algorithmic Complexity Indicators
    const indicators = {
        simple: ["sum", "print", "add", "number", "even", "odd", "easy", "positive", "calculate"],
        medium: ["sort", "binary", "greedy", "bfs", "dfs", "minimum", "maximum", "adjacency", "edge", "node"],
        hard: ["dp", "flow", "segment", "tree", "heavy", "decomposition", "bitmask", "centroid", "fft", "prime", "modulo", "spanning", "kruskal", "dinic", "network"]
    };

    let detectedTags = [];
    const keywordFeatures = Object.keys(indicators).map(key => {
        const found = indicators[key].some(kw => combinedText.includes(kw));
        if (found) detectedTags.push(key);
        return found ? 1 : 0;
    });

    // Feature 4: Vocabulary Diversity (Avoid using as primary if text is too short)
    const uniqueWords = new Set(tokens).size;
    const complexityRatio = tokens.length > 5 ? (uniqueWords / (tokens.length + 1)) : 0;

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

// Generate Synthetic Data based on Anchors with strict class separation
function augmentData(n = 1500) {
    const data = [];
    const noise = ["the", "a", "of", "to", "in", "is", "for", "on", "with", "at", "by"];

    for (let i = 0; i < n; i++) {
        const anchor = anchors[Math.floor(Math.random() * anchors.length)];

        // Construct a realistic noisy description
        let text = anchor.text.split(" ");
        // Randomly shuffle or subtly change words to simulate user input variations
        for (let j = 0; j < 5; j++) {
            text.splice(Math.floor(Math.random() * text.length), 0, noise[Math.floor(Math.random() * noise.length)]);
        }
        const finalDescription = text.join(" ");

        data.push({
            description: finalDescription,
            input_description: anchor.input,
            output_description: anchor.output,
            problem_class: anchor.class,
            problem_score: anchor.rating + (Math.random() * 80 - 40)
        });
    }

    // Explicitly add very basic "Easy" cases to anchor the bottom of the scale
    const basicEasy = [
        { d: "add two numbers", i: "a b", o: "sum", c: "Easy", s: 800 },
        { d: "print the hello world", i: "none", o: "string", c: "Easy", s: 800 },
        { d: "find maximum of three", i: "x y z", o: "max", c: "Easy", s: 850 },
        { d: "check even or odd", i: "n", o: "label", c: "Easy", s: 800 }
    ];

    basicEasy.forEach(b => {
        for (let k = 0; k < 20; k++) { // High weight for these "pure" samples
            data.push({
                description: b.d,
                input_description: b.i,
                output_description: b.o,
                problem_class: b.c,
                problem_score: b.s + (Math.random() * 10)
            });
        }
    });

    return data;
}

const trainingData = augmentData(2000);
console.log(`Starting training with ${trainingData.length} samples...`);

const X = trainingData.map(item => extractFeatures(item.description, item.input_description, item.output_description).features);
const classMap = { "Easy": 0, "Medium": 1, "Hard": 2 };
const yClass = trainingData.map(item => classMap[item.problem_class]);
const yScore = trainingData.map(item => parseFloat(item.problem_score));

// Use more trees for better smoothing
const classifier = new RandomForestClassifier({ nEstimators: 200, maxDepth: 20 });
classifier.train(X, yClass);
console.log("Classifier trained.");

const regressor = new RandomForestRegression({ nEstimators: 200, maxDepth: 20 });
regressor.train(X, yScore);
console.log("Regressor trained.");

// Final Save
const modelData = {
    classifier: classifier.toJSON(),
    regressor: regressor.toJSON(),
    indicators: ["simple", "medium", "hard"]
};

fs.writeFileSync('model.json', JSON.stringify(modelData));
console.log("Final Calibrated Models saved.");

// Diagnostic tests
const tests = [
    { text: "add two numbers", expected: "Easy" },
    { text: "Dijkstra minimum path", expected: "Medium/Hard" },
    { text: "Sort the array", expected: "Easy/Medium" }
];

tests.forEach(t => {
    const f = extractFeatures(t.text, "", "");
    const pc = classifier.predict([f.features])[0];
    const ps = regressor.predict([f.features])[0];
    console.log(`Test '${t.text}': Result=${Object.keys(classMap)[pc]} (${ps.toFixed(0)})`);
});
