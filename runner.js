const path = require("path");
const GameEngine = require("./engine/core/engine");
const InputSystem = require("./engine/system/inputsystem");
const ScoreSystem = require("./engine/system/scoresystem");
const loadConfig = require("./engine/utils/configloader");

const GAME_NAME = process.argv[2];
const LEVEL = process.argv[3];

function main() {
    try {
        const gamePath = path.join(__dirname, "game", GAME_NAME, "game.js");
        const configPath = path.join(__dirname, "game", GAME_NAME, LEVEL);

        const GameClass = require(gamePath);
        const config = loadConfig(configPath);

        if (!GameClass) throw new Error("Invalid game module");

        const engine = new GameEngine(config);
        const game = new GameClass(config);
        const scoreSystem = new ScoreSystem(config);

        engine.setGame(game);
        engine.setScoreSystem(scoreSystem);

        new InputSystem(engine);

        engine.start();

    } catch (err) {
        console.error(" [Runner ERROR]", err.message);
        console.log("Usage: node runner.js <gameName> <levelFile>");
    }
}

main();