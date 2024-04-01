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

export type CellChangeListener = (cells: CellChangeEvent[]) => void;

export interface CellChangeEvent {
    cell: Cell;
    changed: string;
    new: any;
    old: any;
}

export default class StyledFeatures implements GraphPlugin {
    public static pluginId: string = "StyledFeatures";

    public graph: CustomGraph;

    private listeners: CellChangeListener[] = [];

    constructor(graph: CustomGraph) {
        this.graph = graph;

        this.DoUpdate = DoUpdate.bind(graph, graph);

        graph.addListener(InternalEvent.ADD, (_, obj: EventObject) => {
            this.invokeListeners(obj.getProperty("cells"));
        });

        this.addListener(this.insertInitialShapeValue.bind(this));
        this.addListener(this.updateDoubleShape.bind(this));
        this.addListener(this.updateDashStyle.bind(this));
        this.addListener(this.updateCardinalityLabel.bind(this));
    }

    DoUpdate;

    public invokeListeners(cells: CellChangeEvent[] | CellChangeEvent) {
        if (!(cells instanceof Array)) {
            this.invokeListeners([cells]);
            return;
        }

        this.listeners.forEach(l => l(cells));
    }

    public insertInitialShapeValue(event: CellChangeEvent | CellChangeEvent[]) {
        if (event instanceof Array) {
            event.forEach(c => this.insertInitialShapeValue(c));
            return;
        }

        let cell = event.cell;

        if (cell.isEdge()) return;

        if (getCellValue(cell, "shape") != null) return;

        setCellValue(cell, "shape", cell.style.shape, true);
        setupCellForShape(cell, getShapeFromCell(cell));
    }

    public updateDoubleShape(event: CellChangeEvent | CellChangeEvent[]) {
        if (event instanceof Array) {
            event.forEach(c => this.updateDoubleShape(c));
            return;
        }

        let cell = event.cell;

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

    public updateCardinalityLabel(event: CellChangeEvent | CellChangeEvent[]) {
        if (event instanceof Array) {
            event.forEach(c => this.updateCardinalityLabel(c));
            return;
        }

        let cell = event.cell;
        let values = getCellValueRoot(cell);

        if (cell.isVertex()) {
            return;
        }

        let sourceIsEntity = cell.source.isVertex() && getCellValue(cell.source, "shape") == "Entity";

        cell.geometry.setRect(0.9 * (sourceIsEntity ? -1 : 1), 10, 10, 10);

        if (values.cardinality == "none") {
            this.DoUpdate(cell, () => {
                setCellValue(cell, "label", "", true);
            });
        }

        this.DoUpdate(cell, () => {
            setCellValue(cell, "label", values.cardinality, true);
        });
    }

    public updateDashStyle(event: CellChangeEvent | CellChangeEvent[]) {
        if (event instanceof Array) {
            event.forEach(c => this.updateDashStyle(c));
            return;
        }

        let cell = event.cell;
        let values = getCellValueRoot(cell);

        if (cell.isVertex()) {
            this.DoUpdate(cell, () => {
                cell.style.dashed = values.dashed;
            });
        } else if (cell.isEdge() && values.dashed) {
            this.DoUpdate(cell, () => {
                cell.style.dashed = false;
            });
            setCellValue(cell, "dashed", false, true);
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