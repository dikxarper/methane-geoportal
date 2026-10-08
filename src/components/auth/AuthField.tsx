import { Box, Input, Text } from "@chakra-ui/react";

import { ui } from "../../theme/tokens";

interface AuthFieldProps {
    label: string;

    type?: string;

    value: string;

    onChange: (value: string) => void;

    autoComplete?: string;

    required?: boolean;
}

export function AuthField({
    label,
    type = "text",
    value,
    onChange,
    autoComplete,
    required = false,
}: AuthFieldProps) {
    return (
        <Box>
            <Text mb="6px" fontSize="13px" fontWeight="600" color={ui.colors.text}>
                {label}
            </Text>

            <Input
                height="36px"
                type={type}
                value={value}
                required={required}
                autoComplete={autoComplete}
                bg={ui.colors.panel}
                color={ui.colors.text}
                borderColor={ui.colors.borderLight}
                onChange={(event) => onChange(event.target.value)}
            />
        </Box>
    );
}
