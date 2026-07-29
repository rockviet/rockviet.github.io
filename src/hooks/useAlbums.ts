import { useEffect, useState } from "react";
import type { Album } from "../types";

export function useAlbums() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data.json`)
            .then((r) => r.json())
            .then((data: Album[]) => {
                setAlbums(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return { albums, loading };
}
