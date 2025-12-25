const fs = require("fs/promises");
const path = require("path");

async function saveMatchesBySeason(matches, season) {
    const baseDir = path.resolve("data/matches", `${season}`);

    // cria a pasta se não existir
    await fs.mkdir(baseDir, { recursive: true });

    // salva o arquivo
    const filePath = path.join(baseDir, "matches.json");

    await fs.writeFile(filePath, JSON.stringify(matches, null, 2), "utf8");

    console.log(`[SAVE] Saved ${matches.length} matches in ${filePath}`);
}

module.exports = saveMatchesBySeason;
