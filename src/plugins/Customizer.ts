import { Graph, GraphPlugin, PanningHandler } from "@maxgraph/core";

export default class Customizer implements GraphPlugin {
    static pluginId = "CustomizerPlugin";

    constructor (graph: Graph) {
        graph.getStylesheet().getDefaultEdgeStyle().endArrow = "none";

        graph.setAllowLoops(false);
        graph.setAllowNegativeCoordinates(true);
        graph.setAllowDanglingEdges(false);
        graph.setConnectable(true);
        graph.setCellsEditable(true);
        graph.setPanning(true);
        graph.gridEnabled = true;
        graph.gridSize = 5;

        (graph.getPlugin("PanningHandler") as PanningHandler).useLeftButtonForPanning = true;
    }

    onDestroy() {/**/}
}