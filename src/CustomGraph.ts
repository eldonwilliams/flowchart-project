import { CellRenderer, GraphPluginConstructor, InternalEvent } from "@maxgraph/core";
import { Graph, defaultPlugins } from "@maxgraph/core/dist/view/Graph";
import CellState from "@maxgraph/core/dist/view/cell/CellState";
import CustomPopupMenuHandler from "./plugins/CustomPopupMenuHandler";
import CustomConnectionHandler from "./plugins/CustomConnectionHandler";
import CustomCellRenderer from "./plugins/CustomCellRenderer";
import Customizer from "./plugins/Customizer";

const defaultPluginsMap: { [key: string]: GraphPluginConstructor } = {};
defaultPlugins.forEach(p => defaultPluginsMap[p.pluginId] = p);

export default class CustomGraph extends Graph {
    constructor(container) {
        defaultPluginsMap.PopupMenuHandler = CustomPopupMenuHandler;
        defaultPluginsMap.ConnectionHandler = CustomConnectionHandler;
        defaultPluginsMap.Customizer = Customizer;

        super(container, null, Object.values(defaultPluginsMap));

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