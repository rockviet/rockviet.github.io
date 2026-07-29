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
    index: number;
}

export function AlbumRow({ album, index }: Props) {
    const badgeBg = TYPE_COLORS[album.albType] ?? "bg-badge-other";
    const bands = album.band.split("/").map((s) => s.trim()).filter(Boolean);

    return (
        <tr className="border-b border-border hover:bg-card-hover transition-colors">
            <td className="py-3 px-3 text-muted-foreground tabular-nums">{index}</td>
            <td className="py-3 px-3 font-medium text-foreground">{album.name}</td>
            <td className="py-3 px-3 text-muted-foreground">
                {bands.length > 1 ? (
                    <div className="flex flex-col gap-0.5">
                        {bands.map((b, i) => (
                            <span key={`${b}-${i}`}>{b}</span>
                        ))}
                    </div>
                ) : (
                    album.band
                )}
            </td>
            <td className="py-3 px-3">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeBg}`}>
                    {album.albType}
                </span>
            </td>
            <td className="py-3 px-3">
                <div className="flex flex-wrap gap-1.5">
                    {album.genres.map((g) => (
                        <span key={g} className="inline-block px-2 py-0.5 rounded-full text-xs bg-border text-muted-foreground">
                            {g}
                        </span>
                    ))}
                </div>
            </td>
            <td className="py-3 px-3" title={album.format}>
                <div className="flex justify-center gap-1">
                    {album.format.split("/").map((f) => f.trim()).filter(Boolean).map((f) => (
                        <FormatIcon key={f} format={f} />
                    ))}
                </div>
            </td>
            <td className="py-3 px-3 text-muted-foreground tabular-nums whitespace-nowrap">{album.date}</td>
        </tr>
    );
}
