interface Props {
    format: string;
    className?: string;
}

function CdIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2a10 10 0 0 1 7.07 2.93" opacity="0.3" />
        </svg>
    );
}

function DigitalIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" />
        </svg>
    );
}

function CassetteIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <circle cx="8" cy="12" r="2" />
            <circle cx="16" cy="12" r="2" />
            <path d="M10 12h4" />
            <path d="M6 19l2-4h8l2 4" />
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

function DvdIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <path d="M2 12h7" />
            <path d="M15 12h7" />
        </svg>
    );
}

function UsbIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22V8" />
            <path d="M5 12V9a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
            <rect x="8" y="2" width="8" height="6" rx="1" />
            <circle cx="7" cy="15" r="2" />
            <circle cx="17" cy="15" r="2" />
            <path d="M12 18v4" />
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
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <rect x="5" y="9" width="14" height="6" rx="1" />
            <circle cx="8.5" cy="12" r="1.5" />
            <circle cx="15.5" cy="12" r="1.5" />
            <path d="M10 12h4" />
        </svg>
    );
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
    CD: CdIcon,
    Digital: DigitalIcon,
    Cassette: CassetteIcon,
    Vinyl: VinylIcon,
    DVD: DvdIcon,
    USB: UsbIcon,
    Book: BookIcon,
    "Mini CD": CdIcon,
    VCD: DvdIcon,
    Promotion: PromotionIcon,
    "Double CD": CdIcon,
    Cine: CineIcon,
    "Reel-To-Reel": CassetteIcon,
    VHS: VhsIcon,
    TV: TvIcon,
    Unknown: UnknownIcon,
};

export function FormatIcon({ format, className = "w-5 h-5" }: Props) {
    const primary = format.split("/")[0].trim();
    const Icon = ICON_MAP[primary] ?? UnknownIcon;
    return <Icon className={className} />;
}
