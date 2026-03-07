// Sample game using TaPTaP Game Engine

const Engine = require("../engine/engine");
const config = require("../config/game-config.sample.json");

// Create game instance
const game = new Engine(config);

// Register game systems
game.registerSystem("Input", (state) => {
    if (state.input === "tap") {
        state.player.y += 5;
    }
});

game.registerSystem("Physics", (state) => {
    const gravity = -1;
    state.player.y += gravity;
});

game.registerSystem("Render", (state) => {
    console.clear();
    console.log("Player position:", state.player.y);
});

// Initial game state
game.setInitialState({
    player: {
        y: 10
    },
    input: null
});

// Example input simulation
setInterval(() => {
    game.state.input = Math.random() > 0.7 ? "tap" : null;
}, 500);

// Start the engine
game.start();
