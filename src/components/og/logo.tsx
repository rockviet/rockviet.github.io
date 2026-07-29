import type { CSSProperties } from "react";

export interface LogoProps {
    brand: string;
    tagline?: string;
    monogram?: string;
    background: string;
    logo?: string;
}

export function Logo({
    brand,
    tagline,
    monogram,
    background,
    logo = "",
}: LogoProps) {
    const isColor = background.startsWith("#");

    const rootStyle: CSSProperties = {
        alignItems: "center",
        backgroundColor: isColor ? background : "#09090b",
        backgroundImage: isColor
            ? "radial-gradient(circle at 50% 40%, rgba(220,38,38,0.28), transparent 58%)"
            : background,
        color: "#fafafa",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Noto Sans",
        height: "100%",
        justifyContent: "center",
        width: "100%",
    };

    return (
        <div style={rootStyle}>
            {logo ? (
                <img
                    alt=""
                    height={160}
                    src={logo}
                    width={160}
                    style={{
                        borderRadius: "32px",
                        objectFit: "contain",
                    }}
                />
            ) : (
                <div
                    style={{
                        alignItems: "center",
                        backgroundColor: "#dc2626",
                        borderRadius: "32px",
                        boxShadow: "0 24px 80px rgba(220,38,38,0.35)",
                        color: "#ffffff",
                        display: "flex",
                        fontSize: "72px",
                        fontWeight: 800,
                        height: "160px",
                        justifyContent: "center",
                        width: "160px",
                    }}
                >
                    {monogram}
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    fontSize: "88px",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    marginTop: "40px",
                }}
            >
                {brand}
            </div>

            {tagline ? (
                <div
                    style={{
                        color: "#a1a1aa",
                        display: "flex",
                        fontSize: "30px",
                        marginTop: "16px",
                        textAlign: "center",
                        maxWidth: "900px",
                    }}
                >
                    {tagline}
                </div>
            ) : null}
        </div>
    );
}
