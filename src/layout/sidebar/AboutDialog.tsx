import { Box, Button, Dialog, Flex, Grid, IconButton, Portal, Text } from "@chakra-ui/react";
import {
    Activity,
    ArrowUpRight,
    Building2,
    ChartNoAxesCombined,
    Database,
    Factory,
    Globe2,
    Layers3,
    MapPinned,
    Satellite,
    ScanSearch,
    X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";

const LAB_URL = "https://ionos.kz/ru/labs/laboratorija-kosmicheskogo-monitoringa-chs/";

const content = {
    ru: {
        about: "О нас",
        label: "КОСМИЧЕСКИЙ МОНИТОРИНГ",
        title: "Methane.kz",
        subtitle: "Платформа спутникового мониторинга метана",
        introduction:
            "Methane.kz — геоинформационная платформа для мониторинга атмосферного метана с использованием спутниковых данных. Она объединяет наблюдения разных спутниковых миссий, помогает изучать распределение метана, обнаруженные шлейфы и расположенные рядом объекты промышленной инфраструктуры.",

        featuresTitle: "Возможности платформы",
        features: [
            {
                title: "Мониторинг метана",
                description:
                    "Ежедневные и годовые данные Sentinel-5P для анализа атмосферного метана.",
            },
            {
                title: "Обнаружение шлейфов",
                description: "Наблюдения Sentinel-2, Landsat, Tanager и EMIT на одной карте.",
            },
            {
                title: "Анализ выбросов",
                description: "Характеристики шлейфов, оценки выбросов и динамика наблюдений.",
            },
            {
                title: "Промышленная инфраструктура",
                description: "Нефтегазовые объекты, трубопроводы и полигоны отходов.",
            },
            {
                title: "Интерактивная карта",
                description: "Управление слоями, легенды и значения растров в выбранной точке.",
            },
        ],

        sourcesTitle: "Источники спутниковых данных",
        sources: [
            {
                title: "Sentinel-5P / TROPOMI",
                description:
                    "Ежедневные и годовые данные для мониторинга метана на больших территориях.",
            },
            {
                title: "Sentinel-2 / Landsat 8–9",
                description:
                    "Спутниковые изображения для автоматизированного поиска метановых шлейфов.",
            },
            {
                title: "Tanager / Carbon Mapper",
                description: "Дополнительные наблюдения отдельных шлейфов и их характеристик.",
            },
            {
                title: "EMIT / NASA",
                description: "Спектральные наблюдения для обнаружения и анализа метановых шлейфов.",
            },
        ],

        developerTitle: "Разработчик",
        developerName: "Лаборатория космического мониторинга ЧС Института ионосферы",
        developerDescription:
            "Лаборатория разрабатывает и применяет технологии спутникового мониторинга, обработки данных дистанционного зондирования Земли и автоматизированного анализа природных и антропогенных процессов.",
        laboratoryLink: "Открыть страницу лаборатории",

        note: "Спутниковые наблюдения и оценки выбросов имеют ограничения и неопределённости. Обнаружение шлейфа не всегда позволяет однозначно установить источник выброса.",
        close: "Закрыть",
    },

    en: {
        about: "About",
        label: "SATELLITE MONITORING",
        title: "Methane.kz",
        subtitle: "Satellite methane monitoring platform",
        introduction:
            "Methane.kz is a geospatial platform for monitoring atmospheric methane using satellite data. It brings together observations from different satellite missions to help explore methane distribution, detected plumes, and nearby industrial infrastructure.",

        featuresTitle: "Platform capabilities",
        features: [
            {
                title: "Methane monitoring",
                description: "Daily and annual Sentinel-5P data for atmospheric methane analysis.",
            },
            {
                title: "Plume detection",
                description: "Sentinel-2, Landsat, Tanager, and EMIT observations on one map.",
            },
            {
                title: "Emission analysis",
                description: "Plume characteristics, emission estimates, and observation trends.",
            },
            {
                title: "Industrial infrastructure",
                description: "Oil and gas facilities, pipelines, and landfills.",
            },
            {
                title: "Interactive map",
                description: "Layer controls, legends, and raster values at selected locations.",
            },
        ],

        sourcesTitle: "Satellite data sources",
        sources: [
            {
                title: "Sentinel-5P / TROPOMI",
                description: "Daily and annual methane data for monitoring large areas.",
            },
            {
                title: "Sentinel-2 / Landsat 8–9",
                description: "Satellite imagery used for automated methane plume detection.",
            },
            {
                title: "Tanager / Carbon Mapper",
                description: "Additional observations of individual plumes and their properties.",
            },
            {
                title: "EMIT / NASA",
                description: "Spectral observations for detecting and analyzing methane plumes.",
            },
        ],

        developerTitle: "Developed by",
        developerName: "Space Monitoring of Emergencies Laboratory, Institute of Ionosphere",
        developerDescription:
            "The laboratory develops and applies satellite monitoring technologies, Earth observation data processing, and automated analysis of natural and human-related processes.",
        laboratoryLink: "Visit the laboratory website",

        note: "Satellite observations and emission estimates carry uncertainties and limitations. A detected plume does not always identify its source conclusively.",
        close: "Close",
    },
} as const;

const capabilityIcons = [Globe2, ScanSearch, ChartNoAxesCombined, Factory, MapPinned] as const;

const sourceIcons = [Activity, Layers3, Satellite, Database] as const;

export function AboutDialog() {
    const { i18n } = useTranslation();

    const copy = i18n.resolvedLanguage?.startsWith("en") ? content.en : content.ru;

    return (
        <Dialog.Root placement="center" size="lg">
            <Dialog.Trigger asChild>
                <Button
                    type="button"
                    variant="plain"
                    height="32px"
                    px="12px"
                    bg={ui.colors.panelDark}
                    color={ui.colors.text}
                    border="1px solid"
                    borderColor={ui.colors.borderLight}
                    borderRadius={ui.radius.md}
                    fontSize="12px"
                    fontWeight="600"
                    _hover={{
                        bg: ui.colors.buttonHover,
                    }}
                >
                    {copy.about}
                </Button>
            </Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop bg="rgba(0, 0, 0, 0.65)" />

                <Dialog.Positioner px="12px" py="20px">
                    <Dialog.Content
                        width="100%"
                        maxWidth="760px"
                        maxHeight="min(88vh, 850px)"
                        minHeight="0"
                        display="flex"
                        flexDirection="column"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={ui.colors.controlBorder}
                        borderRadius="12px"
                        bg={ui.colors.control}
                        color={ui.colors.controlText}
                        boxShadow="0 20px 60px rgba(0, 0, 0, 0.35)"
                    >
                        {/* Заголовок модалки */}
                        <Dialog.Header
                            py="16px"
                            px={{
                                base: "16px",
                                md: "24px",
                            }}
                            borderBottom="1px solid"
                            borderColor={ui.colors.border}
                            flexShrink={0}
                        >
                            <Flex align="center" justify="space-between" gap="12px" width="100%">
                                <Box minW="0">
                                    <Text
                                        fontSize="10px"
                                        fontWeight="700"
                                        letterSpacing="0.12em"
                                        color={ui.colors.accent}
                                    >
                                        {copy.label}
                                    </Text>

                                    <Dialog.Title fontSize="21px" fontWeight="700" mt="3px">
                                        {copy.title}
                                    </Dialog.Title>

                                    <Text fontSize="12px" color={ui.colors.textMuted} mt="2px">
                                        {copy.subtitle}
                                    </Text>
                                </Box>

                                <Dialog.CloseTrigger asChild>
                                    <IconButton
                                        aria-label={copy.close}
                                        variant="ghost"
                                        size="sm"
                                        color={ui.colors.textMuted}
                                        flexShrink={0}
                                        _hover={{
                                            bg: ui.colors.controlHover,
                                            color: ui.colors.text,
                                        }}
                                    >
                                        <X size={17} />
                                    </IconButton>
                                </Dialog.CloseTrigger>
                            </Flex>
                        </Dialog.Header>

                        {/* Прокручиваемое содержимое */}
                        <Dialog.Body
                            py="20px"
                            px={{
                                base: "16px",
                                md: "24px",
                            }}
                            minHeight="0"
                            overflowY="auto"
                            css={{
                                scrollbarGutter: "stable",
                            }}
                        >
                            {/* О платформе */}
                            <Text fontSize="13px" lineHeight="1.75" color={ui.colors.textMuted}>
                                {copy.introduction}
                            </Text>

                            {/* Возможности */}
                            <Box as="section" mt="24px">
                                <Flex align="center" gap="8px" mb="12px">
                                    <ScanSearch size={17} color={ui.colors.accent} />

                                    <Text fontSize="14px" fontWeight="700">
                                        {copy.featuresTitle}
                                    </Text>
                                </Flex>

                                <Grid
                                    templateColumns={{
                                        base: "1fr",
                                        md: "repeat(2, minmax(0, 1fr))",
                                    }}
                                    gap="8px"
                                >
                                    {copy.features.map((feature, index) => {
                                        const Icon = capabilityIcons[index];

                                        return (
                                            <Flex
                                                key={feature.title}
                                                gap="10px"
                                                align="flex-start"
                                                p="11px"
                                                bg={ui.colors.panel}
                                                border="1px solid"
                                                borderColor={ui.colors.border}
                                                borderRadius={ui.radius.lg}
                                            >
                                                <Flex
                                                    width="28px"
                                                    height="28px"
                                                    flexShrink={0}
                                                    align="center"
                                                    justify="center"
                                                    color={ui.colors.accent}
                                                    bg={ui.colors.panelDark}
                                                    borderRadius={ui.radius.md}
                                                >
                                                    <Icon size={15} />
                                                </Flex>

                                                <Box minW="0">
                                                    <Text
                                                        fontSize="12px"
                                                        fontWeight="600"
                                                        lineHeight="1.3"
                                                    >
                                                        {feature.title}
                                                    </Text>

                                                    <Text
                                                        mt="4px"
                                                        fontSize="11px"
                                                        lineHeight="1.5"
                                                        color={ui.colors.textMuted}
                                                    >
                                                        {feature.description}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        );
                                    })}
                                </Grid>
                            </Box>

                            {/* Источники данных */}
                            <Box as="section" mt="24px">
                                <Flex align="center" gap="8px" mb="12px">
                                    <Satellite size={17} color={ui.colors.accent} />

                                    <Text fontSize="14px" fontWeight="700">
                                        {copy.sourcesTitle}
                                    </Text>
                                </Flex>

                                <Grid
                                    templateColumns={{
                                        base: "1fr",
                                        md: "repeat(2, minmax(0, 1fr))",
                                    }}
                                    gap="8px"
                                >
                                    {copy.sources.map((source, index) => {
                                        const Icon = sourceIcons[index];

                                        return (
                                            <Box
                                                key={source.title}
                                                p="12px"
                                                border="1px solid"
                                                borderColor={ui.colors.border}
                                                borderRadius={ui.radius.lg}
                                            >
                                                <Flex align="center" gap="8px">
                                                    <Icon size={15} color={ui.colors.accent} />

                                                    <Text fontSize="12px" fontWeight="600">
                                                        {source.title}
                                                    </Text>
                                                </Flex>

                                                <Text
                                                    mt="6px"
                                                    fontSize="11px"
                                                    lineHeight="1.6"
                                                    color={ui.colors.textMuted}
                                                >
                                                    {source.description}
                                                </Text>
                                            </Box>
                                        );
                                    })}
                                </Grid>
                            </Box>

                            {/* Разработчик */}
                            <Box as="section" mt="24px">
                                <Flex align="center" gap="8px" mb="12px">
                                    <Building2 size={17} color={ui.colors.accent} />

                                    <Text fontSize="14px" fontWeight="700">
                                        {copy.developerTitle}
                                    </Text>
                                </Flex>

                                <Box
                                    p="15px"
                                    bg={ui.colors.panel}
                                    border="1px solid"
                                    borderColor={ui.colors.border}
                                    borderRadius={ui.radius.lg}
                                >
                                    <Text fontSize="12px" fontWeight="700">
                                        {copy.developerName}
                                    </Text>

                                    <Text
                                        mt="6px"
                                        fontSize="11px"
                                        lineHeight="1.65"
                                        color={ui.colors.textMuted}
                                    >
                                        {copy.developerDescription}
                                    </Text>

                                    <Button
                                        asChild
                                        variant="plain"
                                        display="inline-flex"
                                        alignItems="center"
                                        gap="6px"
                                        mt="12px"
                                        height="auto"
                                        minWidth="auto"
                                        padding="0"
                                        color={ui.colors.accent}
                                        fontSize="12px"
                                        fontWeight="600"
                                        _hover={{
                                            textDecoration: "underline",
                                        }}
                                    >
                                        <a
                                            href={LAB_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {copy.laboratoryLink}

                                            <ArrowUpRight size={14} />
                                        </a>
                                    </Button>
                                </Box>
                            </Box>

                            {/* Примечание */}
                            <Text
                                mt="18px"
                                pt="12px"
                                borderTop="1px solid"
                                borderColor={ui.colors.border}
                                fontSize="10px"
                                lineHeight="1.6"
                                color={ui.colors.textMuted}
                            >
                                {copy.note}
                            </Text>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
