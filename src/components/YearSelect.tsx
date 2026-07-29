import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { createPortal } from "react-dom";
import { toggleSelection } from "../utils/filters";

interface Props {
    value: string[];
    onChange: (v: string[]) => void;
    years: string[];
}

function useFixedMenuStyle(
    open: boolean,
    triggerRef: RefObject<HTMLElement | null>,
    options: { minWidth: number; align?: "left" | "right" },
) {
    const [style, setStyle] = useState<CSSProperties>({});

    useLayoutEffect(() => {
        if (!open) return;

        function update() {
            const el = triggerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const isMobile = window.matchMedia("(max-width: 767px)").matches;
            const width = Math.max(rect.width, options.minWidth);
            const next: CSSProperties = {
                position: "fixed",
                width,
                zIndex: 80,
            };

            if (options.align === "right") {
                next.left = Math.max(8, rect.right - width);
            } else {
                next.left = Math.min(rect.left, window.innerWidth - width - 8);
            }

            if (isMobile) {
                next.bottom = window.innerHeight - rect.top + 4;
                next.top = "auto";
                next.maxHeight = Math.min(240, rect.top - 12);
            } else {
                next.top = rect.bottom + 4;
                next.bottom = "auto";
                next.maxHeight = Math.min(240, window.innerHeight - rect.bottom - 12);
            }

            setStyle(next);
        }

        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [open, triggerRef, options.minWidth, options.align]);

    return style;
}

export function YearSelect({ value, onChange, years }: Props) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const style = useFixedMenuStyle(open, rootRef, { minWidth: 140, align: "right" });

    useEffect(() => {
        if (!open) return;

        function handleClick(e: MouseEvent) {
            const target = e.target as Node;
            if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
            setOpen(false);
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    function toggle(v: string) {
        onChange(toggleSelection(value, v));
    }

    const label = value.length === 0
        ? "Year"
        : value.length === 1
            ? value[0]
            : `${value.length} years`;

    return (
        <div ref={rootRef} className="relative min-w-[100px] sm:min-w-[110px]">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
                <svg
                    className="w-4 h-4 text-muted-foreground shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <path d="M3 9h18" />
                </svg>
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
            {open && createPortal(
                <div
                    ref={menuRef}
                    style={style}
                    className="overflow-auto bg-card border border-border rounded-lg shadow-xl"
                >
                    <button
                        type="button"
                        onClick={() => onChange([])}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-card-hover text-muted-foreground border-b border-border"
                    >
                        Clear years
                    </button>
                    {years.map((y) => {
                        const checked = value.includes(y);
                        return (
                            <button
                                key={y}
                                type="button"
                                onClick={() => toggle(y)}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-card-hover flex items-center gap-2 ${checked ? "text-accent" : "text-foreground"}`}
                            >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? "bg-accent border-accent text-white" : "border-border"}`}>
                                    {checked ? (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : null}
                                </span>
                                <span className="tabular-nums">{y}</span>
                            </button>
                        );
                    })}
                </div>,
                document.body,
            )}
        </div>
    );
}
