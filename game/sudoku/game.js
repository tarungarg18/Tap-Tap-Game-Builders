class SudokuGame {
    constructor(config) {
        this.config = config;

        this.board = config.board;
        this.solution = config.solution;

        this.size = config.gridSize;

        this.inputConfig = config.input || {};
        this.validation = config.validation || {};
        this.messages = config.messages || {};

        this.needsRender = true;
        this.gameOver = false;
    }

    init() {
        console.log(` ${this.config?.game?.title}`);
    }

    handleInput(input) {
        try {
            const separator = this.inputConfig.separator || " ";
            const expectedLength = this.inputConfig.expectedLength;

            const parts = input.split(separator);

            if (parts.length !== expectedLength) {
                return {
                    type: "INVALID",
                    message: this.messages.invalidFormat
                };
            }

            const [r, c, val] = parts.map(Number);

            if ([r, c, val].some(isNaN)) {
                return {
                    type: "INVALID",
                    message: this.messages.invalidFormat
                };
            }

            if (!this.isValidCell(r, c)) {
                return {
                    type: "INVALID",
                    message:
                        this.messages.invalidCell 
                };
            }

            if (
                !this.validation.allowOverwrite &&
                this.board[r][c] !== 0
            ) {
                return {
                    type: "INVALID",
                    message:
                        this.messages.filled 
                };
            }

            if (this.solution[r][c] === val) {
                this.board[r][c] = val;

                if (this.isSolved()) {
                    this.gameOver = true;
                    return { type: "WIN" };
                }

                return { type: "MOVE" };
            }

            return {
                type: "INVALID",
                message: this.messages.wrong
            };

        } catch (err) {
            return { type: "ERROR" };
        }
    }

    update() {
    }

    render() {
        console.table(this.board);

        console.log(
            `Enter: ${this.inputConfig.format}`
        );
    }

    isValidCell(r, c) {
        return (
            Number.isInteger(r) &&
            Number.isInteger(c) &&
            r >= 0 &&
            r < this.size &&
            c >= 0 &&
            c < this.size
        );
    }

    isSolved() {
        return JSON.stringify(this.board) === JSON.stringify(this.solution);
    }
}

module.exports = SudokuGame;