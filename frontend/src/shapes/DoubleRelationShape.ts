import { AbstractCanvas2D, CellState, Geometry, Point, RhombusShape } from "@maxgraph/core";
import CustomShapeInterface from "./CustomShapeInterface";
import EllipseGeometryClass from "./geometry/EllipseGeometryClass";

export default class DoubleRelationShape extends RhombusShape implements CustomShapeInterface {
    static shapeKey = "DoubleRelation";

    static friendlyName: string = "Relationship";

    static geometryClass: typeof Geometry = EllipseGeometryClass;

    static isDoubleShape: boolean = true;

    static nonDoubleShape: string = "Relation";

    static defaultCellState: Partial<CellState> = {
        width: 70,
        height: 50
    };

    paintForeground(c: AbstractCanvas2D, x: number, y: number, w: number, h: number): void {
  
        if (!this.outline) {
            const margin = this.style?.margin ?? Math.min(3 + this.strokeWidth, Math.min(w / 5, h / 5));
        
            x += margin;
            y += margin;
            w -= 2 * margin;
            h -= 2 * margin;

            c.begin();
            if (w > 0 && h > 0) {
                this.addPoints(
                    c,
                    [
                        new Point(x + w / 2, y),
                        new Point(x + w, y + h / 2),
                        new Point(x + w / 2, y + h),
                        new Point(x, y + h / 2),
                    ],
                    this.isRounded,
                    0,
                    true
                );
            }

            c.fillAndStroke();
        }
    }

    paintVertexShape(c: AbstractCanvas2D, x: number, y: number, w: number, h: number, outline: boolean = true): void {
        const hw = w / 2;
        const hh = h / 2;
    
        c.begin();
        this.addPoints(
          c,
          [
            new Point(x + hw, y),
            new Point(x + w, y + hh),
            new Point(x + hw, y + h),
            new Point(x, y + hh),
          ],
          false,
          0,
          true
        );
        c.fillAndStroke();
        
        if (w > 0 && h > 0 && outline) {
            const margin = this.style?.margin ?? 3 + this.strokeWidth;
            
            x += margin;
            y += margin;
            w -= 2 * margin;
            h -= 2 * margin;
            this.paintVertexShape(c, x, y, w, h, false);
        }
      }
}