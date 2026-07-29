import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "favicon.ico",
                "favicon.svg",
                "favicon-16x16.png",
                "favicon-32x32.png",
                "apple-touch-icon.png",
                "og-image.png",
                "icons/*.png",
                "manifest.webmanifest",
            ],
            manifest: false,
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,json,woff,woff2}"],
                navigateFallback: "/index.html",
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => url.pathname.endsWith("/data.json"),
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "rockviet-data",
                            networkTimeoutSeconds: 8,
                            expiration: {
                                maxEntries: 1,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
            devOptions: {
                enabled: false,
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
