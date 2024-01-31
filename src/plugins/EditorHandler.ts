import { EventObject, Graph, GraphPlugin, InternalEvent } from "@maxgraph/core";

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
        addEventListener("keydown", this.handleKeydown.bind(this));
        this.graph.addListener(InternalEvent.DOUBLE_CLICK, this.handleDoubleClick.bind(this));
    }

    private handleDoubleClick(_, event: EventObject) {
        const cell = event.getProperty("cell");
        if (cell) {
            this.graph.startEditingAtCell(cell);
        }
    }

    /**
     * Handles all keydown events
     * @param event 
     */
    private handleKeydown(event: KeyboardEvent) {
        const activeElement = document.activeElement;
        const isTextInput = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;

        if (isTextInput) {
            return;
        }

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