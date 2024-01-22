import { CellRenderer, Client, EventObject, GestureEvent, GraphPluginConstructor, InternalEvent } from "@maxgraph/core";
import { EDGESTYLE } from "@maxgraph/core/dist/util/Constants";
import { Graph, defaultPlugins } from "@maxgraph/core/dist/view/Graph";
import CellState from "@maxgraph/core/dist/view/cell/CellState";
import CustomPopupMenuHandler from "./CustomPopupMenuHandler";
import CustomConnectionHandler from "./CustomConnectionHandler";
import CustomCellRenderer from "./CustomCellRenderer";

const defaultPluginsMap: { [key: string]: GraphPluginConstructor } = {};
defaultPlugins.forEach(p => defaultPluginsMap[p.pluginId] = p);

export default class CustomGraph extends Graph {
    constructor(container) {
        defaultPluginsMap.PopupMenuHandler = CustomPopupMenuHandler;
        defaultPluginsMap.ConnectionHandler = CustomConnectionHandler;

        super(container, null, Object.values(defaultPluginsMap));

        this.getStylesheet().getDefaultEdgeStyle().edgeStyle = EDGESTYLE.ORTHOGONAL;

        this.setAllowLoops(false);
        this.setAllowNegativeCoordinates(true);
        this.setAllowDanglingEdges(false);
        this.setConnectable(true);
        this.setCellsEditable(true);
        this.setPanning(true);

        InternalEvent.addGestureListeners(container, null, () => {

        });

        InternalEvent.addMouseWheelListener((event: WheelEvent) => {
            if (!event.ctrlKey) return;
            this.zoom(event.deltaY / 1000);
        }, container);

        // delete selected vertex when delete or backspace is hit
        addEventListener('keydown', event => {
            if (event.key != "Delete" && event.key != "Backspace") return;

            const selected = this.getSelectionCells();

            this.removeCells(selected, true);
        });
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