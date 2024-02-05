import { CellState, DoubleEllipseShape, Geometry } from "@maxgraph/core";
import CustomShapeInterface from "./CustomShapeInterface";
import EllipseGeometryClass from "./geometry/EllipseGeometryClass";

export default class DoubleAttributeShape extends DoubleEllipseShape implements CustomShapeInterface {
    static shapeKey = "DoubleAttribute";
    static friendlyName: string = "Attribute";
    static geometryClass: typeof Geometry = EllipseGeometryClass;
    static nonDoubleShape: string = "Attribute";
    static isDoubleShape: boolean = true;
    static defaultCellState: Partial<CellState> = {
        width: 70,
        height: 40
    };
}