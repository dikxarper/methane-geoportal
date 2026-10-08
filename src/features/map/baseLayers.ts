import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import StadiaMaps from "ol/source/StadiaMaps";
import XYZ from "ol/source/XYZ";

export function createBaseLayers() {
    const customLight = new TileLayer({
        visible: false,

        source: new StadiaMaps({
            layer: "alidade_smooth",
            retina: true,
        }),

        properties: {
            baseMapId: "custom",
            baseMapTheme: "light",
        },
    });

    const customDark = new TileLayer({
        visible: false,

        source: new StadiaMaps({
            layer: "alidade_smooth_dark",
            retina: true,
        }),

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
