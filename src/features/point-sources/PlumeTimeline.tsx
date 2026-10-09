import { useEffect, useRef, useState, type RefObject } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";
import type { PlumeObservation } from "./types";
import { PlumeTimelineItem } from "./PlumeTimelineItem";

interface PlumeTimelineProps {
    items: PlumeObservation[];
    selectedKey: string | null;
    onSelect: (observation: PlumeObservation) => void;
    scrollRootRef: RefObject<HTMLDivElement | null>;
}

const PAGE_SIZE = 10;
const LOAD_DELAY_MS = 950;

export function PlumeTimeline({ items, selectedKey, onSelect, scrollRootRef }: PlumeTimelineProps) {
    const { t } = useTranslation();

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [loadingMore, setLoadingMore] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const root = scrollRootRef.current;
        const sentinel = sentinelRef.current;

        if (!root || !sentinel || visibleCount >= items.length) {
            return;
        }

        let timer: number | null = null;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries[0]?.isIntersecting ?? false;

                if (!visible) {
                    if (timer !== null) {
                        window.clearTimeout(timer);
                        timer = null;
                        setLoadingMore(false);
                    }

                    return;
                }

                if (timer !== null) return;

                setLoadingMore(true);

                timer = window.setTimeout(() => {
                    timer = null;
                    observer.disconnect();

                    setVisibleCount((count) => Math.min(count + PAGE_SIZE, items.length));

                    setLoadingMore(false);
                }, LOAD_DELAY_MS);
            },
            {
                root,
                rootMargin: "0px 0px 8px 0px",
                threshold: 0,
            },
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();

            if (timer !== null) {
                window.clearTimeout(timer);
            }
        };
    }, [items.length, visibleCount, scrollRootRef]);

    return (
        <Flex direction="column" gap="6px" pb="10px">
            {items.slice(0, visibleCount).map((observation) => (
                <PlumeTimelineItem
                    key={observation.key}
                    observation={observation}
                    selected={selectedKey === observation.key}
                    onClick={() => onSelect(observation)}
                />
            ))}

            {visibleCount < items.length && (
                <Box ref={sentinelRef} minHeight="26px" aria-live="polite">
                    {loadingMore && (
                        <Flex align="center" justify="center" gap="7px" py="8px">
                            <Spinner size="xs" />

                            <Text fontSize="10px" color={ui.colors.textMuted}>
                                {t("common.loading")}
                            </Text>
                        </Flex>
                    )}
                </Box>
            )}
        </Flex>
    );
}
