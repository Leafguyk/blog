import fs from 'fs-extra';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const sourceDir = process.env.OBSIDIAN_PATH;
const targetDir = './content';

if (!sourceDir) {
    console.error("❌ Error: OBSIDIAN_PATH not configured in .env file.");
    process.exit(1);
}

console.log(`🚀 Starting blog synchronization...`);
console.log(`Source path: ${sourceDir}`);

try {
    fs.emptyDirSync(targetDir);
    console.log("✅ Existing content folder cleared");

    fs.copySync(sourceDir, targetDir);
    console.log("✅ New content copied");

} catch (err) {
    console.error("❌ Error during synchronization:", err);
    process.exit(1);
}