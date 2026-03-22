const Leaderboard = require("../system/leaderboard");
const TimerSystem = require("../system/timersystem");
const APIClient = require("../utils/apiclient");
const loadConfig = require("../utils/configloader");
const path = require("path");
const ScoreSystem = require("../system/scoresystem");
const InputSystem = require("../system/inputsystem");

class GameEngine {
    constructor(config) {
        this.config = config || {};
        this.running = false;
        this.game = null;
        this.scoreSystem = null;
        this.ended = false;
        this.lastMessage = "";
        this.inputSystem = null;

        this.initSystems();
    }

    initSystems() {
        this.timer = new TimerSystem(this.config);
        this.timer.attachEngine(this);

        this.leaderboard = new Leaderboard(this.config.type || "game");
    }

    setGame(game) {
        if (!game || typeof game !== "object") {
            throw new Error("Invalid game instance");
        }

        const requiredMethods = ["init", "handleInput", "update", "render"];
        for (const method of requiredMethods) {
            if (typeof game[method] !== "function") {
                throw new Error(`Game missing method: ${method}`);
            }
        }

        this.game = game;
    }

    setScoreSystem(scoreSystem) {
        this.scoreSystem = scoreSystem;
    }

    setInputSystem(inputSystem) {
        this.inputSystem = inputSystem;
    }

    start() {
        try {
            if (!this.game) throw new Error("Game not set");

            console.clear();
            console.log("Starting Engine...");
            console.log("Game:", this.config.type);

            this.running = true;
            this.ended = false;

            this.timer.start();
            this.safeCall(() => this.game.init());

            const fps = this.config?.game?.fps || 10;

            const loop = () => {
                if (!this.running) return;

                try {
                    this.safeCall(() => this.game.update());

                    if (this.game.gameOver && !this.ended) {
                        this.endGame("WIN");
                        return;
                    }

                    if (this.game.needsRender && !this.ended) {
                        console.clear();

                        this.safeCall(() => this.game.render());

                        if (this.scoreSystem) {
                            console.log("\nScore:", this.safeScore());
                        }

                        console.log(`Time Left: ${this.timer.getTime()}s`);

                        this.game.needsRender = false;
                        return;
                    }

                } catch (err) {
                    this.handleError("LOOP_ERROR", err);
                }

                setTimeout(loop, 1000 / fps);
            };

            loop();

        } catch (err) {
            this.handleError("START_ERROR", err);
        }
    }

    receiveInput(input) {
        try {
            if (!this.game || this.ended) return;

            const result = this.safeCall(() =>
                this.game.handleInput(input)
            );

            if (!result || typeof result !== "object") return;

            if (result.message) {
                this.lastMessage = result.message || "";
            }

            if (this.scoreSystem) {
                this.safeCall(() => this.scoreSystem.apply(result));
            }

            if (result.type === "WIN") {
                this.game.gameOver = true;
                this.endGame("WIN");
                return;
            }

            if (result.type === "LOSE") {
                this.game.gameOver = true;
                this.endGame("LOSE");
                return;
            }

            this.game.needsRender = true;
            this.renderNow();

        } catch (err) {
            this.handleError("INPUT_ERROR", err);
        }
    }

    safeScore() {
        try {
            return this.scoreSystem?.getScore() ?? 0;
        } catch {
            return 0;
        }
    }

    renderNow() {
        try {
            if (this.ended) return;

            console.clear();

            this.safeCall(() => this.game.render());

            if (this.lastMessage) {
                console.log("\n" + this.lastMessage);
            }

            if (this.scoreSystem) {
                console.log("\nScore:", this.safeScore());
            }

            console.log(`Time Left: ${this.timer.getTime()}s`);

            this.game.needsRender = false;

        } catch (err) {
            this.handleError("RENDER_ERROR", err);
        }
    }

    async endGame(reason = "FINISHED") {
        if (this.ended) return;
        this.ended = true;

        try {
            this.running = false;
            this.timer.stop();

            console.log("\n Game Ended:", reason);

            const finalScore = this.safeScore();

            try {
                process.stdin.setRawMode(false);
            } catch {}


            const name = await this.getPlayerName();

            this.leaderboard.addEntry(name, finalScore);
            this.leaderboard.display();

            await APIClient.submitScore({
                name,
                score: finalScore,
                game: this.config.type,
                reason
            });

            const nextLevel = this.getNextLevel();
            if (reason === "WIN" && nextLevel) {
                console.log(`\n Loading ${nextLevel}...\n`);

                const configPath = path.join(
                    process.cwd(),
                    "game",
                    this.config.type,
                    nextLevel
                );

                const newConfig = loadConfig(configPath);

                if (!newConfig || Object.keys(newConfig).length === 0) {
                    console.log("No more levels. Game completed!");
                    process.exit();
                }

                const GameClass = this.game.constructor;

                this.config = newConfig;
                this.game = new GameClass(newConfig);
                this.scoreSystem = new ScoreSystem(newConfig);

                this.initSystems();

                this.running = false;
                this.ended = false;
                process.stdin.removeAllListeners("data");

                new InputSystem(this);

                this.start();
                return;
            }

        } catch (err) {
            this.handleError("END_ERROR", err);
        }

        console.log("\n Exiting...");

        process.stdin.pause();
        process.stdin.removeAllListeners("data");

        process.exit();
    }

    onGameEnd(reason) {
        this.endGame(reason);
    }

    getPlayerName() {
        return new Promise((resolve) => {
            process.stdout.write("\nEnter your name: ");

            process.stdin.once("data", (data) => {
                resolve(data.toString().trim());
            });
        });
    }

    getNextLevel() {
        try {
            const current = this.config?.level;
            const num = parseInt(current.match(/\d+/)?.[0]);

            if (!num) return null;

            return `level${num + 1}.json`;

        } catch {
            return null;
        }
    }

    safeCall(fn) {
        try {
            return fn();
        } catch (err) {
            this.handleError("GAME_ERROR", err);
        }
    }

    handleError(type, err) {
        console.error(` [Engine ${type}]`, err.message);
    }
}

module.exports = GameEngine;