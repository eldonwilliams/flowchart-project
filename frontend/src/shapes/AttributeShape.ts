import { CellState, EllipseShape, Geometry } from "@maxgraph/core";
import CustomShapeInterface from "./CustomShapeInterface";
import EllipseGeometryClass from "./geometry/EllipseGeometryClass";
import { AttributeShapeKey, DoubleAttributeShapeKey } from "./Keys";


export default class AttributeShape extends EllipseShape implements CustomShapeInterface {
    static shapeKey = AttributeShapeKey;

    static friendlyName: string = "Attribute";

    static geometryClass: typeof Geometry = EllipseGeometryClass;

    static toDouble: string = DoubleAttributeShapeKey;
    
    static isSingle: boolean = true;

    static defaultCellState: Partial<CellState> = {
        width: 70,
        height: 40
    };
}