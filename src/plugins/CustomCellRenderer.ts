import { CellRenderer, Shape } from "@maxgraph/core";
import Shapes from "../shapes/Shapes";


export default class CustomCellRenderer extends CellRenderer {
    static registeredShapes = false;

    constructor() {
        super();
        if (!CustomCellRenderer.registeredShapes) {
            Shapes.forEach(v => CustomCellRenderer.registerShape(v.shapeKey, v as unknown as typeof Shape));
            CustomCellRenderer.registeredShapes = true;
        }
    }
}