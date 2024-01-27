import { CellState, Geometry, RhombusShape } from "@maxgraph/core";
import CustomShapeInterface from "./CustomShapeInterface";
import EllipseGeometryClass from "./geometry/EllipseGeometryClass";

export default class RelationShape extends RhombusShape implements CustomShapeInterface {
    static shapeKey = "Relation";

    static friendlyName: string = "Relationship";

    static geometryClass: typeof Geometry = EllipseGeometryClass;

    static defaultCellState: Partial<CellState> = {
        width: 70,
        height: 50
    };
}