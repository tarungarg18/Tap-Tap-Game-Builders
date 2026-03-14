class GameEngine {

    constructor(config) {
        this.config = config;
        this.systems = [];
        this.running = false;
    }

    addSystem(system) {
        this.systems.push(system);
    }

    start() {
        console.log("Starting Engine...");
        console.log("Game:", this.config.game.title);
        console.log("\nPress SPACE to increase score");

        this.running = true;

        const loop = () => {
            if (!this.running) return;
            this.systems.forEach(system => {
                if (system.update) {
                    system.update();
                }
            });
            setTimeout(loop, 1000 / this.config.game.fps);
        };
        loop();
    }

}

module.exports = GameEngine;