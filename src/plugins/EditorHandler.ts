import { GraphPlugin } from "@maxgraph/core";
import { Graph } from "@maxgraph/core/dist/view/Graph";

export default class EditorHandler implements GraphPlugin {
    static pluginId = "EditorHandlerPlugin";

    // addEventListener('keydown', event => {
    //     if (event.key != "Delete" && event.key != "Backspace") return;

    //     const selected = this.getSelectionCells();

    //     this.removeCells(selected, true);
    // });

    graph: Graph;

    constructor(graph: Graph) {
        this.graph = graph;
        addEventListener("keydown", this.handleKeydown);
    }

    /**
     * Handles all keydown events
     * @param event 
     */
    private handleKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case "Delete":
            case "Backspace":
                this.handleDeletion(event);
                break;
            default:
                break;
        }
    }

    /**
     * Handles an event for deletion
     * @param _ 
     */
    private handleDeletion(_: KeyboardEvent) {
        const selected = this.graph.getSelectionCells();
        this.graph.removeCells(selected);
    }

    onDestroy() {
        removeEventListener("keydown", this.handleKeydown);
    }
}