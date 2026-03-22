class TimerSystem {
    constructor(config) {
        this.timeLimit = config?.timer?.limit || 60;
        this.remaining = this.timeLimit;
        this.interval = null;
        this.engine = null;
    }

    attachEngine(engine) {
        this.engine = engine;
    }

    start() {
        try {
            console.log(` Time Limit: ${this.timeLimit}s`);

            this.interval = setInterval(() => {
                this.remaining--;

                if (this.remaining <= 0) {
                    console.log("\n Time's Up!");
                    this.stop();

                    if (this.engine && typeof this.engine.onGameEnd === "function") {
                        this.engine.onGameEnd("TIME_UP");
                    }
                }

            }, 1000);

        } catch (err) {
            console.error("[TimerSystem ERROR]", err.message);
        }
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    getTime() {
        return this.remaining;
    }
}

module.exports = TimerSystem;