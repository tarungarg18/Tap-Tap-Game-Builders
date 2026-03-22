class InputSystem {
    constructor(engine) {
        if (!engine) throw new Error("Engine reference required");

        this.engine = engine;
        this.buffer = "";
        this.active = false;

        this.init();
    }

    init() {
        try {
            this.enable();

            process.stdin.on("data", (key) => {
                if (!this.active) return;
                this.handleKey(key);
            });

        } catch (err) {
            this.handleError("INIT_ERROR", err);
        }
    }

    enable() {
        try {
            this.active = true;

            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.setEncoding("utf8");

            process.stdout.write("> ");

        } catch (err) {
            this.handleError("ENABLE_ERROR", err);
        }
    }

    disable() {
        try {
            this.active = false;

            try {
                process.stdin.setRawMode(false);
            } catch {}

        } catch (err) {
            this.handleError("DISABLE_ERROR", err);
        }
    }

    handleKey(key) {
        try {
            if (key === "\r") {
                console.log();

                const input = this.buffer.trim();

                if (input.length > 0) {
                    this.engine.receiveInput(input);
                }

                this.buffer = "";
                process.stdout.write("> ");
                return;
            }

            if (key === "\u0008" || key === "\u007f") {
                if (this.buffer.length > 0) {
                    this.buffer = this.buffer.slice(0, -1);
                    process.stdout.write("\b \b");
                }
                return;
            }

            if (key === "\u0003") {
                console.log("\nExiting...");
                process.exit();
            }

            this.buffer += key;
            process.stdout.write(key);

        } catch (err) {
            this.handleError("KEY_ERROR", err);
        }
    }

    handleError(type, err) {
        console.error(` [InputSystem ${type}]`, err.message);
    }
}

module.exports = InputSystem;