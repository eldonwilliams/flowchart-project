import { Cell, ConnectionHandler, GraphPluginConstructor, InternalMouseEvent } from "@maxgraph/core";
import { EDGESTYLE } from "@maxgraph/core/dist/util/Constants";
import { Graph, defaultPlugins } from "@maxgraph/core/dist/view/Graph";
import CellState from "@maxgraph/core/dist/view/cell/CellState";
import CustomPopupMenuHandler from "./CustomPopupMenuHandler";

const defaultPluginsMap: {[key: string]: GraphPluginConstructor} = {};
defaultPlugins.forEach(p => defaultPluginsMap[p.pluginId] = p);

export default class CustomGraph extends Graph {
    constructor(container) {
        defaultPluginsMap.PopupMenuHandler = CustomPopupMenuHandler;

        super(container, null, Object.values(defaultPluginsMap));

        this.getStylesheet().getDefaultEdgeStyle().edgeStyle = EDGESTYLE.ORTHOGONAL;

        const connectionHandler = this.getPlugin("ConnectionHandler") as ConnectionHandler;
        connectionHandler.livePreview = true;

        connectionHandler.isConnectableCell = () => false;

        connectionHandler.createEdgeState = (me: InternalMouseEvent) => {
            var edge = connectionHandler.graph.createEdge(null, null, null, null, null, {
                edgeStyle: EDGESTYLE.ORTHOGONAL
            });

            return new CellState(connectionHandler.graph.view, edge, connectionHandler.graph.getCellStyle(edge))
        }
    }

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