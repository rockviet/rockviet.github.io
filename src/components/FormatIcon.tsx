import { useId, type FC } from "react";
import { Popover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

interface Props {
    format: string;
    className?: string;
    showTooltip?: boolean;
}

interface DiscGradient {
    stops: Array<{ offset: string; color: string }>;
}

const DISC_GRADIENTS: Record<string, DiscGradient> = {
    CD: {
        stops: [
            { offset: "0%", color: "#09090b" },
            { offset: "18%", color: "#09090b" },
            { offset: "22%", color: "#e0f2fe" },
            { offset: "40%", color: "#38bdf8" },
            { offset: "58%", color: "#7dd3fc" },
            { offset: "76%", color: "#bae6fd" },
            { offset: "100%", color: "#0ea5e9" },
        ],
    },
    "Mini CD": {
        stops: [
            { offset: "0%", color: "#09090b" },
            { offset: "18%", color: "#09090b" },
            { offset: "22%", color: "#ecfdf5" },
            { offset: "40%", color: "#2dd4bf" },
            { offset: "58%", color: "#5eead4" },
            { offset: "76%", color: "#99f6e4" },
            { offset: "100%", color: "#14b8a6" },
        ],
    },
    DVD: {
        stops: [
            { offset: "0%", color: "#09090b" },
            { offset: "18%", color: "#09090b" },
            { offset: "22%", color: "#f5f3ff" },
            { offset: "40%", color: "#8b5cf6" },
            { offset: "58%", color: "#a78bfa" },
            { offset: "76%", color: "#c4b5fd" },
            { offset: "100%", color: "#7c3aed" },
        ],
    },
    VCD: {
        stops: [
            { offset: "0%", color: "#09090b" },
            { offset: "18%", color: "#09090b" },
            { offset: "22%", color: "#eff6ff" },
            { offset: "40%", color: "#2563eb" },
            { offset: "58%", color: "#3b82f6" },
            { offset: "76%", color: "#60a5fa" },
            { offset: "100%", color: "#1d4ed8" },
        ],
    },
};

function DiscFill({
    gradientId,
    stops,
}: {
    gradientId: string;
    stops: DiscGradient["stops"];
}) {
    return (
        <defs>
            <radialGradient
                id={gradientId}
                cx="12"
                cy="12"
                r="10"
                fx="12"
                fy="12"
                gradientUnits="userSpaceOnUse"
            >
                {stops.map((stop) => (
                    <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
                ))}
            </radialGradient>
        </defs>
    );
}

const CD_RAINBOW = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#a855f7",
] as const;

function cdRainbowSlice(startDeg: number, endDeg: number): string {
    const cx = 12;
    const cy = 12;
    const r = 10;
    const toXY = (deg: number) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
    };
    const [x1, y1] = toXY(startDeg);
    const [x2, y2] = toXY(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

function CdIcon({
    className,
    gradientId,
    stops,
    rainbow = false,
}: {
    className?: string;
    gradientId: string;
    stops: DiscGradient["stops"];
    rainbow?: boolean;
}) {
    const slice = 360 / CD_RAINBOW.length;

    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {rainbow ? (
                <g>
                    {CD_RAINBOW.map((color, i) => (
                        <path
                            key={color}
                            d={cdRainbowSlice(i * slice, (i + 1) * slice)}
                            fill={color}
                            stroke="none"
                        />
                    ))}
                    <circle cx="12" cy="12" r="10" fill="#ffffff" opacity="0.12" stroke="none" />
                </g>
            ) : (
                <>
                    <DiscFill gradientId={gradientId} stops={stops} />
                    <circle cx="12" cy="12" r="10" fill={`url(#${gradientId})`} />
                </>
            )}
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" fill="#09090b" />
            <path d="M12 2a10 10 0 0 1 7.07 2.93" opacity="0.35" />
        </svg>
    );
}

function DigitalIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="2" width="12" height="20" rx="2.5" />
            <path d="M10 9.5v5l4.5-2.5L10 9.5z" fill="currentColor" stroke="none" />
            <line x1="12" y1="18.5" x2="12" y2="18.5" strokeWidth="2" />
        </svg>
    );
}

function CassetteIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="18" height="12" rx="2.5" />
            <circle cx="8.5" cy="13" r="2.25" />
            <circle cx="15.5" cy="13" r="2.25" />
            <path d="M7 8.5h10" />
        </svg>
    );
}

function VinylIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="7" opacity="0.3" />
        </svg>
    );
}

function DvdIcon({
    className,
    gradientId,
    stops,
}: {
    className?: string;
    gradientId: string;
    stops: DiscGradient["stops"];
}) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <DiscFill gradientId={gradientId} stops={stops} />
            <circle cx="12" cy="12" r="10" fill={`url(#${gradientId})`} />
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" fill="#09090b" />
            <path d="M2 12h7" />
            <path d="M15 12h7" />
        </svg>
    );
}

function UsbIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Stick body */}
            <rect x="7" y="2" width="10" height="14" rx="1.5" />
            {/* Connector tip */}
            <rect x="9" y="16" width="6" height="5" rx="0.75" />
            {/* Metal contacts */}
            <path d="M10.5 18v1.5" />
            <path d="M13.5 18v1.5" />
        </svg>
    );
}

function BookIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />
        </svg>
    );
}

function PromotionIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}

function CineIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 8h20" />
            <path d="M2 16h20" />
            <path d="M6 4v4" />
            <path d="M10 4v4" />
            <path d="M14 4v4" />
            <path d="M18 4v4" />
            <path d="M6 16v4" />
            <path d="M10 16v4" />
            <path d="M14 16v4" />
            <path d="M18 16v4" />
        </svg>
    );
}

function TvIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
        </svg>
    );
}

function UnknownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
        </svg>
    );
}

function VhsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6.5" width="20" height="9" rx="1.5" />
            <path d="M4.5 15.5h15L18 19H6l-1.5-3.5z" />
            <circle cx="8" cy="11" r="1.5" />
            <circle cx="16" cy="11" r="1.5" />
        </svg>
    );
}

function ReelToReelIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="10" r="5" />
            <circle cx="7" cy="10" r="1.5" fill="currentColor" />
            <circle cx="17" cy="10" r="5" />
            <circle cx="17" cy="10" r="1.5" fill="currentColor" />
            <path d="M12 7.5v5" opacity="0.4" />
            <rect x="4" y="17" width="16" height="3.5" rx="1" />
            <path d="M7 15v2" />
            <path d="M17 15v2" />
        </svg>
    );
}

const COLOR_MAP: Record<string, string> = {
    CD: "text-zinc-300",
    Digital: "text-emerald-400",
    Cassette: "text-amber-400",
    Vinyl: "text-rose-400",
    DVD: "text-violet-400",
    USB: "text-lime-400",
    Book: "text-orange-400",
    "Mini CD": "text-zinc-300",
    VCD: "text-blue-500",
    Promotion: "text-yellow-400",
    Cine: "text-pink-400",
    "Reel-To-Reel": "text-teal-300",
    VHS: "text-fuchsia-400",
    TV: "text-violet-300",
    Unknown: "text-muted-foreground",
};

function FormatGlyph({
    format,
    className,
    gradientId,
}: {
    format: string;
    className?: string;
    gradientId: string;
}) {
    const disc = DISC_GRADIENTS[format];
    if ((format === "CD" || format === "Mini CD") && disc) {
        return (
            <CdIcon
                className={className}
                gradientId={gradientId}
                stops={disc.stops}
                rainbow
            />
        );
    }
    if ((format === "DVD" || format === "VCD") && disc) {
        return <DvdIcon className={className} gradientId={gradientId} stops={disc.stops} />;
    }

    const icons: Record<string, FC<{ className?: string }>> = {
        Digital: DigitalIcon,
        Cassette: CassetteIcon,
        Vinyl: VinylIcon,
        USB: UsbIcon,
        Book: BookIcon,
        Promotion: PromotionIcon,
        Cine: CineIcon,
        "Reel-To-Reel": ReelToReelIcon,
        VHS: VhsIcon,
        TV: TvIcon,
        Unknown: UnknownIcon,
    };
    const Icon = icons[format] ?? UnknownIcon;
    return <Icon className={className} />;
}

export function FormatIcon({ format, className = "w-5 h-5", showTooltip = true }: Props) {
    const gradientId = useId().replace(/:/g, "");
    const primary = format.split("/")[0].trim();
    const color = COLOR_MAP[primary] ?? COLOR_MAP.Unknown;
    const sizeClass = primary === "Mini CD" ? "scale-80 origin-center" : undefined;
    const icon = (
        <FormatGlyph
            format={primary}
            className={cn(className, color, sizeClass)}
            gradientId={`disc-${gradientId}`}
        />
    );

    if (!showTooltip) {
        return icon;
    }

    return (
        <Popover.Root>
            <Popover.Trigger
                openOnHover
                delay={0}
                closeDelay={0}
                className="inline-flex items-center justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                aria-label={primary}
            >
                {icon}
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner side="top" sideOffset={6} className="z-50">
                    <Popover.Popup className="rounded-md border border-border bg-zinc-950/95 px-2 py-1 text-xs font-medium text-foreground shadow-lg backdrop-blur-sm">
                        {primary}
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}
