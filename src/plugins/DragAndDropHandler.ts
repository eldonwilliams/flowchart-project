import { Cell, CellRenderer, Geometry, GraphPlugin, Shape, gestureUtils } from "@maxgraph/core";
import { Graph } from "@maxgraph/core/dist/view/Graph";
import { DropHandler } from "@maxgraph/core/dist/view/other/DragSource";
import { getDisplayName } from "../shapes/ShapeUtil";

const DEFAULT_HEIGHT_WIDTH = 25;

/**
 * DragAndDropHandler handles logic 
 */
export default class DragAndDropHandler implements GraphPlugin {
    static pluginId = "DragAndDropHandler";
    static TOOLBOX_ELEMENT: HTMLElement = document.querySelector("#toolbox");

    graph: Graph;

    constructor(graph: Graph) {
        this.graph = graph;
        this.addDragSource("Attribute");
        this.addDragSource("Relation");
        this.addDragSource("Entity");
    }

    private dropElementHandler(shape: typeof Shape, graph: Graph, evt: MouseEvent, target: Cell, x: number, y: number) {
        //@ts-ignore
        const shapeKey = shape.shapeKey;
        //@ts-ignore
        const defaultCellState = shape.defaultCellState;
        //@ts-ignore
        const geometryClass = shape.geometryClass ?? Geometry;
        //@ts-ignore
        const displayName = getDisplayName(shape);
        
        const cell = new Cell(
            displayName,
            new geometryClass(
                0,
                0,
                defaultCellState.width ?? DEFAULT_HEIGHT_WIDTH,
                defaultCellState.height ?? DEFAULT_HEIGHT_WIDTH
            ),
            { ...defaultCellState, shape: shapeKey, }
        );
        cell.vertex = true;
        const cells = graph.importCells([cell], x, y, target, evt);

        if (cells != null && cells.length > 0) {
            graph.scrollCellToVisible(cells[0]);
            graph.setSelectionCells(cells);
        }
    }

    /**
     * Makes a preview instance of a shape given a shapeKey.
     * Defaults a global.
     * @param shapeKey 
     */
    private makePreviewInstanceOfShape(shape: typeof Shape, target: HTMLElement): HTMLElement {
        //@ts-ignore
        const shapeKey = shape.shapeKey;
        //@ts-ignore
        const defaultCellState = shape.defaultCellState;
        //@ts-ignore
        const displayName = getDisplayName(shape);

        const width = defaultCellState.width ?? DEFAULT_HEIGHT_WIDTH;
        const height = defaultCellState.height ?? DEFAULT_HEIGHT_WIDTH;

        const el = document.createElement("div");
        target.appendChild(el);
        el.style.height = `${height}px`;
        el.style.width = `${width}px`;
        el.style.userSelect = 'none';

        const previewGraph = new Graph(el);
        previewGraph.setCellsLocked(true);
        previewGraph.setCellsSelectable(false);
        const v: Cell = previewGraph.insertVertex(previewGraph.getDefaultParent(),
            null,
            //@ts-ignore yes it does, see :70
            displayName,
            0,
            0,
            defaultCellState.width ?? DEFAULT_HEIGHT_WIDTH,
            defaultCellState.height ?? DEFAULT_HEIGHT_WIDTH,
            //@ts-ignore see :43
            { ...defaultCellState, shape: shapeKey, }
        );

        return el;
    }

    private addDragSource(shapeKey: string) {
        const shapeClass: typeof Shape = new CellRenderer().getShape(shapeKey);

        
        const dragSource = this.makePreviewInstanceOfShape(shapeClass, DragAndDropHandler.TOOLBOX_ELEMENT)

        gestureUtils.makeDraggable(
            dragSource,
            this.graph,
            this.dropElementHandler.bind(this, shapeClass)
        );
    }

    onDestroy() {

    }
}