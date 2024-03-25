import { CellState, Geometry, RhombusShape } from "@maxgraph/core";
import CustomShapeInterface from "./CustomShapeInterface";
import EllipseGeometryClass from "./geometry/EllipseGeometryClass";
import { DoubleRelationShapeKey, RelationShapeKey } from "./Keys";


export default class RelationShape extends RhombusShape implements CustomShapeInterface {
    static shapeKey = RelationShapeKey;

    static friendlyName: string = "Relationship";

    static geometryClass: typeof Geometry = EllipseGeometryClass;

    public static toDouble: string = DoubleRelationShapeKey;
    public static isSingle: boolean = true;

    static defaultCellState: Partial<CellState> = {
        width: 70,
        height: 50
    };
}