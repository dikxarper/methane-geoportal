import { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { getPlumeGroupPage } from "../../api/plumeGroupPages";
import type { PlumeGroup } from "../../api/plumePoints";
import { ui } from "../../theme/tokens";
import { usePointSources } from "./usePointSources";

const FIRST_PAGE = 15;
const NEXT_PAGE = 5;
const MIN_LOADER_TIME_MS = 850;

interface PageStatus {
    key: string;
    error: boolean;
}

export function PlumeGroupList() {
    const { t } = useTranslation();
    const { selectedGroup, selectGroup } = usePointSources();

    const [groups, setGroups] = useState<PlumeGroup[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [retry, setRetry] = useState(0);
    const [status, setStatus] = useState<PageStatus | null>(null);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const requestKey = `${offset}:${retry}`;
    const loading = status?.key !== requestKey;
    const error = status?.key === requestKey && status.error;

    useEffect(() => {
        const controller = new AbortController();
        const key = `${offset}:${retry}`;
        const limit = offset === 0 ? FIRST_PAGE : NEXT_PAGE;

        const minLoaderTime = new Promise<void>((resolve) => {
            window.setTimeout(resolve, offset === 0 ? 0 : MIN_LOADER_TIME_MS);
        });

        void Promise.all([getPlumeGroupPage(limit, offset, controller.signal), minLoaderTime])
            .then(([page]) => {
                if (controller.signal.aborted) return;

                setGroups((previous) => {
                    const byId = new Map(previous.map((group) => [group.id, group]));

                    for (const group of page.items) {
                        byId.set(group.id, group);
                    }

                    return [...byId.values()];
                });

                setHasMore(page.hasMore);
                setStatus({ key, error: false });
            })
            .catch((reason: unknown) => {
                if (controller.signal.aborted) return;

                console.error("[PlumeGroupList] Load failed:", reason);

                setStatus({ key, error: true });
            });

        return () => controller.abort();
    }, [offset, retry]);

    useEffect(() => {
        const target = sentinelRef.current;

        if (!target || loading || error || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) return;

                // Сразу запрашиваем следующую страницу.
                // loading становится true, loader появляется.
                observer.disconnect();

                setOffset((current) => current + (current === 0 ? FIRST_PAGE : NEXT_PAGE));
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.1,
            },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [loading, error, hasMore, offset]);

    return (
        <Flex direction="column" gap="6px">
            {groups.map((group) => {
                const selected = selectedGroup?.id === group.id;

                return (
                    <Button
                        key={group.id}
                        type="button"
                        variant="plain"
                        width="100%"
                        height="auto"
                        minHeight="46px"
                        px="9px"
                        py="8px"
                        textAlign="left"
                        justifyContent="space-between"
                        bg={selected ? ui.colors.panelDark : ui.colors.panel}
                        color={ui.colors.text}
                        border="1px solid"
                        borderColor={selected ? ui.colors.borderActive : ui.colors.borderLight}
                        borderRadius={ui.radius.md}
                        _hover={{ bg: ui.colors.buttonHover }}
                        onClick={() => selectGroup(group)}
                    >
                        <Box minWidth="0">
                            <Text fontSize="11px" fontWeight="600">
                                {t("pointSources.group")} #{group.id}
                            </Text>

                            {group.lastObservedAt && (
                                <Text mt="3px" fontSize="10px" color={ui.colors.textMuted}>
                                    {group.lastObservedAt.slice(0, 10)}
                                </Text>
                            )}
                        </Box>

                        <Text
                            flexShrink={0}
                            fontSize="10px"
                            fontWeight="500"
                            color={ui.colors.textMuted}
                        >
                            {t("pointSources.details.observations", {
                                count: group.observations ?? 0,
                            })}
                        </Text>
                    </Button>
                );
            })}

            {loading && (
                <Flex py="12px" align="center" justify="center" gap="7px" aria-live="polite">
                    <Spinner size="xs" />

                    <Text fontSize="11px" color={ui.colors.textMuted}>
                        {t("common.loading")}
                    </Text>
                </Flex>
            )}

            {error && (
                <Flex direction="column" align="center" gap="7px" py="10px">
                    <Text fontSize="11px" color={ui.colors.textMuted}>
                        {t("pointSources.details.loadError")}
                    </Text>

                    <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setRetry((value) => value + 1)}
                    >
                        {t("pointSources.retry")}
                    </Button>
                </Flex>
            )}

            {!loading && !error && groups.length === 0 && (
                <Text fontSize="11px" color={ui.colors.textMuted} py="10px">
                    {t("common.noData")}
                </Text>
            )}

            {!loading && !error && hasMore && (
                <Box ref={sentinelRef} height="2px" aria-hidden="true" />
            )}
        </Flex>
    );
}
