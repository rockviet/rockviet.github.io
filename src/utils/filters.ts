import type { Album, SortField, SortDir } from "../types";

function extractYear(date: string): number {
    const parts = date.split("/");
    if (parts.length === 3) return Number(parts[2]);
    if (parts.length === 2) return Number(parts[1]);
    const n = Number(parts[0]);
    return isNaN(n) ? 0 : n;
}

export function filterAlbums(
    albums: Album[],
    search: string,
    formats: string[],
    years: string[],
): Album[] {
    const q = search.toLowerCase().trim();
    const yearSet = new Set(years.map(Number).filter((n) => !isNaN(n) && n > 0));
    const formatSet = new Set(formats);

    return albums.filter((a) => {
        if (q) {
            const haystack = `${a.name} ${a.band} ${a.genres.join(" ")}`.toLowerCase();
            if (!haystack.includes(q)) return false;
        }
        if (formatSet.size > 0) {
            const albumFormats = a.format.split("/").map((s) => s.trim()).filter(Boolean);
            if (!albumFormats.some((f) => formatSet.has(f))) return false;
        }
        if (yearSet.size > 0 && !yearSet.has(extractYear(a.date))) return false;
        return true;
    });
}

function parseDate(d: string): number {
    const parts = d.split("/");
    if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
    }
    if (parts.length === 2) {
        return new Date(`${parts[1]}-${parts[0]}-01`).getTime();
    }
    return new Date(d).getTime() || 0;
}

export function sortAlbums(
    albums: Album[],
    field: SortField,
    dir: SortDir,
): Album[] {
    const sorted = [...albums];
    sorted.sort((a, b) => {
        let cmp: number;
        if (field === "name") {
            cmp = a.name.localeCompare(b.name, "vi");
        } else {
            cmp = parseDate(a.date) - parseDate(b.date);
        }
        return dir === "asc" ? cmp : -cmp;
    });
    return sorted;
}

export function uniqueFormats(albums: Album[]): string[] {
    const counts = new Map<string, number>();
    for (const a of albums) {
        for (const f of a.format.split("/").map((s) => s.trim()).filter(Boolean)) {
            counts.set(f, (counts.get(f) ?? 0) + 1);
        }
    }
    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "vi"))
        .map(([format]) => format);
}

export function uniqueYears(albums: Album[]): string[] {
    const set = new Set<number>();
    for (const a of albums) {
        const y = extractYear(a.date);
        if (y >= 1900) set.add(y);
    }
    return Array.from(set).sort((a, b) => b - a).map(String);
}

export function toggleSelection(current: string[], value: string): string[] {
    return current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
}
