const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const crypto = require('crypto');

const csvWriter = createCsvWriter({
    path: 'problems.csv',
    header: [
        {id: 'title', title: 'title'},
        {id: 'description', title: 'description'},
        {id: 'input_description', title: 'input_description'},
        {id: 'output_description', title: 'output_description'},
        {id: 'problem_class', title: 'problem_class'},
        {id: 'problem_score', title: 'problem_score'}
    ]
});

const easyKeywords = ["sum", "array", "numbers", "add", "minimum", "maximum", "simple", "integer", "print", "count"];
const mediumKeywords = ["sorting", "binary search", "greedy", "dynamic programming", "graph", "BFS", "DFS", "tree", "matrix", "optimization", "recursion"];
const hardKeywords = ["max flow", "segment tree", "heavy-light decomposition", "FFT", "geometry", "persistent data structure", "bitmask DP", "Centroid Decomposition", "flow", "suffix automaton"];

const mathSymbols = ["+", "-", "*", "/", ">", "<", "=", "∑", "∏", "log", "exp", "sqrt", "%"];

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomDescription(category) {
    let keywords, length, symbolsCount;
    
    if (category === "Easy") {
        keywords = Array.from({length: 3}, () => getRandomItem(easyKeywords));
        length = 20 + Math.floor(Math.random() * 20);
        symbolsCount = 1 + Math.floor(Math.random() * 3);
    } else if (category === "Medium") {
        keywords = Array.from({length: 5}, () => getRandomItem([...easyKeywords, ...mediumKeywords]));
        length = 40 + Math.floor(Math.random() * 40);
        symbolsCount = 3 + Math.floor(Math.random() * 5);
    } else { // Hard
        keywords = Array.from({length: 8}, () => getRandomItem([...mediumKeywords, ...hardKeywords]));
        length = 80 + Math.floor(Math.random() * 80);
        symbolsCount = 8 + Math.floor(Math.random() * 10);
    }
    
    const words = ["In", "this", "problem", "you", "need", "to", "calculate", "the", "given", "value", "using", "the", "algorithm", "and", "data", "structures", "provided", "in", "the", "input", "Each", "case", "contains", "multiple", "integers", "representing", "the", "constraints", "and", "requirements"];
    
    let textArray = Array.from({length}, () => getRandomItem(words));
    
    // Inject keywords
    keywords.forEach(kw => {
        textArray[Math.floor(Math.random() * textArray.length)] = kw;
    });
    
    // Inject math symbols
    for (let i = 0; i < symbolsCount; i++) {
        textArray[Math.floor(Math.random() * textArray.length)] = getRandomItem(mathSymbols);
    }
    
    return textArray.join(" ");
}

const records = [];
for (let i = 0; i < 1000; i++) {
    const classes = ["Easy", "Medium", "Hard"];
    const weights = [0.4, 0.4, 0.2];
    const rand = Math.random();
    let problem_class = "Easy";
    if (rand < 0.4) problem_class = "Easy";
    else if (rand < 0.8) problem_class = "Medium";
    else problem_class = "Hard";
    
    let problem_score;
    if (problem_class === "Easy") problem_score = 800 + Math.floor(Math.random() * 400);
    else if (problem_class === "Medium") problem_score = 1300 + Math.floor(Math.random() * 700);
    else problem_score = 2000 + Math.floor(Math.random() * 1500);
    
    records.push({
        title: `Problem ${1000 + i}`,
        description: generateRandomDescription(problem_class),
        input_description: generateRandomDescription(problem_class),
        output_description: generateRandomDescription(problem_class),
        problem_class: problem_class,
        problem_score: problem_score
    });
}

csvWriter.writeRecords(records)
    .then(() => console.log('Generated problems.csv with 1000 samples.'));
