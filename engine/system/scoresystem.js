class ScoreSystem {

    constructor(config) {
        this.currentScore = config.player.startScore;
        this.incrementValue = config.rules.tapIncrement;
    }

    addScore() {
        this.currentScore += this.incrementValue;
        console.log("Current Score:", this.currentScore);
    }

}

module.exports = ScoreSystem;