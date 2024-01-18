import { Cell, ConnectionHandler, GraphPluginConstructor, InternalMouseEvent } from "@maxgraph/core";
import { EDGESTYLE } from "@maxgraph/core/dist/util/Constants";
import { Graph, defaultPlugins } from "@maxgraph/core/dist/view/Graph";
import CellState from "@maxgraph/core/dist/view/cell/CellState";
import CustomPopupMenuHandler from "./CustomPopupMenuHandler";
import CustomConnectionHandler from "./CustomConnectionHandler";
import CustomCellRenderer from "./CustomCellRenderer";

const defaultPluginsMap: {[key: string]: GraphPluginConstructor} = {};
defaultPlugins.forEach(p => defaultPluginsMap[p.pluginId] = p);

export default class CustomGraph extends Graph {
    constructor(container) {
        defaultPluginsMap.PopupMenuHandler = CustomPopupMenuHandler;
        defaultPluginsMap.ConnectionHandler = CustomConnectionHandler;

        super(container, null, Object.values(defaultPluginsMap));

        this.getStylesheet().getDefaultEdgeStyle().edgeStyle = EDGESTYLE.ORTHOGONAL;
    }

    createCellRenderer(): CellRenderer {
        return new CustomCellRenderer();
    }

    // copied from a story book example, this allows constraints to work
    getAllConnectionConstraints = (terminal: CellState, source: boolean) => {
        if (terminal && terminal.cell) {
            const geom = terminal.cell.geometry as {[a: string]: any};
            const shape = terminal.shape as {[a: string]: any};
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