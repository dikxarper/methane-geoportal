import { Box, Button, Text } from "@chakra-ui/react";

import { useState } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";

import { AuthField } from "../components/auth/AuthField";
import { PasswordField } from "../components/auth/PasswordField";

import { useAuth } from "../auth/AuthContext";

import { ui } from "../theme/tokens";

export function LoginPage() {
    const navigate = useNavigate();

    const { login, isAuthenticated } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await login(email, password);

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Не удалось войти");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            as="form"
            onSubmit={handleSubmit}
            width="352px"
            maxWidth="100%"
            p="20px"
            bg={ui.colors.sidebar}
            color={ui.colors.text}
            border="1px solid"
            borderColor={ui.colors.border}
            borderRadius="8px"
            boxShadow="0 18px 42px rgba(0,0,0,0.12)"
        >
            <Text fontSize="16px" fontWeight="700">
                Вход
            </Text>

            <Text mt="3px" mb="18px" fontSize="12px" color={ui.colors.textMuted}>
                Войдите в аккаунт, чтобы получить доступ.
            </Text>

            <Box display="flex" flexDirection="column" gap="16px">
                <AuthField
                    label="Email"
                    type="email"
                    value={email}
                    required
                    autoComplete="email"
                    onChange={setEmail}
                />

                <PasswordField value={password} onChange={setPassword} />

                {error && (
                    <Text fontSize="12px" color="red.400">
                        {error}
                    </Text>
                )}

                <Button
                    type="submit"
                    height="36px"
                    bg="#18181B"
                    color="white"
                    loading={loading}
                    _hover={{
                        bg: "#27272A",
                    }}
                >
                    Войти
                </Button>

                <Button asChild variant="ghost" color={ui.colors.text}>
                    <Link to="/register">Создать аккаунт</Link>
                </Button>
            </Box>
        </Box>
    );
}
