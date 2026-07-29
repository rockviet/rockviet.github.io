export interface Album {
    id: string;
    name: string;
    band: string;
    albType: string;
    genres: string[];
    format: string;
    date: string;
    year: number;
}

export type SortField = "name" | "date";
export type SortDir = "asc" | "desc";
