import { Cell } from "@maxgraph/core";

export function getCellValue(cell: Cell, key: string): any {
    if (typeof cell.value !== "object" || cell.value === null) {
        cell.setValue({ label: cell.value });
        return cell.value[key];
    }
    return cell.value[key];
}

export function setCellValue(cell: Cell, key: string, value: any) {
    if (typeof cell.value === "string" || cell.value === null) {
        cell.setValue({ label: cell.value });
    }
    cell.value[key] = value;
}