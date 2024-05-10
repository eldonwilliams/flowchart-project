import { CellRenderer, GraphPluginConstructor, CellState, Graph, Cell, InternalEvent, ConnectionHandler } from "@maxgraph/core";
import CustomPopupMenuHandler from "./plugins/CustomPopupMenuHandler";
import CustomConnectionHandler from "./plugins/CustomConnectionHandler";
import CustomCellRenderer from "./plugins/CustomCellRenderer";
import Customizer from "./plugins/Customizer";
import ZoomHandler from "./plugins/ZoomHandler";
import EditorHandler from "./plugins/EditorHandler";
import DragAndDropHandler from "./plugins/DragAndDropHandler";
import PropertiesHandler from "./plugins/PropertiesHandler";
import { defaultPlugins } from "@maxgraph/core/dist/view/Graph";
import { getCellValue, setCellValue } from "./util/CellUtil";
import StyledFeatures from "./plugins/StyledFeatures";

const defaultPluginsMap: { [key: string]: GraphPluginConstructor } = {};
defaultPlugins.forEach(p => defaultPluginsMap[p.pluginId] = p);

interface Log {
    time: number;
    object: string;
    value: string;
    newValue: any;
}

export default class CustomGraph extends Graph {
    public logs: Log[] = [];

    constructor(container) {
        defaultPluginsMap.PopupMenuHandler = CustomPopupMenuHandler;
        defaultPluginsMap.ConnectionHandler = CustomConnectionHandler;
        defaultPluginsMap[Customizer.pluginId] = Customizer;
        defaultPluginsMap[ZoomHandler.pluginId] = ZoomHandler;
        defaultPluginsMap[EditorHandler.pluginId] = EditorHandler;
        defaultPluginsMap[DragAndDropHandler.pluginId] = DragAndDropHandler;
        defaultPluginsMap[PropertiesHandler.pluginId] = PropertiesHandler;
        defaultPluginsMap[StyledFeatures.pluginId] = StyledFeatures;

        delete defaultPluginsMap[EditorHandler.pluginId];

        super(container, null, Object.values(defaultPluginsMap));

        let connectionHandler = (this.getPlugin(ConnectionHandler.pluginId) as ConnectionHandler);
        let oldConnect = connectionHandler.connect.bind(connectionHandler);
        let isValidConnection = this.isValidConnection.bind(this);
        connectionHandler.connect = function (source: Cell, target: Cell, ...a) {
            if (isValidConnection(source, target)) {
                oldConnect(source, target, ...a);
            }
        }

        this.getDataModel().createId = () => this.nextId + "-" + Math.random().toString().slice(2);

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

        let graph = this;
        this.addListener(InternalEvent.CELLS_ADDED, function (sender, evt) {
            evt.getProperty("cells").forEach(cell => {
                setCellValue(cell, "created", Date.now(), true);
                setCellValue(cell, "shape", cell.style.shape, true);
            });
        })
    }
    
    private lastId = 1;

    get nextId() {
        return this.lastId++;
    }

    private commutativeCheck(a, b, c, d) {
        return (a == c && b == d) || (a == d && b == c);
    }

    public isValidConnection: (source: Cell, target: Cell) => boolean = (source: Cell, target: Cell) => {
        let a = getCellValue(source, "shape");
        let b = getCellValue(target, "shape");
        console.log(a, b);
        if (a == undefined || b == undefined) return true; // default to true

        if (this.commutativeCheck(a, b, "Relation", "Entity")) return true;
        if (this.commutativeCheck(a, b, "Entity", "Attribute")) return true;
        if (this.commutativeCheck(a, b, "Relation", "Attribute")) return true;

        return false;
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