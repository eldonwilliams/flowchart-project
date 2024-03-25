import { CellRenderer, Shape } from "@maxgraph/core";
import Shapes from "../shapes/Shapes";
import { loadableClasses as EdgeClassesLoadable } from "../edge-renders/EdgeRenders";


export default class CustomCellRenderer extends CellRenderer {
    static registeredShapes = false;

    constructor() {
        super();
        if (!CustomCellRenderer.registeredShapes) {
            Shapes.forEach(v => CustomCellRenderer.registerShape(v.shapeKey, v as unknown as typeof Shape));
            EdgeClassesLoadable.forEach(v => CustomCellRenderer.registerShape(v.shapeKey, v as unknown as typeof Shape));
            CustomCellRenderer.registeredShapes = true;
        }
    }
}