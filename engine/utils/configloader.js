const fs = require("fs");

function loadGameConfig(filePath) {

    const fileData = fs.readFileSync(filePath, "utf8");

    const parsedConfig = JSON.parse(fileData);

    return parsedConfig;
}

module.exports = loadGameConfig;