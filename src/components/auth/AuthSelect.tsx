import { Box, Text } from "@chakra-ui/react";

import { ui } from "../../theme/tokens";

interface Option {
    value: string;
    label: string;
}

interface AuthSelectProps {
    label: string;

    value: string;

    options: Option[];

    onChange: (value: string) => void;
}

export function AuthSelect({ label, value, options, onChange }: AuthSelectProps) {
    return (
        <Box>
            <Text mb="6px" fontSize="13px" fontWeight="600" color={ui.colors.text}>
                {label}
            </Text>

            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                style={{
                    width: "100%",
                    height: "36px",

                    padding: "0 10px",

                    border: `1px solid ${ui.colors.borderLight}`,

                    borderRadius: "6px",

                    background: ui.colors.panel,

                    color: ui.colors.text,

                    outline: "none",
                }}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </Box>
    );
}
