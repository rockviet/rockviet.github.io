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
    const bands = album.band.split("/").map((s) => s.trim()).filter(Boolean);
    const formats = album.format.split("/").map((s) => s.trim()).filter(Boolean);

    return (
        <div className="bg-card border border-border rounded-xl p-4 hover:border-accent/40 transition-colors space-y-2.5">
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground leading-tight min-w-0">{album.name}</h3>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${badgeBg}`}>
                    {album.albType}
                </span>
            </div>

            <div className="flex items-start justify-between gap-2 text-sm text-muted-foreground">
                {bands.length > 1 ? (
                    <span className="flex flex-col gap-0.5 min-w-0">
                        {bands.map((b, i) => (
                            <span key={`${b}-${i}`}>{b}</span>
                        ))}
                    </span>
                ) : (
                    <span className="min-w-0">{album.band}</span>
                )}
                <span className="shrink-0 tabular-nums text-xs pt-0.5">{album.date}</span>
            </div>

            <div className="flex items-end justify-between gap-2">
                <div className="flex flex-wrap gap-1.5 min-w-0">
                    {album.genres.map((g) => (
                        <span key={g} className="inline-block px-2 py-0.5 rounded-full text-xs bg-border text-muted-foreground">
                            {g}
                        </span>
                    ))}
                </div>
                <span className="flex items-center gap-1 shrink-0" title={album.format}>
                    {formats.map((f) => (
                        <FormatIcon key={f} format={f} className="w-4 h-4" />
                    ))}
                </span>
            </div>
        </div>
    );
}
