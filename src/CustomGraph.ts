import { CellRenderer, GraphPluginConstructor, InternalEvent } from "@maxgraph/core";
import { Graph, defaultPlugins } from "@maxgraph/core/dist/view/Graph";
import CellState from "@maxgraph/core/dist/view/cell/CellState";
import CustomPopupMenuHandler from "./plugins/CustomPopupMenuHandler";
import CustomConnectionHandler from "./plugins/CustomConnectionHandler";
import CustomCellRenderer from "./plugins/CustomCellRenderer";
import Customizer from "./plugins/Customizer";
import ZoomHandler from "./plugins/ZoomHandler";
import EditorHandler from "./plugins/EditorHandler";

const defaultPluginsMap: { [key: string]: GraphPluginConstructor } = {};
defaultPlugins.forEach(p => defaultPluginsMap[p.pluginId] = p);

export default class CustomGraph extends Graph {
    constructor(container) {
        defaultPluginsMap.PopupMenuHandler = CustomPopupMenuHandler;
        defaultPluginsMap.ConnectionHandler = CustomConnectionHandler;
        defaultPluginsMap[Customizer.pluginId] = Customizer;
        defaultPluginsMap[ZoomHandler.pluginId] = ZoomHandler;
        defaultPluginsMap[EditorHandler.pluginId] = EditorHandler;

        super(container, null, Object.values(defaultPluginsMap));
    }

    createCellRenderer(): CellRenderer {
        return new CustomCellRenderer();
    }

    // copied from a story book example, this allows constraints to work
    getAllConnectionConstraints = (terminal: CellState, source: boolean) => {
        if (terminal && terminal.cell) {
            const geom = terminal.cell.geometry as { [a: string]: any };
            const shape = terminal.shape as { [a: string]: any };
            if (shape.stencil) {
                if (shape.stencil.constraints) {
                    return shape.stencil.constraints;
                }
            } else if (geom.constraints) {
                return geom.constraints;
            }
        }

        return null;
    }
}