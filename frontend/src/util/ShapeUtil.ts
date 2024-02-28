import { Shape } from "@maxgraph/core";

export function getDisplayName(shape: typeof Shape): string {
    //@ts-ignore it might
    if (shape.shapeKey) {
        //@ts-ignore
        return shape.friendlyName ?? shape.shapeKey;
    }
    return "";
}

export function setupCellForShape(cell: any, shape: typeof Shape) {
    //@ts-ignore
    const defaultCellState = shape.defaultCellState;
    //@ts-ignore
    const geometryClass = shape.geometryClass ?? Geometry;

    cell.geometry = new geometryClass(
        cell.geometry.x ?? 0,
        cell.geometry.y ?? 0,
        cell.geometry.width ?? defaultCellState.width,
        cell.geometry.height ?? defaultCellState.height
    );

    cell.style = { ...defaultCellState, ...cell.style ?? {}, };
}