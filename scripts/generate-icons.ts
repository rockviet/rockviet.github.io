/**
 * Generate favicon + PWA icons from brand assets.
 *
 * Workflow:
 * 1. Edit SVG in assets/brand/source/*.svg
 * 2. Run: npm run icons -- --from-svg
 *    (renders SVG -> PNG masters, then all public icons)
 *
 * Or skip SVG and only resize existing PNG masters:
 *    npm run icons
 *
 * Masters (assets/brand/):
 *   - logo-transparent.png  -> header logo, favicon.svg/png
 *   - icon-square.png       -> PWA icons, apple-touch-icon
 *   - icon-rounded.png      -> optional rounded app preview
 */

import { mkdirSync, copyFileSync, existsSync, writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const brandDir = resolve(root, "assets/brand");
const sourceDir = resolve(brandDir, "source");
const publicDir = resolve(root, "public");
const iconsDir = resolve(publicDir, "icons");

const fromSvg = process.argv.includes("--from-svg");

const VARIANTS = [
    { key: "logo-transparent", svg: "logo-transparent.svg", png: "logo-transparent.png" },
    { key: "icon-square", svg: "icon-square.svg", png: "icon-square.png" },
    { key: "icon-rounded", svg: "icon-rounded.svg", png: "icon-rounded.png" },
] as const;

async function ensureMastersFromSvg() {
    for (const v of VARIANTS) {
        const svgPath = resolve(sourceDir, v.svg);
        const pngPath = resolve(brandDir, v.png);
        if (!existsSync(svgPath)) {
            console.warn(`Skip SVG render (missing): ${v.svg}`);
            continue;
        }
        await sharp(svgPath).png().toFile(pngPath);
        console.log(`Rendered ${v.svg} -> ${v.png}`);
    }
}

async function resize(input: string, output: string, size: number, opts?: { background?: string }) {
    let pipeline = sharp(input).resize(size, size, {
        fit: "contain",
        background: opts?.background
            ? undefined
            : { r: 0, g: 0, b: 0, alpha: 0 },
    });

    if (opts?.background) {
        const bg = opts.background;
        pipeline = sharp(input)
            .resize(size, size, { fit: "contain", background: bg })
            .flatten({ background: bg });
    }

    await pipeline.png().toFile(output);
    console.log(`  ${output.replace(root + "/", "")} (${size}x${size})`);
}

async function makeMaskable(input: string, output: string, size: number) {
    // Safe zone ~80%: pad content then place on dark bg
    const inner = Math.round(size * 0.8);
    const pad = Math.round((size - inner) / 2);
    const resized = await sharp(input)
        .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

    await sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: { r: 26, g: 26, b: 26, alpha: 1 },
        },
    })
        .composite([{ input: resized, left: pad, top: pad }])
        .png()
        .toFile(output);

    console.log(`  ${output.replace(root + "/", "")} (maskable ${size}x${size})`);
}

async function makeIco(inputs: { path: string; size: number }[], output: string) {
    // Minimal ICO: pack PNG payloads (modern browsers accept PNG-in-ICO)
    const images = [];
    for (const item of inputs) {
        const buf = await sharp(item.path)
            .resize(item.size, item.size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer();
        images.push({ size: item.size, buf });
    }

    const count = images.length;
    const headerSize = 6 + count * 16;
    let offset = headerSize;
    const entries: Buffer[] = [];
    const payloads: Buffer[] = [];

    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(count, 4);

    for (const img of images) {
        const entry = Buffer.alloc(16);
        entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
        entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
        entry.writeUInt8(0, 2);
        entry.writeUInt8(0, 3);
        entry.writeUInt16LE(1, 4);
        entry.writeUInt16LE(32, 6);
        entry.writeUInt32LE(img.buf.length, 8);
        entry.writeUInt32LE(offset, 12);
        entries.push(entry);
        payloads.push(img.buf);
        offset += img.buf.length;
    }

    writeFileSync(output, Buffer.concat([header, ...entries, ...payloads]));
    console.log(`  ${output.replace(root + "/", "")} (ico)`);
}

async function main() {
    mkdirSync(iconsDir, { recursive: true });
    mkdirSync(brandDir, { recursive: true });

    if (fromSvg) {
        console.log("Rendering SVG sources -> PNG masters...");
        await ensureMastersFromSvg();
    }

    const transparent = resolve(brandDir, "logo-transparent.png");
    const square = resolve(brandDir, "icon-square.png");
    const rounded = resolve(brandDir, "icon-rounded.png");

    for (const p of [transparent, square, rounded]) {
        if (!existsSync(p)) {
            throw new Error(`Missing master: ${p}\nRun with --from-svg or place PNG masters in assets/brand/`);
        }
    }

    console.log("Generating public icons...");

    // Header / inline logo
    await resize(transparent, resolve(iconsDir, "logo.png"), 512);
    await resize(transparent, resolve(iconsDir, "logo-192.png"), 192);

    // Favicons from transparent
    await resize(transparent, resolve(publicDir, "favicon-16x16.png"), 16);
    await resize(transparent, resolve(publicDir, "favicon-32x32.png"), 32);
    await resize(transparent, resolve(iconsDir, "favicon-48.png"), 48);

    // Copy SVG favicon if present
    const faviconSvg = resolve(sourceDir, "logo-transparent.svg");
    if (existsSync(faviconSvg)) {
        copyFileSync(faviconSvg, resolve(publicDir, "favicon.svg"));
        console.log("  public/favicon.svg");
    }

    await makeIco(
        [
            { path: resolve(publicDir, "favicon-16x16.png"), size: 16 },
            { path: resolve(publicDir, "favicon-32x32.png"), size: 32 },
            { path: resolve(iconsDir, "favicon-48.png"), size: 48 },
        ],
        resolve(publicDir, "favicon.ico"),
    );

    // PWA / install icons from square
    await resize(square, resolve(iconsDir, "icon-192.png"), 192);
    await resize(square, resolve(iconsDir, "icon-512.png"), 512);
    await resize(rounded, resolve(iconsDir, "icon-rounded-512.png"), 512);
    await resize(square, resolve(publicDir, "apple-touch-icon.png"), 180);
    await makeMaskable(square, resolve(iconsDir, "icon-maskable-512.png"), 512);

    // Manifest
    const manifest = {
        name: "Rock Việt",
        short_name: "Rock Việt",
        description: "A comprehensive database of Vietnamese rock music",
        start_url: "/",
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#1a1a1a",
        lang: "vi",
        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-maskable-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
    writeFileSync(resolve(publicDir, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));
    console.log("  public/manifest.webmanifest");

    // Tiny readme next to brand assets
    writeFileSync(
        resolve(brandDir, "README.md"),
        `# Brand assets

## Masters (PNG)
- \`logo-transparent.png\` — header + favicon
- \`icon-square.png\` — PWA / apple-touch
- \`icon-rounded.png\` — rounded preview

## Editable SVG
Edit files in \`source/\`, then:

\`\`\`bash
npm run icons -- --from-svg
\`\`\`

Resize only from current PNG masters:

\`\`\`bash
npm run icons
\`\`\`
`,
    );

    console.log("Done.");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
