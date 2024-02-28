import { CellState, EllipseShape, Geometry } from "@maxgraph/core";
import CustomShapeInterface from "./CustomShapeInterface";
import EllipseGeometryClass from "./geometry/EllipseGeometryClass";

export default class AttributeShape extends EllipseShape implements CustomShapeInterface {
    static shapeKey = "Attribute";

    static friendlyName: string = "Attribute";

    static geometryClass: typeof Geometry = EllipseGeometryClass;

    static doubleShape: string = "DoubleAttribute";
    
    static isDoubleShape: boolean = false;

    static defaultCellState: Partial<CellState> = {
        width: 70,
        height: 40
    };
}