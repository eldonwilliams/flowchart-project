/**
 * The primary focus of this component is to open an api which allows values in values to modify style and 
 * any other value they wish. The main way this works is inserting an event before a component is rendered
 * where a conditional check can be inserted and the other values can be updated.
 */

import { Cell, EventObject, GraphPlugin, InternalEvent, Shape } from "@maxgraph/core";
import CustomGraph from "../CustomGraph";
import DoUpdate, { getCellValue, getCellValueRoot, setCellValue } from "../util/CellUtil";
import DoubleLineShape from "../edge-renders/DoubleLineShape";
import { getShapeFromCell, setupCellForShape } from "../util/ShapeUtil";
import CustomShapeInterface from "../shapes/CustomShapeInterface";

export type CellChangeListener = (cells: Cell[]) => void;

export default class StyledFeatures implements GraphPlugin {
    public static pluginId: string = "StyledFeatures";

    public graph: CustomGraph;

    private listeners: CellChangeListener[] = [];

    constructor(graph: CustomGraph) {
        this.graph = graph;

        this.DoUpdate = DoUpdate.bind(this, graph);

        graph.addListener(InternalEvent.ADD, (_, obj: EventObject) => {
            this.invokeListeners(obj.getProperty("cells"));
        });

        this.addListener(this.insertInitialShapeValue.bind(this));
        this.addListener(this.updateDoubleShape.bind(this));
    }

    DoUpdate;

    public invokeListeners(cells: Cell[]) {
        this.listeners.forEach(l => l(cells));
    }

    public insertInitialShapeValue(cell: Cell | Cell[]) {
        if (cell instanceof Array) {
            cell.forEach(c => this.insertInitialShapeValue(c));
            return;
        }

        if (cell.isEdge()) return;

        if (getCellValue(cell, "shape") != null) return;

        setCellValue(cell, "shape", cell.style.shape, true);
        setupCellForShape(cell, getShapeFromCell(cell));
    }

    public updateDoubleShape(cell: Cell | Cell[]) {
        if (cell instanceof Array) {
            cell.forEach(c => this.updateDoubleShape(c));
            return;
        }

        let values = getCellValueRoot(cell);

        if (values.double == true) {
            if (cell.isEdge()) {
                this.DoUpdate(cell, () => {
                    cell.style.shape = DoubleLineShape.shapeKey
                });
                return;
            }

            let shape: typeof CustomShapeInterface = getShapeFromCell(cell) as typeof CustomShapeInterface;

            this.DoUpdate(cell, () => {
                cell.style.shape = (shape.isSingle ? shape.toDouble : shape.shapeKey) ?? shape.shapeKey;
            });
        } else {
            if (cell.isEdge()) {
                this.DoUpdate(cell, () => {
                    cell.style.shape = "connector";
                });
                return;
            }

            this.DoUpdate(cell, () => {
                cell.style.shape = getCellValue(cell, "shape");
            });
        }
    }

    /**
     * Adds a listener to the CELL_CHANGED event
     * 
     * Returns a function which allows for the listener to be disconnected
     * 
     * @param fn 
     * @returns 
     */
    public addListener(fn: CellChangeListener): () => void {
        this.listeners.push(fn);
        return this.removeListener.bind(this, fn);
    }

    /**
     * Removes the give listener from events
     * 
     * @param fn 
     */
    public removeListener(fn: CellChangeListener) {
        this.listeners = this.listeners.filter(l => l != fn);
    }

    onDestroy() {
        this.listeners = [];
    }
    
}