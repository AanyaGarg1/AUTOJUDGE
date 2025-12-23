const fs = require('fs');

// Read the UTF-16LE file
const rawData = fs.readFileSync('cf_problems.json', 'utf16le').replace(/^\uFEFF/, '');
const data = JSON.parse(rawData);

const problems = data.problems;
const statistics = data.problemStatistics;

// Map stats to problems
const problemsWithStats = problems.map(p => {
    const stat = statistics.find(s => s.contestId === p.contestId && s.index === p.index);
    return { ...p, solvedCount: stat ? stat.solvedCount : 0 };
});

// Filter for problems with ratings
const ratedProblems = problemsWithStats.filter(p => p.rating);

// Select 10 Easy (800-900), 10 Medium (1500-1600), 10 Hard (2200+)
const easy = ratedProblems.filter(p => p.rating >= 800 && p.rating <= 900).slice(0, 10);
const medium = ratedProblems.filter(p => p.rating >= 1500 && p.rating <= 1600).slice(0, 10);
const hard = ratedProblems.filter(p => p.rating >= 2200).slice(0, 10);

const selected = [...easy, ...medium, ...hard];

fs.writeFileSync('selected_problems.json', JSON.stringify(selected, null, 2));
console.log(`Selected ${selected.length} problems.`);
selected.forEach(p => console.log(`${p.rating}: ${p.contestId}${p.index} - ${p.name}`));
