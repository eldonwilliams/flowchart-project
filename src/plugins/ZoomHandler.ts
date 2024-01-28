import { Graph, GraphPlugin, InternalEvent } from "@maxgraph/core";

/**
 * This plugin handles zooming in/out of the graph using the "wheel" event.
 */
export default class ZoomHandler implements GraphPlugin {
    static pluginId = "ZoomHandlerPlugin";

    graph: Graph;

    constructor (graph: Graph) {
        this.graph = graph;
        InternalEvent.addMouseWheelListener(
            this.handleMouseWheelEvent,
            graph.container
        );
    }

    private handleMouseWheelEvent(event: WheelEvent) {
        if (!event.ctrlKey) return;
        this.graph.zoom(event.deltaY / 1000);
    }

    onDestroy() {
        InternalEvent.removeListener(
            this.graph.container,
            "wheel",
            this.handleMouseWheelEvent
        );
    }
}