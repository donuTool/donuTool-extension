import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://localhost:5173";

const manifestPath = path.resolve("./public/manifest.json");
const distManifestPath = path.resolve("./dist/manifest.json");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

manifest.oauth2.client_id = process.env.GOOGLE_CLIENT_ID;
manifest.key = process.env.GOOGLE_EXTENSION_KEY;
// 대시보드 웹이 chrome.runtime.sendMessage로 로그인 토큰을 받아갈 수 있는 origin
manifest.externally_connectable = {
  matches: [`${new URL(DASHBOARD_URL).origin}/*`],
};

fs.writeFileSync(distManifestPath, JSON.stringify(manifest, null, 2));
