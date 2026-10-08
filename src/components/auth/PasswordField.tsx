import { Box, IconButton, Input, Text } from "@chakra-ui/react";

import { Eye, EyeOff } from "lucide-react";

import { useState } from "react";

import { ui } from "../../theme/tokens";

interface PasswordFieldProps {
    value: string;

    onChange: (value: string) => void;
}

export function PasswordField({ value, onChange }: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <Box>
            <Text mb="6px" fontSize="13px" fontWeight="600" color={ui.colors.text}>
                Пароль
            </Text>

            <Box position="relative">
                <Input
                    height="36px"
                    pr="40px"
                    type={visible ? "text" : "password"}
                    value={value}
                    required
                    autoComplete="current-password"
                    bg={ui.colors.panel}
                    color={ui.colors.text}
                    borderColor={ui.colors.borderLight}
                    onChange={(event) => onChange(event.target.value)}
                />

                <IconButton
                    aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
                    variant="ghost"
                    position="absolute"
                    top="2px"
                    right="2px"
                    width="32px"
                    height="32px"
                    minWidth="32px"
                    color={ui.colors.text}
                    onClick={() => setVisible((current) => !current)}
                >
                    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                </IconButton>
            </Box>
        </Box>
    );
}
