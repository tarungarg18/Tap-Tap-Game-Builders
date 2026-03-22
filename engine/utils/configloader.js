const fs = require("fs");

function loadGameConfig(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error("Config file not found");
        }

        const fileData = fs.readFileSync(filePath, "utf8");
        const parsedConfig = JSON.parse(fileData);

        return parsedConfig;

    } catch (err) {
        console.error(" [ConfigLoader ERROR]", err.message);
        return {};
    }
}

module.exports = loadGameConfig;