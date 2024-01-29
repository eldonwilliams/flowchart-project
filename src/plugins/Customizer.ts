import { Graph, GraphPlugin, PanningHandler } from "@maxgraph/core";
import { EDGESTYLE } from "@maxgraph/core/dist/util/Constants";

export default class Customizer implements GraphPlugin {
    static pluginId = "CustomizerPlugin";

    constructor (graph: Graph) {
        graph.getStylesheet().getDefaultEdgeStyle().edgeStyle = EDGESTYLE.ENTITY_RELATION;

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