import { useMemo, useState } from "react";
import { useAlbums } from "./hooks/useAlbums";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { FilterBar } from "./components/FilterBar";
import { AlbumTable } from "./components/AlbumTable";
import { AlbumCard } from "./components/AlbumCard";
import { RockVietLogo } from "./components/RockVietLogo";
import { filterAlbums, sortAlbums, uniqueFormats, uniqueYears } from "./utils/filters";
import type { SortField, SortDir } from "./types";

export default function App() {
    const { albums, loading } = useAlbums();
    const [search, setSearch] = useState("");
    const [formatsSelected, setFormatsSelected] = useState<string[]>([]);
    const [yearsSelected, setYearsSelected] = useState<string[]>([]);
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const formats = useMemo(() => uniqueFormats(albums), [albums]);
    const years = useMemo(() => uniqueYears(albums), [albums]);

    const filtered = useMemo(
        () => sortAlbums(filterAlbums(albums, search, formatsSelected, yearsSelected), sortField, sortDir),
        [albums, search, formatsSelected, yearsSelected, sortField, sortDir],
    );

    const { visible, hasMore, sentinelRef } = useInfiniteScroll(filtered);

    function handleSort(field: SortField) {
        if (field === sortField) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir(field === "date" ? "desc" : "asc");
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="relative overflow-hidden border-b border-border bg-card">
                <div
                    className="pointer-events-none absolute inset-0 opacity-90"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 120% at 0% 50%, rgba(220,38,38,0.18), transparent 55%), linear-gradient(90deg, rgba(220,38,38,0.06) 0%, transparent 42%)",
                    }}
                />
                <div className="relative max-w-6xl mx-auto px-4 py-3.5 sm:py-6 flex items-center gap-3 sm:gap-5">
                    <div className="relative shrink-0">
                        <div className="absolute -inset-1.5 sm:-inset-2 rounded-2xl bg-accent/20 blur-lg sm:blur-xl" />
                        <RockVietLogo className="relative w-10 h-10 sm:w-14 sm:h-14" />
                    </div>
                    <div className="min-w-0">
                        <p className="hidden sm:block text-xs font-medium tracking-[0.22em] uppercase text-accent mb-1">
                            Archive
                        </p>
                        <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide text-foreground leading-none">
                            Rock <span className="text-accent">Việt</span>
                        </h1>
                        <p className="hidden sm:block mt-1.5 text-sm text-muted-foreground max-w-md">
                            Cơ sở dữ liệu album rock & metal Việt Nam
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-3 sm:py-6 space-y-3 sm:space-y-4 max-md:pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))]">
                <div
                    className={[
                        "z-40 pointer-events-none overflow-visible",
                        "max-md:fixed max-md:inset-x-0 max-md:bottom-0",
                        "max-md:px-4 max-md:pt-2",
                        "max-md:pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]",
                        "md:sticky md:top-0",
                        "md:pt-[max(0.5rem,env(safe-area-inset-top,0px))]",
                        "md:pb-2",
                    ].join(" ")}
                >
                    <div className="pointer-events-auto max-md:max-w-6xl max-md:mx-auto">
                        <FilterBar
                            search={search} onSearch={setSearch}
                            formatsSelected={formatsSelected} onFormats={setFormatsSelected}
                            yearsSelected={yearsSelected} onYears={setYearsSelected}
                            formats={formats} years={years}
                            total={albums.length} filtered={filtered.length}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-accent border-t-transparent" />
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
                            <AlbumTable
                                albums={visible}
                                sortField={sortField}
                                sortDir={sortDir}
                                onSort={handleSort}
                            />
                        </div>

                        {/* Mobile cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
                            {visible.map((album, i) => (
                                <AlbumCard key={`${album.id}-${i}`} album={album} />
                            ))}
                            {visible.length === 0 && (
                                <p className="col-span-full text-center text-muted-foreground py-12">No results found.</p>
                            )}
                        </div>

                        {/* Infinite scroll sentinel */}
                        <div ref={sentinelRef} className="h-4" />
                        {hasMore && (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent" />
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="text-center text-muted-foreground text-xs py-6 border-t border-border max-md:pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))]">
                Rock Việt — A comprehensive database of Vietnamese rock music
            </footer>
        </div>
    );
}
