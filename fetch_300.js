const fs = require('fs');

async function fetchRealProblems() {
    console.log("Fetching problem list from Codeforces API...");
    try {
        const response = await fetch('https://codeforces.com/api/problemset.problems');
        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error("Failed to fetch from Codeforces API");
        }

        const problems = data.result.problems;
        const stats = data.result.problemStatistics;

        // Map solved count to problems
        const merged = problems.map(p => {
            const s = stats.find(stat => stat.contestId === p.contestId && stat.index === p.index);
            return {
                ...p,
                solvedCount: s ? s.solvedCount : 0
            };
        });

        // Filter for problems with ratings and tags
        const rated = merged.filter(p => p.rating && p.tags && p.tags.length > 0);

        // Sort by rating to get a diverse spread
        rated.sort((a, b) => a.rating - b.rating);

        console.log(`Found ${rated.length} rated problems. Selecting 300 diverse samples...`);

        // Select 300 problems across the range
        const step = Math.floor(rated.length / 300);
        const selected = [];
        for (let i = 0; i < rated.length && selected.length < 300; i += step) {
            selected.push(rated[i]);
        }

        fs.writeFileSync('cf_300_metadata.json', JSON.stringify(selected, null, 2));
        console.log("Saved 300 problem metadata samples to cf_300_metadata.json");
    } catch (err) {
        console.error("Error fetching problems:", err);
    }
}

fetchRealProblems();
