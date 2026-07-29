import type { Album, SortField, SortDir } from "../types";
import { AlbumRow } from "./AlbumRow";

interface Props {
    albums: Album[];
    sortField: SortField;
    sortDir: SortDir;
    onSort: (field: SortField) => void;
}

function SortArrow({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
    if (field !== current) return <span className="text-muted-foreground ml-1">↕</span>;
    return <span className="text-accent ml-1">{dir === "asc" ? "↑" : "↓"}</span>;
}

export function AlbumTable({ albums, sortField, sortDir, onSort }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="py-3 px-3 w-12">#</th>
                        <th
                            className="py-3 px-3 cursor-pointer hover:text-accent select-none"
                            onClick={() => onSort("name")}
                        >
                            Album Name
                            <SortArrow field="name" current={sortField} dir={sortDir} />
                        </th>
                        <th className="py-3 px-3">Band / Artist</th>
                        <th className="py-3 px-3 w-24">Type</th>
                        <th className="py-3 px-3">Tags</th>
                        <th className="py-3 px-3 w-16">Format</th>
                        <th
                            className="py-3 px-3 w-28 cursor-pointer hover:text-accent select-none"
                            onClick={() => onSort("date")}
                        >
                            Release
                            <SortArrow field="date" current={sortField} dir={sortDir} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {albums.map((album, i) => (
                        <AlbumRow key={`${album.id}-${i}`} album={album} index={i + 1} />
                    ))}
                </tbody>
            </table>
            {albums.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No results found.</p>
            )}
        </div>
    );
}
