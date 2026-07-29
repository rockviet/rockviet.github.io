import type { Album } from "../types";
import { FormatIcon } from "./FormatIcon";

const TYPE_COLORS: Record<string, string> = {
    Album: "bg-badge-album/18 text-badge-album ring-1 ring-badge-album/35",
    EP: "bg-badge-ep/18 text-badge-ep ring-1 ring-badge-ep/35",
    Single: "bg-badge-single/18 text-badge-single ring-1 ring-badge-single/35",
    Demo: "bg-badge-demo/18 text-badge-demo ring-1 ring-badge-demo/35",
    "Live Album": "bg-badge-live/18 text-badge-live ring-1 ring-badge-live/35",
    "Live EP": "bg-badge-live/18 text-badge-live ring-1 ring-badge-live/35",
    "Live Show": "bg-badge-live/18 text-badge-live ring-1 ring-badge-live/35",
    "Live Session Album": "bg-badge-live/18 text-badge-live ring-1 ring-badge-live/35",
    "Live Session EP": "bg-badge-live/18 text-badge-live ring-1 ring-badge-live/35",
    Documentary: "bg-badge-other/18 text-zinc-300 ring-1 ring-zinc-500/35",
    Book: "bg-badge-other/18 text-zinc-300 ring-1 ring-zinc-500/35",
    "Demo EP": "bg-badge-demo/18 text-badge-demo ring-1 ring-badge-demo/35",
};

interface Props {
    album: Album;
}

export function AlbumCard({ album }: Props) {
    const badgeBg = TYPE_COLORS[album.albType] ?? "bg-badge-other";

    return (
        <div className="bg-card border border-border rounded-xl p-4 hover:border-accent/40 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-foreground leading-tight">{album.name}</h3>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeBg}`}>
                    {album.albType}
                </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{album.band}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
                {album.genres.map((g) => (
                    <span key={g} className="inline-block px-2 py-0.5 rounded-full text-xs bg-border text-muted-foreground">
                        {g}
                    </span>
                ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                    {album.format.split("/").map((f) => f.trim()).filter(Boolean).map((f) => (
                        <FormatIcon key={f} format={f} className="w-4 h-4" />
                    ))}
                    <span className="ml-0.5">{album.format}</span>
                </span>
                <span className="tabular-nums">{album.date}</span>
            </div>
        </div>
    );
}
