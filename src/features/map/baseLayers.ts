import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";

const CARTO_API_KEY = import.meta.env.VITE_CARTO_BASEMAP_KEY?.trim();

const CARTO_ATTRIBUTION =
    '© <a href="https://www.openstreetmap.org/copyright" ' +
    'target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, ' +
    '© <a href="https://carto.com/attribution/" ' +
    'target="_blank" rel="noopener noreferrer">CARTO</a>';

function createCartoSource(style: "light_all" | "dark_all") {
    if (!CARTO_API_KEY) {
        throw new Error("Missing VITE_CARTO_BASEMAP_KEY. Configure the CARTO API key.");
    }

    return new XYZ({
        url:
            `https://basemaps.cartocdn.com/rastertiles/${style}/` +
            `{z}/{x}/{y}.png?key=${encodeURIComponent(CARTO_API_KEY)}`,
        attributions: CARTO_ATTRIBUTION,
        crossOrigin: "anonymous",
        maxZoom: 20,
    });
}

export function createBaseLayers() {
    const customLight = new TileLayer({
        visible: false,

        source: createCartoSource("light_all"),

        properties: {
            baseMapId: "custom",
            baseMapTheme: "light",
        },
    });

    const customDark = new TileLayer({
        visible: false,

        source: createCartoSource("dark_all"),

        properties: {
            baseMapId: "custom",
            baseMapTheme: "dark",
        },
    });

    const streets = new TileLayer({
        visible: false,

        source: new OSM(),

        properties: {
            baseMapId: "streets",
        },
    });

    const satellite = new TileLayer({
        visible: false,

        source: new XYZ({
            url:
                "https://server.arcgisonline.com/ArcGIS/rest/services/" +
                "World_Imagery/MapServer/tile/{z}/{y}/{x}",

            attributions: "Tiles © Esri",
            crossOrigin: "anonymous",
        }),

        properties: {
            baseMapId: "satellite",
        },
    });

    return [customLight, customDark, streets, satellite];
}
