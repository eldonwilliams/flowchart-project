import { CellState, Geometry, RectangleShape } from "@maxgraph/core";
import CustomShapeInterface from "./CustomShapeInterface";
import SquareGeometryClass from "./geometry/SquareGeometryClass";

export default class EntityShape extends RectangleShape implements CustomShapeInterface {
    static shapeKey = "Entity";

    static friendlyName: string = "Entity";
    
    static geometryClass: typeof Geometry = SquareGeometryClass;

    static defaultCellState: Partial<CellState> = {
        width: 60,
        height: 50,
        style: {
            arcSize: 25,
        }
    };
}