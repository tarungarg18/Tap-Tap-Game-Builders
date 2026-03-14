const readline = require("readline");

class InputSystem {

<<<<<<< HEAD
    constructor(scoreSystem) {
        this.scoreKey = config.controls.scoreKey;
=======
    constructor(scoreSystem,config) {
>>>>>>> 8b15741 (Added Input Logic from JSON)
        this.scoreSystem = scoreSystem;
        this.scoreKey = config.controls.scoreKey;
        readline.emitKeypressEvents(process.stdin);

        process.stdin.setRawMode(true);
        process.stdin.on("keypress", (str, key) => {

            if (key.name === this.scoreKey) {
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
