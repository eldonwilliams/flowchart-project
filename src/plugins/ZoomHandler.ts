import { Graph, GraphPlugin, InternalEvent, PanningHandler } from "@maxgraph/core";

/**
 * This plugin handles zooming in/out of the graph using the "wheel" event.
 */
export default class ZoomHandler implements GraphPlugin {
    static pluginId = "ZoomHandlerPlugin";

    graph: Graph;
    panningHandler: PanningHandler;

    constructor (graph: Graph) {
        this.graph = graph;
        this.panningHandler = graph.getPlugin(PanningHandler.pluginId) as PanningHandler;
        InternalEvent.addMouseWheelListener(
            this.handleMouseWheelEvent.bind(this),
            graph.container
        );
    }

    private handleMouseWheelEvent(event: WheelEvent) {
        if (!event.ctrlKey) {
            this.panningHandler.dx += event.deltaX;
            this.panningHandler.dy += event.deltaY;
            this.graph.panGraph(this.panningHandler.dx, this.panningHandler.dy);
            event.preventDefault();
            return;
        }
        this.graph.zoom(1 + event.deltaY / 500);
    }

    onDestroy() {
        InternalEvent.removeListener(
            this.graph.container,
            "wheel",
            this.handleMouseWheelEvent.bind(this)
        );
    }
}