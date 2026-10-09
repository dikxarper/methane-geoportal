import { useMemo, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";
import type { TrendMode, TrendPeriod, TrendPoint } from "./plumeTrendData";
import { createTrendLayout, type TrendScaleMode } from "./plumeTrendScale";

interface PlumeTrendPlotProps {
    points: TrendPoint[];
    mode: TrendMode;
    period: TrendPeriod;
    scale: TrendScaleMode;
    locale: string;
    onSelect: (point: TrendPoint) => void;
}

function bucketIndex(date: string): number {
    return Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7));
}

function gapBetween(left: TrendPoint, right: TrendPoint, period: TrendPeriod): boolean {
    if (period === "day") {
        return right.timestamp - left.timestamp > 45 * 86_400_000;
    }

    const delta = bucketIndex(right.from) - bucketIndex(left.from);

    return delta > (period === "quarter" ? 3 : 1);
}

export function PlumeTrendPlot({
    points,
    mode,
    period,
    scale,
    locale,
    onSelect,
}: PlumeTrendPlotProps) {
    const { t } = useTranslation();
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const layout = useMemo(
        () => createTrendLayout(points, mode, scale, locale),
        [points, mode, scale, locale],
    );

    const hoveredIndex = points.findIndex((point) => point.key === hoveredKey);

    const hovered = hoveredIndex >= 0 ? points[hoveredIndex] : null;

    const number = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
    });

    const unit = t("pointSources.units.kgPerHour");

    if (!layout) {
        return (
            <Text py="12px" fontSize="11px" color={ui.colors.textMuted}>
                {t("pointSources.chart.empty")}
            </Text>
        );
    }

    const hx = hovered ? layout.x(hovered, hoveredIndex) : 0;

    const hy = hovered ? layout.y(hovered.value) : 0;

    const tipX = hx < layout.width * 0.28 ? "0" : hx > layout.width * 0.73 ? "-100%" : "-50%";

    const tipY = hy < 70 ? "12px" : "calc(-100% - 12px)";

    return (
        <Box position="relative" width="100%" mt="7px">
            {hovered && (
                <Box
                    position="absolute"
                    zIndex={4}
                    left={`${(hx / layout.width) * 100}%`}
                    top={`${(hy / layout.height) * 100}%`}
                    transform={`translate(${tipX}, ${tipY})`}
                    minWidth="126px"
                    maxWidth="200px"
                    px="9px"
                    py="7px"
                    bg={ui.colors.panelDark}
                    color={ui.colors.text}
                    border="1px solid"
                    borderColor={ui.colors.borderLight}
                    borderRadius={ui.radius.md}
                    boxShadow="0 5px 16px rgba(0,0,0,.22)"
                    pointerEvents="none"
                >
                    <Text fontSize="10px" fontWeight="600">
                        {hovered.label}
                    </Text>

                    <Text fontSize="12px" fontWeight="700" mt="2px">
                        {number.format(hovered.value)} {unit}
                    </Text>

                    <Text fontSize="10px" color={ui.colors.textMuted} mt="2px">
                        {hovered.count === 1
                            ? t("pointSources.chart.singleObservation")
                            : t("pointSources.chart.monthAverageCount", {
                                  count: hovered.count,
                              })}
                    </Text>
                </Box>
            )}

            <svg
                width="100%"
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                role="img"
                aria-label={t("pointSources.chart.title")}
                style={{
                    display: "block",
                    overflow: "visible",
                    fontFamily: "inherit",
                }}
            >
                {/* Ось Y */}
                {layout.yTicks.map((tick) => (
                    <g key={tick.value}>
                        <line
                            x1={layout.left}
                            x2={layout.width - layout.right}
                            y1={tick.y}
                            y2={tick.y}
                            stroke={ui.colors.borderLight}
                            strokeWidth="1"
                        />

                        <text
                            x={layout.left - 7}
                            y={tick.y + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill={ui.colors.textMuted}
                        >
                            {tick.label}
                        </text>
                    </g>
                ))}

                {/* Линии между периодами */}
                {points.slice(1).map((point, offset) => {
                    const previous = points[offset];
                    const dashed = gapBetween(previous, point, period);

                    return (
                        <line
                            key={`${previous.key}/${point.key}`}
                            x1={layout.x(previous, offset)}
                            y1={layout.y(previous.value)}
                            x2={layout.x(point, offset + 1)}
                            y2={layout.y(point.value)}
                            stroke={ui.colors.accent}
                            strokeOpacity={dashed ? 0.48 : 1}
                            strokeDasharray={dashed ? "4 4" : undefined}
                            strokeWidth="1.9"
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* Интерактивные точки */}
                {points.map((point, index) => {
                    const x = layout.x(point, index);
                    const y = layout.y(point.value);

                    return (
                        <g
                            key={point.key}
                            role="button"
                            tabIndex={0}
                            aria-label={
                                `${point.label}: ` + `${number.format(point.value)} ${unit}`
                            }
                            onPointerEnter={() => setHoveredKey(point.key)}
                            onPointerLeave={() => setHoveredKey(null)}
                            onFocus={() => setHoveredKey(point.key)}
                            onBlur={() => setHoveredKey(null)}
                            onClick={() => onSelect(point)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    onSelect(point);
                                }
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            <circle cx={x} cy={y} r="8" fill="transparent" />

                            <circle
                                cx={x}
                                cy={y}
                                r={hoveredKey === point.key ? 4.5 : 3.2}
                                fill={ui.colors.accent}
                                stroke={ui.colors.panel}
                                strokeWidth="1.4"
                                pointerEvents="none"
                            />
                        </g>
                    );
                })}

                {/* Ось X */}
                {layout.xTicks.map((tick) => (
                    <text
                        key={tick.key}
                        x={tick.x}
                        y={layout.height - 4}
                        textAnchor={tick.anchor}
                        fontSize="100"
                        fill={ui.colors.textMuted}
                    >
                        {tick.label}
                    </text>
                ))}
            </svg>
        </Box>
    );
}
