import { Cell, Graph, PopupMenuHandler } from "@maxgraph/core";
import SquareGeometryClass from "../shapes/geometry/SquareGeometryClass";

export default class CustomPopupMenuHandler extends PopupMenuHandler {
    constructor(graph: Graph) {
        super(graph);

        // @ts-ignore
        this.factoryMethod = (handler: CustomPopupMenuHandler, cell: Cell, me: MouseEvent) => {
            if (cell != null)
                this.cellContextMenu(handler, cell, me);
            else
                this.graphContextMenu(handler, me);
        }
    }

    cellContextMenu(handler: CustomPopupMenuHandler, cell: Cell, me: MouseEvent) {
        const graph = this.graph;
        this.addItem("Delete", null, function() {
            graph.removeCells([cell]);
        });
    }

    graphContextMenu(handler: CustomPopupMenuHandler, me: MouseEvent) {
        const graph = this.graph;
        this.addItem("Add Vertex", null, function() {
            graph.insertVertex({
                parent: graph.getDefaultParent(),
                height: 20,
                width: 20,
                geometryClass: SquareGeometryClass,
                x: me.x,
                y: me.y,
            });
        });
    }
}