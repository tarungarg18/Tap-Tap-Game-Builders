const path = require("path");
const GameEngine = require("../engine/core/engine");
const loadGameConfig = require("../engine/utils/configloader");
const ScoreSystem = require("../engine/system/scoresystem");
const InputSystem = require("../engine/system/inputsystem");


const configPath = path.join(__dirname, "../config/game-config.json");


const gameConfig = loadGameConfig(configPath);
const engine = new GameEngine(gameConfig);
const scoreSystem = new ScoreSystem(gameConfig);
const inputSystem = new InputSystem(scoreSystem,gameConfig);


engine.addSystem(inputSystem);
engine.addSystem(scoreSystem);


engine.start();