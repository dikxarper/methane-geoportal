import { Image } from "@chakra-ui/react";

import { useAppTheme } from "../../hooks/useAppTheme";

interface BrandLogoProps {
    variant?: "full" | "mark";
    height?: string;
}

export function BrandLogo({ variant = "full", height = "26px" }: BrandLogoProps) {
    const { theme } = useAppTheme();

    const src =
        variant === "mark"
            ? theme === "dark"
                ? "/brand/logo-mark_dark.svg"
                : "/brand/logo-mark.svg"
            : theme === "dark"
              ? "/brand/logo_dark.svg"
              : "/brand/logo.svg";

    return (
        <Image
            src={src}
            alt="Methane"
            height={height}
            width="auto"
            display="block"
            userSelect="none"
            draggable={false}
        />
    );
}
