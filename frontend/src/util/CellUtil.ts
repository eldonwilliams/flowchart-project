import { Cell } from "@maxgraph/core";
import StyledFeatures from "../plugins/StyledFeatures";
import CustomGraph from "../CustomGraph";
import { ARROW } from "@maxgraph/core/dist/util/Constants";


interface TrueCellValues {
    label: string;
    dashed: boolean;
    underlined: boolean;
    double: boolean;
    updated: number;

    created: number;

    shape: string;
    
    cardinality: string;
}

export interface CellValues extends TrueCellValues {
    [key: string]: any;
}

export function getCellValue(cell: Cell, key: keyof TrueCellValues): any {
    if (typeof cell.value !== "object" || cell.value === null) {
        cell.setValue({ label: cell.value });
        return cell.value[key];
    }
    return cell.value[key];
}

export function getCellValueRoot(cell: Cell): CellValues {
    if (typeof cell.value === "string" || cell.value === null) {
        cell.setValue({ label: cell.value });
    }
    return cell.value;
}

export function setCellValue(cell: Cell, key: keyof TrueCellValues, value: any, quite: boolean = false) {
    if (typeof cell.value === "string" || cell.value === null) {
        cell.setValue({ label: cell.value });
    }
    cell.value[key] = value;
    cell.value["updated"] = Date.now();
    let w: any = window;
    if (w.graph) {
        w.graph.logs.push({
            time: Date.now(),
            object: cell.id,
            value: key,
            newValue: value,
        });
        if (quite == true) return;
        w.graph.getPlugin(StyledFeatures.pluginId).invokeListeners([cell]);
    }
}

export default function DoUpdate(graph: CustomGraph, cell: Cell, fn: Function, updateEdges: boolean = false) {
    graph.batchUpdate(() => {
        fn();
    });
    graph.refresh(cell);
    if (updateEdges) {
        this.graph.getEdges(cell).forEach(edge => {
            this.graph.refresh(edge);
        });
    }
}