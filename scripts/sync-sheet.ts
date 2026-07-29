import { config } from "dotenv";
import { google } from "googleapis";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { Album } from "../src/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

async function main() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!email || !key || !spreadsheetId) {
        throw new Error("Missing env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEETS_SPREADSHEET_ID");
    }

    const auth = new google.auth.GoogleAuth({
        credentials: { client_email: email, private_key: key },
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "'rockviet-data'",
    });

    const rows = res.data.values ?? [];
    const header = rows[0];
    const colIdx = (name: string) => header.indexOf(name);

    const albums: Album[] = [];
    for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r || !r[colIdx("Name")]) continue;

        const dateRaw = r[colIdx("Date")] ?? "";
        let year = 0;
        const parts = dateRaw.split("/");
        if (parts.length === 3) year = Number(parts[2]);
        else if (parts.length === 2) year = Number(parts[1]);
        else if (parts.length === 1) year = Number(parts[0]);
        if (isNaN(year) || year < 1900) year = 0;

        albums.push({
            id: r[colIdx("ID")] ?? String(i),
            name: r[colIdx("Name")] ?? "",
            band: r[colIdx("Band")] ?? "",
            albType: r[colIdx("AlbType")] ?? "",
            genres: (r[colIdx("Genres")] ?? "").split("/").map((s: string) => s.trim()).filter(Boolean),
            format: r[colIdx("Format")] ?? "",
            date: dateRaw,
            year,
        });
    }

    const outPath = resolve(__dirname, "../public/data.json");
    writeFileSync(outPath, JSON.stringify(albums, null, 2), "utf-8");
    console.log(`Synced ${albums.length} albums to ${outPath}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
