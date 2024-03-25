import { CellState, DoubleEllipseShape, Geometry } from "@maxgraph/core";
import CustomShapeInterface from "./CustomShapeInterface";
import EllipseGeometryClass from "./geometry/EllipseGeometryClass";
import { AttributeShapeKey, DoubleAttributeShapeKey } from "./Keys";


export default class DoubleAttributeShape extends DoubleEllipseShape implements CustomShapeInterface {
    static shapeKey = DoubleAttributeShapeKey;
    static friendlyName: string = "Attribute";
    static geometryClass: typeof Geometry = EllipseGeometryClass;
    static toSingle: string = AttributeShapeKey;
    static isDouble: boolean = true;
    static isSingle: boolean = false;
    static defaultCellState: Partial<CellState> = {
        width: 70,
        height: 40
    };
}