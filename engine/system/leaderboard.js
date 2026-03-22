const fs = require("fs");
const path = require("path");

class Leaderboard {
    constructor(gameName) {
        this.file = path.join(__dirname, `../../leaderboard_${gameName}.json`);
        this.data = this.load();
    }

    load() {
        try {
            if (!fs.existsSync(this.file)) return [];
            return JSON.parse(fs.readFileSync(this.file));
        } catch {
            return [];
        }
    }

    save() {
        fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
    }

    addEntry(name, score) {
        try {
            this.data.push({
                name,
                score,
                time: new Date().toISOString()
            });

            this.data.sort((a, b) => b.score - a.score);

            this.data = this.data.slice(0, 10);

            this.save();

        } catch (err) {
            console.error("[Leaderboard ERROR]", err.message);
        }
    }

    display() {
        console.log("\n Leaderboard:");
        this.data.forEach((entry, i) => {
            console.log(`${i + 1}. ${entry.name} - ${entry.score}`);
        });
    }
}

module.exports = Leaderboard;