import "@maxgraph/core";
import CustomGraph from "./CustomGraph";
import { Cell, Client, InternalEvent } from "@maxgraph/core";
import EllipseGeometryClass from "./shapes/geometry/EllipseGeometryClass";
import SquareGeometryClass from "./shapes/geometry/SquareGeometryClass";
import { deserializeGraph, serializeGraph } from "./util/Serialization";

Client.setImageBasePath("/images")

const container = document.getElementById("graph-container");
InternalEvent.disableContextMenu(container);

const graph = new CustomGraph(container);

const topbar = document.getElementById("topbar");

let saveData = "";

const saveButton = document.createElement("button");
saveButton.innerText = "Save";
saveButton.onclick = () => {
    saveData = serializeGraph(graph);
}

const loadButton = document.createElement("button");
loadButton.innerText = "Load";
loadButton.onclick = () => {
    if (saveData === "") return;
    deserializeGraph(graph, saveData);
}

topbar.appendChild(saveButton);
topbar.appendChild(loadButton);