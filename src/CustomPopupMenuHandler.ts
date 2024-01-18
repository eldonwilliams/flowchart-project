import { Cell, Graph, PopupMenuHandler, PopupMenuItem } from "@maxgraph/core";

export default class CustomPopupMenuHandler extends PopupMenuHandler {
    constructor(graph: Graph) {
        super(graph);

        // @ts-ignore
        this.factoryMethod = (handler: CustomPopupMenuHandler, cell: Cell, me: MouseEvent) => {
            handler.addItem("Delete", null, function() {
                graph.removeCells([cell], true);
            });
        }
    }
}