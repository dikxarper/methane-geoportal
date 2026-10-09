export type BaseMapId = "custom" | "streets" | "satellite";

export const mapConfig = {
    home: {
        extent: [45.317401, 39.7622319, 88.5280244, 55.9115278] as [number, number, number, number],
    },

    minZoom: 3,
    maxZoom: 17,
} as const;

export const baseMaps: Array<{
    id: BaseMapId;
    label: string;
}> = [
    {
        id: "custom",
        label: "Кастомная",
    },
    {
        id: "streets",
        label: "Улицы",
    },
    {
        id: "satellite",
        label: "Спутник",
    },
];
