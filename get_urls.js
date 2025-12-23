const fs = require('fs');
const selected = JSON.parse(fs.readFileSync('selected_problems.json', 'utf8'));

// Take 3 from each category for a quick start
const easy = selected.filter(p => p.rating <= 1000).slice(0, 5);
const medium = selected.filter(p => p.rating > 1000 && p.rating <= 1800).slice(0, 5);
const hard = selected.filter(p => p.rating > 1800).slice(0, 5);

const list = [...easy, ...medium, ...hard];
list.forEach(p => {
    console.log(`https://codeforces.com/problemset/problem/${p.contestId}/${p.index} | Rating: ${p.rating}`);
});
