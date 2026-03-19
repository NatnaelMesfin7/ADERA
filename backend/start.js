const fs = require("fs");
const path = require("path");

const entryPath = path.join(__dirname, "dist", "index.js");

if (!fs.existsSync(entryPath)) {
  console.error(
    "Build output not found. Run `npm run build` first, or use `npm run dev` for local development.",
  );
  process.exit(1);
}

require(entryPath);
