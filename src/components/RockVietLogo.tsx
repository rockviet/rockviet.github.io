interface Props {
    className?: string;
}

export function RockVietLogo({ className = "w-10 h-10" }: Props) {
    return (
        <img
            src={`${import.meta.env.BASE_URL}icons/logo.png`}
            alt="Rock Việt"
            className={className}
            width={40}
            height={40}
            decoding="async"
        />
    );
}
