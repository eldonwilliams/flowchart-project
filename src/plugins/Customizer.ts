import { GraphPlugin } from "@maxgraph/core";
import { EDGESTYLE } from "@maxgraph/core/dist/util/Constants";
import { Graph } from "@maxgraph/core/dist/view/Graph";

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
    }

    onDestroy() {/**/}
}