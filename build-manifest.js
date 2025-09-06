import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const manifestPath = path.resolve("./public/manifest.json");
const distManifestPath = path.resolve("./dist/manifest.json");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

manifest.oauth2.client_id = process.env.GOOGLE_CLIENT_ID;
manifest.key = process.env.GOOGLE_EXTENSION_KEY;

fs.writeFileSync(distManifestPath, JSON.stringify(manifest, null, 2));
