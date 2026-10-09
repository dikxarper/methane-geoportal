import type { TrendMode, TrendPoint } from "./plumeTrendData";

export type TrendScaleMode = "linear" | "log";

export interface AxisTick {
    key: string;
    x: number;
    label: string;
    anchor: "start" | "middle" | "end";
}

export interface YAxisTick {
    value: number;
    label: string;
    y: number;
}

export interface PlotLayout {
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    x: (point: TrendPoint, index: number) => number;
    y: (value: number) => number;
    xTicks: AxisTick[];
    yTicks: YAxisTick[];
}

const WIDTH = 380;
const HEIGHT = 165;
const LEFT = 47;
const RIGHT = 12;
const TOP = 10;
const BOTTOM = 29;

export function formatTrendValue(value: number, locale: string): string {
    const format = (v: number) =>
        new Intl.NumberFormat(locale, {
            maximumFractionDigits: 1,
        }).format(v);

    if (Math.abs(value) >= 1_000_000) {
        return `${format(value / 1_000_000)}M`;
    }

    if (Math.abs(value) >= 1_000) {
        return `${format(value / 1_000)}K`;
    }

    return format(value);
}

function niceStep(value: number): number {
    if (value <= 0) return 1;

    const order = 10 ** Math.floor(Math.log10(value));
    const fraction = value / order;

    const multiple = [1, 2, 2.5, 5, 10].find((n) => n >= fraction) ?? 10;

    return multiple * order;
}

function createYScale(maximum: number, mode: TrendScaleMode) {
    if (mode === "linear") {
        const step = niceStep(maximum / 3);
        const topValue = step * 3;

        return {
            transform: (value: number) => value / topValue,
            ticks: [0, step, step * 2, topValue],
        };
    }

    // log1p позволяет корректно показывать нулевые значения.
    const exponent = Math.max(1, Math.ceil(Math.log10(1 + maximum)));

    const topValue = 10 ** exponent - 1;

    const transform = (value: number) =>
        Math.log10(1 + Math.max(0, value)) / Math.log10(1 + topValue);

    const powers = Array.from({ length: exponent }, (_, i) => 10 ** (i + 1) - 1);

    const ticks = [
        0,
        ...powers.filter(
            (_, i) =>
                i === powers.length - 1 || i % Math.max(1, Math.ceil(powers.length / 3)) === 0,
        ),
    ];

    return { transform, ticks };
}

export function createTrendLayout(
    points: readonly TrendPoint[],
    mode: TrendMode,
    scaleMode: TrendScaleMode,
    locale: string,
): PlotLayout | null {
    if (points.length === 0) return null;

    const plotWidth = WIDTH - LEFT - RIGHT;
    const plotHeight = HEIGHT - TOP - BOTTOM;

    const times = points.map((p) => p.timestamp);
    const first = times[0];
    const last = times[times.length - 1];

    const maxY = Math.max(0, ...points.map((p) => p.value));
    const yScale = createYScale(maxY, scaleMode);

    const x = (point: TrendPoint, index: number): number => {
        if (points.length === 1) {
            return LEFT + plotWidth / 2;
        }

        if (mode === "days") {
            return LEFT + (index / (points.length - 1)) * plotWidth;
        }

        return first === last
            ? LEFT + plotWidth / 2
            : LEFT + ((point.timestamp - first) / (last - first)) * plotWidth;
    };

    const y = (value: number): number => TOP + plotHeight * (1 - yScale.transform(value));

    let xTicks: AxisTick[];

    if (points.length === 1) {
        xTicks = [
            {
                key: "only",
                x: x(points[0], 0),
                label: points[0].label,
                anchor: "middle",
            },
        ];
    } else if (mode === "days") {
        const indices = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])];

        const compactDate = (date: string) => {
            const [year, month, day] = date.split("-");
            return `${day}.${month}.${year.slice(-2)}`;
        };

        xTicks = indices.map((index, i) => ({
            key: String(index),
            x: x(points[index], index),
            label: compactDate(points[index].from),
            anchor: i === 0 ? "start" : i === indices.length - 1 ? "end" : "middle",
        }));
    } else {
        const fractions = [0, 0.5, 1];
        const spanDays = (last - first) / 86_400_000;

        const label = (time: number): string => {
            const date = new Date(time);

            if (spanDays >= 365) {
                return String(date.getUTCFullYear());
            }

            return new Intl.DateTimeFormat(locale, {
                month: "short",
                year: "2-digit",
                timeZone: "UTC",
            }).format(date);
        };

        const used = new Set<string>();

        xTicks = fractions.flatMap((fraction, index) => {
            const text = label(first + (last - first) * fraction);

            if (used.has(text)) return [];

            used.add(text);

            return [
                {
                    key: String(index),
                    x: LEFT + plotWidth * fraction,
                    label: text,
                    anchor: (index === 0
                        ? "start"
                        : index === 2
                          ? "end"
                          : "middle") as AxisTick["anchor"],
                },
            ];
        });
    }

    return {
        width: WIDTH,
        height: HEIGHT,
        left: LEFT,
        right: RIGHT,
        top: TOP,
        bottom: BOTTOM,
        x,
        y,
        xTicks,
        yTicks: yScale.ticks.map((value) => ({
            value,
            label: formatTrendValue(value, locale),
            y: y(value),
        })),
    };
}
