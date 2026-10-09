import type { ReactNode } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ui } from "../../theme/tokens";

interface PaginatedListProps<T> {
    items: T[];
    page: number;
    hasNext: boolean;
    loading: boolean;
    error?: string | null;
    emptyText: string;
    onPageChange: (page: number) => void;
    onRetry?: () => void;
    getKey: (item: T) => string;
    renderItem: (item: T) => ReactNode;
}

export function PaginatedList<T>({
    items,
    page,
    hasNext,
    loading,
    error,
    emptyText,
    onPageChange,
    onRetry,
    getKey,
    renderItem,
}: PaginatedListProps<T>) {
    const { t } = useTranslation();

    return (
        <Box>
            {loading ? (
                <Text fontSize="11px" color={ui.colors.textMuted} py="12px">
                    {t("common.loading")}
                </Text>
            ) : error ? (
                <Box py="10px">
                    <Text fontSize="11px" color="red.400">
                        {error}
                    </Text>
                    {onRetry && (
                        <Button size="xs" variant="outline" mt="8px" onClick={onRetry}>
                            {t("pointSources.retry")}
                        </Button>
                    )}
                </Box>
            ) : items.length === 0 ? (
                <Text fontSize="11px" color={ui.colors.textMuted} py="12px">
                    {emptyText}
                </Text>
            ) : (
                <Flex direction="column" gap="6px">
                    {items.map((item) => (
                        <Box key={getKey(item)}>{renderItem(item)}</Box>
                    ))}
                </Flex>
            )}

            <Flex align="center" justify="space-between" mt="10px">
                <Button
                    aria-label={t("pointSources.previousPage")}
                    size="xs"
                    variant="ghost"
                    color={ui.colors.text}
                    disabled={loading || page === 0}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft size={15} />
                </Button>

                <Text fontSize="11px" color={ui.colors.textMuted}>
                    {t("pointSources.page")} {page + 1}
                </Text>

                <Button
                    aria-label={t("pointSources.nextPage")}
                    size="xs"
                    variant="ghost"
                    color={ui.colors.text}
                    disabled={loading || Boolean(error) || !hasNext}
                    onClick={() => onPageChange(page + 1)}
                >
                    <ChevronRight size={15} />
                </Button>
            </Flex>
        </Box>
    );
}
