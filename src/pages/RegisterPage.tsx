import { Box, Button, Text } from "@chakra-ui/react";

import { useState, type FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/auth";

import { AuthField } from "../components/auth/AuthField";
import { AuthSelect } from "../components/auth/AuthSelect";
import { PasswordField } from "../components/auth/PasswordField";

import { ui } from "../theme/tokens";

const sourceOptions = [
    {
        value: "scientific_publication",
        label: "Научная публикация",
    },
    {
        value: "conference_seminar",
        label: "Конференция, семинар",
    },
    {
        value: "university",
        label: "Университет",
    },
    {
        value: "scientific_organization",
        label: "Научная организация",
    },
    {
        value: "colleagues",
        label: "Коллеги",
    },
    {
        value: "professional_community",
        label: "Профессиональное сообщество",
    },
    {
        value: "search_engine",
        label: "Поисковая система",
    },
    {
        value: "social_media",
        label: "Социальные сети",
    },
    {
        value: "other",
        label: "Другое",
    },
];

const purposeOptions = [
    {
        value: "scientific_research",
        label: "Научное исследование",
    },
    {
        value: "education",
        label: "Образование",
    },
    {
        value: "environmental_monitoring",
        label: "Экологический мониторинг",
    },
    {
        value: "industrial_analysis",
        label: "Промышленный анализ",
    },
    {
        value: "government_regulation",
        label: "Госуправление, регулирование",
    },
    {
        value: "media_public_communication",
        label: "Медиа, публичная коммуникация",
    },
    {
        value: "other",
        label: "Другое",
    },
];

export function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [organization, setOrganization] = useState("");

    const [source, setSource] = useState(sourceOptions[0].value);

    const [purpose, setPurpose] = useState(purposeOptions[0].value);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await register({
                name: name.trim(),
                email: email.trim(),

                password,

                password_confirmation: password,

                organization: organization.trim() || null,

                referral_source: source || null,

                usage_reason: purpose || null,
            });

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Не удалось создать аккаунт");
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
                Создать аккаунт
            </Text>

            <Text mt="3px" mb="18px" fontSize="12px" color={ui.colors.textMuted}>
                Запросите доступ к карте мониторинга метана.
            </Text>

            <Box display="flex" flexDirection="column" gap="15px">
                <AuthField
                    label="Имя"
                    value={name}
                    required
                    autoComplete="name"
                    onChange={setName}
                />

                <AuthField
                    label="Email"
                    type="email"
                    value={email}
                    required
                    autoComplete="email"
                    onChange={setEmail}
                />

                <PasswordField value={password} onChange={setPassword} />

                <AuthField label="Организация" value={organization} onChange={setOrganization} />

                <AuthSelect
                    label="Откуда вы узнали о сайте?"
                    value={source}
                    options={sourceOptions}
                    onChange={setSource}
                />

                <AuthSelect
                    label="С какой целью будете использовать сайт?"
                    value={purpose}
                    options={purposeOptions}
                    onChange={setPurpose}
                />

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
                    Создать аккаунт
                </Button>

                <Button
                    asChild
                    variant="outline"
                    color={ui.colors.text}
                    borderColor={ui.colors.borderLight}
                >
                    <Link to="/login">Вернуться ко входу</Link>
                </Button>
            </Box>
        </Box>
    );
}
