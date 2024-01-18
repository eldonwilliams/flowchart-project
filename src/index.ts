import "@maxgraph/core";
import CustomGraph from "./CustomGraph";
import InternalEvent from "@maxgraph/core/dist/view/event/InternalEvent";
import { addToolbarItem } from "./toolbar";
import SquareGeometryClass from "./shapes/geometry/SquareGeometryClass";
import { Client } from "@maxgraph/core";
import EllipseGeometryClass from "./shapes/geometry/EllipseGeometryClass";

Client.setImageBasePath("/images")

const container = document.getElementById("graph-container");
InternalEvent.disableContextMenu(container);

const graph = new CustomGraph(container);
graph.setConnectable(true);

const parent = graph.getDefaultParent();

graph.batchUpdate(() => {
    const v1 = graph.insertVertex({
        parent,
        size: [80, 30],
        position: [20, 20],
        style: {
            shape: "doubleEllipse",
        },
        geometryClass: EllipseGeometryClass,
        value: "locations"
    });

    const v2 = graph.insertVertex({
        parent,
        size: [80, 30],
        position: [120, 20],
        style: {
            shape: "ellipse",
        },
        geometryClass: EllipseGeometryClass,
        value: "persons"
    });

    const v3 = graph.insertVertex({
        parent,
        size: [80, 30],
        position: [60, 100],
        style: {
            shape: "rectangle",
            arcSize: 10, // rounded corners
            
        },
        geometryClass: SquareGeometryClass,
        value: "Dept"
    });

    graph.insertEdge({
        parent,
        source: v1,
        target: v3,
        style: {
            editable: false,
        }
    });
});

addToolbarItem("Export", () => {

});