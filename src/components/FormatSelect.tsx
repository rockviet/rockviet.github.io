import { useState, useRef, useEffect } from "react";
import { FormatIcon } from "./FormatIcon";
import { toggleSelection } from "../utils/filters";

interface Props {
    value: string[];
    onChange: (v: string[]) => void;
    formats: string[];
}

export function FormatSelect({ value, onChange, formats }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function toggle(v: string) {
        onChange(toggleSelection(value, v));
    }

    const label = value.length === 0
        ? "Format"
        : value.length === 1
            ? value[0]
            : `${value.length} formats`;

    return (
        <div ref={ref} className="relative min-w-[140px] sm:min-w-[150px]">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
                {value.length === 1 ? (
                    <FormatIcon format={value[0]} className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : null}
                <span className={value.length ? "text-foreground truncate" : "text-muted-foreground"}>
                    {label}
                </span>
                {value.length > 0 && (
                    <span className="ml-auto mr-1 rounded-full bg-accent/20 text-accent text-[10px] font-semibold px-1.5 py-0.5 tabular-nums">
                        {value.length}
                    </span>
                )}
                <svg className={`${value.length ? "" : "ml-auto"} w-4 h-4 text-muted-foreground shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="absolute z-50 mt-1 w-full min-w-[180px] max-h-60 overflow-auto bg-card border border-border rounded-lg shadow-xl">
                    <button
                        type="button"
                        onClick={() => onChange([])}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-card-hover text-muted-foreground border-b border-border"
                    >
                        Clear formats
                    </button>
                    {formats.map((f) => {
                        const checked = value.includes(f);
                        return (
                            <button
                                key={f}
                                type="button"
                                onClick={() => toggle(f)}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-card-hover flex items-center gap-2 ${checked ? "text-accent" : "text-foreground"}`}
                            >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? "bg-accent border-accent text-white" : "border-border"}`}>
                                    {checked ? (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : null}
                                </span>
                                <FormatIcon format={f} className="w-4 h-4 text-muted-foreground" />
                                {f}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
