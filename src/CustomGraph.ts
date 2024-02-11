import { CellRenderer, GraphPluginConstructor, CellState, Graph, Cell } from "@maxgraph/core";
import CustomPopupMenuHandler from "./plugins/CustomPopupMenuHandler";
import CustomConnectionHandler from "./plugins/CustomConnectionHandler";
import CustomCellRenderer from "./plugins/CustomCellRenderer";
import Customizer from "./plugins/Customizer";
import ZoomHandler from "./plugins/ZoomHandler";
import EditorHandler from "./plugins/EditorHandler";
import DragAndDropHandler from "./plugins/DragAndDropHandler";
import PropertiesHandler from "./plugins/PropertiesHandler";
import { defaultPlugins } from "@maxgraph/core/dist/view/Graph";
import { getCellValue } from "./util/CellUtil";

const defaultPluginsMap: { [key: string]: GraphPluginConstructor } = {};
defaultPlugins.forEach(p => defaultPluginsMap[p.pluginId] = p);

export default class CustomGraph extends Graph {
    constructor(container) {
        defaultPluginsMap.PopupMenuHandler = CustomPopupMenuHandler;
        defaultPluginsMap.ConnectionHandler = CustomConnectionHandler;
        defaultPluginsMap[Customizer.pluginId] = Customizer;
        defaultPluginsMap[ZoomHandler.pluginId] = ZoomHandler;
        defaultPluginsMap[EditorHandler.pluginId] = EditorHandler;
        defaultPluginsMap[DragAndDropHandler.pluginId] = DragAndDropHandler;
        defaultPluginsMap[PropertiesHandler.pluginId] = PropertiesHandler;

        super(container, null, Object.values(defaultPluginsMap));

        // This is super hacky
        // An edge must first be inserted to the graph before
        // Serialized edges can be inserted
        // I don't know why this is the case
        // Probably a bug in maxgraph, one of many
        this.batchUpdate(() => {
            const a = this.insertVertex({
                parent: this.getDefaultParent(),
                x:0,
                y:0,
                width:0,
                height:0,
            });
            const b = this.insertVertex({
                parent: this.getDefaultParent(),
                x:1,
                y:1,
                width:0,
                height:0,
            });
            const c = this.insertEdge({
                source: a,
                target: b,
            });
        });

        this.removeCells(this.getChildCells(this.getDefaultParent(), true, true));
    }

    createCellRenderer(): CellRenderer {
        return new CustomCellRenderer();
    }

    getLabel: (cell: Cell) => string = (cell: Cell) =>{
        if (getCellValue(cell, "underlined")) {
            return `<u>${getCellValue(cell, "label")}</u>`;
        }
        return getCellValue(cell, "label");
    }

    // TODO: Remove Editing

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