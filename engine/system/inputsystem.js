const readline = require("readline");

class InputSystem {

    constructor(scoreSystem) {
        this.scoreSystem = scoreSystem;
        readline.emitKeypressEvents(process.stdin);

        process.stdin.setRawMode(true);
        process.stdin.on("keypress", (str, key) => {

            if (key.name === "space") {
                this.scoreSystem.addScore();
            }
            if (key.ctrl && key.name === "c") {
                process.exit();
            }
        });
    }

    update(){};

}

module.exports = InputSystem;