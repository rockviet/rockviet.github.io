/**
 * Generate static Open Graph image from @ogimagecn/logo component.
 *
 * Usage:
 *   pnpm og
 *
 * Output:
 *   public/og-image.png (1200x630)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { Logo } from "../src/components/og/logo";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outPath = resolve(root, "public/og-image.png");

const SITE = {
    brand: "Rock Việt",
    tagline: "Vietnamese Rock & Metal Album Database",
    monogram: "RV",
    background: "#09090b",
    logoPath: resolve(root, "public/icons/icon-rounded-512.png"),
};

async function loadFont(): Promise<ArrayBuffer> {
    // Noto Sans Bold includes Vietnamese glyphs (ệ, etc.)
    const url =
        "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Bold.ttf";
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to download font: ${res.status} ${url}`);
    }
    return res.arrayBuffer();
}

function toDataUri(pngPath: string): string {
    const buf = readFileSync(pngPath);
    return `data:image/png;base64,${buf.toString("base64")}`;
}

async function main() {
    const fontData = await loadFont();
    const logo = toDataUri(SITE.logoPath);

    const element = (
        <Logo
            brand={SITE.brand}
            tagline={SITE.tagline}
            monogram={SITE.monogram}
            background={SITE.background}
            logo={logo}
        />
    );

    const svg = await satori(element, {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: "Noto Sans",
                data: fontData,
                weight: 700,
                style: "normal",
            },
        ],
    });

    const resvg = new Resvg(svg, {
        fitTo: { mode: "width", value: 1200 },
    });
    const png = resvg.render().asPng();
    writeFileSync(outPath, png);
    console.log(`Wrote ${outPath} (${png.byteLength} bytes)`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
