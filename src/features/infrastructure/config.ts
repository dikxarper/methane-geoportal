import { Factory, Flame, Fuel, Landmark, Network, Ship, Trash2, Waves } from "lucide-react";

export const infrastructureLayers = [
    {
        id: "oil-gas-pipelines",
        label: "Нефте- и газопроводы",
        icon: Network,
    },
    {
        id: "refineries",
        label: "Нефтеперерабатывающие заводы",
        icon: Factory,
    },
    {
        id: "processing-facilities",
        label: "Газоперерабатывающие объекты",
        icon: Landmark,
    },
    {
        id: "lng-facilities",
        label: "СПГ-объекты",
        icon: Fuel,
    },
    {
        id: "gas-flaring",
        label: "Факельное сжигание газа",
        icon: Flame,
    },
    {
        id: "offshore-platforms",
        label: "Морские нефтегазовые платформы",
        icon: Waves,
    },
    {
        id: "oil-terminals",
        label: "Нефтяные терминалы",
        icon: Ship,
    },
    {
        id: "landfills",
        label: "Полигоны ТБО",
        icon: Trash2,
    },
] as const;

export type InfrastructureLayerId = (typeof infrastructureLayers)[number]["id"];
