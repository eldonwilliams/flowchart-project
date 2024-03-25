import { AbstractCanvas2D, CellState, Geometry, RectangleShape } from "@maxgraph/core";
import CustomShapeInterface from "./CustomShapeInterface";
import SquareGeometryClass from "./geometry/SquareGeometryClass";
import { DoubleEntityShapeKey, EntityShapeKey } from "./Keys";


export default class DoubleEntityShape extends RectangleShape implements CustomShapeInterface {
    static shapeKey = DoubleEntityShapeKey;

    static friendlyName: string = "Entity";
    
    static geometryClass: typeof Geometry = SquareGeometryClass;

    static toSingle: string = EntityShapeKey;
    static isDouble: boolean = true;
    static isSingle: boolean = false;

    static defaultCellState: Partial<CellState> = {
        width: 60,
        height: 50,
        style: {
            arcSize: 25,
        }
    };

    // credit to MaxGraph DoubleEllipseShape.ts for this method
    paintForeground(c: AbstractCanvas2D, x: number, y: number, w: number, h: number): void {
        if (!this.outline) {
            const margin = this.style?.margin ?? Math.min(3 + this.strokeWidth, Math.min(w / 5, h / 5));
        
            x += margin;
            y += margin;
            w -= 2 * margin;
            h -= 2 * margin;

            if (w > 0 && h > 0) {
                c.rect(x, y, w, h);
            }

            c.stroke();
        }
    }
}