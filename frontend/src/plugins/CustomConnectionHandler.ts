import { Cell, CellState, ConnectionHandler, InternalMouseEvent } from "@maxgraph/core";
import { EDGESTYLE } from "@maxgraph/core/dist/util/Constants";

export default class CustomConnectionHandler extends ConnectionHandler {
    livePreview: boolean = true;

    // Make preview orthogonal
    createEdgeState(me?: InternalMouseEvent): CellState {
        var edge = this.graph.createEdge(null, null, null, null, null, {});

        return new CellState(this.graph.view, edge, this.graph.getCellStyle(edge));
    }

    connect(source: Cell, target: Cell, evt: MouseEvent, dropTarget?: Cell): void {
        if (source && dropTarget) {
            if (source.getId() == dropTarget.getId()) {
                return;
            }
        }
        super.connect(source, target, evt, dropTarget);
    }

    // disable floating connections
    isConnectableCell(cell: Cell): boolean {
        return false;
    }
}