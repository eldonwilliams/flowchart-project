import { CellState, Geometry, RectangleShape } from "@maxgraph/core";
import CustomShapeInterface from "./CustomShapeInterface";
import SquareGeometryClass from "./geometry/SquareGeometryClass";
import { DoubleEntityShapeKey, EntityShapeKey } from "./Keys";


export default class EntityShape extends RectangleShape implements CustomShapeInterface {
    static shapeKey = EntityShapeKey;

    static friendlyName: string = "Entity";
    
    static geometryClass: typeof Geometry = SquareGeometryClass;

    static toDouble: string = DoubleEntityShapeKey;
    
    static isSingle: boolean = true;

    static defaultCellState: Partial<CellState> = {
        width: 60,
        height: 50,
        style: {
            arcSize: 25,
        }
    };
}