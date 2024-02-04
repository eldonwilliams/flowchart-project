import "@maxgraph/core";
import CustomGraph from "./CustomGraph";
import { Cell, Client, InternalEvent } from "@maxgraph/core";
import EllipseGeometryClass from "./shapes/geometry/EllipseGeometryClass";
import SquareGeometryClass from "./shapes/geometry/SquareGeometryClass";

Client.setImageBasePath("/images")

const container = document.getElementById("graph-container");
InternalEvent.disableContextMenu(container);

const graph = new CustomGraph(container);

const parent = graph.getDefaultParent();

let v1;

graph.batchUpdate(() => {
    v1 = graph.insertVertex({
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
    });
});

