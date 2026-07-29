import { useEffect, useState } from "react";
import type { Album } from "../types";

const dataUrl = `${import.meta.env.BASE_URL}data.json`;

async function fetchAlbums(): Promise<Album[]> {
    const response = await fetch(dataUrl, { cache: "no-cache" });
    if (!response.ok) {
        throw new Error(`Failed to load albums: ${response.status}`);
    }
    return response.json() as Promise<Album[]>;
}

export function useAlbums() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await fetchAlbums();
                if (!cancelled) {
                    setAlbums(data);
                }
            } catch {
                // Keep previous albums when offline refetch fails.
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void load();

        const onOnline = () => {
            void load();
        };

        window.addEventListener("online", onOnline);
        return () => {
            cancelled = true;
            window.removeEventListener("online", onOnline);
        };
    }, []);

    return { albums, loading };
}
