import { FormatSelect } from "./FormatSelect";
import { YearSelect } from "./YearSelect";

interface Props {
    search: string;
    onSearch: (v: string) => void;
    formatsSelected: string[];
    onFormats: (v: string[]) => void;
    yearsSelected: string[];
    onYears: (v: string[]) => void;
    formats: string[];
    years: string[];
    total: number;
    filtered: number;
}

export function FilterBar({
    search, onSearch,
    formatsSelected, onFormats,
    yearsSelected, onYears,
    formats, years,
    total, filtered,
}: Props) {
    return (
        <div className="relative rounded-xl border border-border/70 bg-card/55 backdrop-blur-xl shadow-lg shadow-black/25">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                <div
                    className="absolute inset-0 opacity-90"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 130% at 0% 50%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(ellipse 70% 130% at 100% 50%, rgba(220,38,38,0.26), transparent 55%), linear-gradient(90deg, rgba(56,189,248,0.08) 0%, transparent 40%, transparent 60%, rgba(220,38,38,0.1) 100%)",
                    }}
                />
            </div>
            <div className="relative p-3 sm:p-4 flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Search album, band, genre..."
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-input/80 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring"
                    />
                </div>
                <div className="flex gap-2.5 sm:gap-3">
                    <FormatSelect value={formatsSelected} onChange={onFormats} formats={formats} />
                    <YearSelect value={yearsSelected} onChange={onYears} years={years} />
                    <span className="text-xs text-muted-foreground whitespace-nowrap self-center tabular-nums px-1">
                        {filtered === total ? total : `${filtered}/${total}`}
                    </span>
                </div>
            </div>
        </div>
    );
}
