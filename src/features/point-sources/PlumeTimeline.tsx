import { useEffect, useRef, useState, type RefObject } from "react";
import { Box, Flex } from "@chakra-ui/react";

import type { PlumeObservation } from "./types";
import { PlumeTimelineItem } from "./PlumeTimelineItem";

interface PlumeTimelineProps {
    items: PlumeObservation[];
    selectedKey: string | null;
    onSelect: (observation: PlumeObservation) => void;
    scrollRootRef: RefObject<HTMLDivElement | null>;
}

const PAGE_SIZE = 10;

export function PlumeTimeline({ items, selectedKey, onSelect, scrollRootRef }: PlumeTimelineProps) {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
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
                    }
                    return;
                }

                if (timer !== null) return;

                timer = window.setTimeout(() => {
                    timer = null;
                    observer.disconnect();

                    setVisibleCount((count) => Math.min(count + PAGE_SIZE, items.length));
                }, 450);
            },
            {
                root,
                rootMargin: "0px 0px 16px 0px",
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
        <Flex direction="column" gap="6px">
            {items.slice(0, visibleCount).map((observation) => (
                <PlumeTimelineItem
                    key={observation.key}
                    observation={observation}
                    selected={selectedKey === observation.key}
                    onClick={() => onSelect(observation)}
                />
            ))}

            {visibleCount < items.length && (
                <Box ref={sentinelRef} height="2px" aria-hidden="true" />
            )}
        </Flex>
    );
}
