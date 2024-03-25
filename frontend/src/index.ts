import "@maxgraph/core";
import CustomGraph from "./CustomGraph";
import { Client, InternalEvent } from "@maxgraph/core";
import { deserializeGraph, serializeGraph } from "./util/Serialization";
import discoverFiles from "./util/ServerDiscovery";
import { addServerItem, clearServerItems, hideServerDiscoveryMenu, showServerDiscoveryMenu, stopLoadingServerDiscoveryMenu } from "./util/ServerDiscoveryMenu";
import { url } from "./API_URL";

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

const saveFileButton = document.createElement("button");
saveFileButton.innerText = "Save File";
saveFileButton.onclick = () => {
    saveData = serializeGraph(graph);
    const blob = new Blob([saveData], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "graph.dat";
    a.click();
}

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = ".dat";
fileInput.innerText = "Load File";
fileInput.id = "file-input";
fileInput.oninput = (event) => {
    const file = (event.target as HTMLInputElement).files[0];
    (event.target as HTMLInputElement).value = "";
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const contents = e.target.result as string;
            deserializeGraph(graph, contents);
        }
        reader.readAsText(file);
    }
}

const fileLabel = document.createElement("button");
fileLabel.innerHTML = "<label for='file-input'>Load File</label>";

const serverPickButton = document.createElement("button");
serverPickButton.innerText = "Load from Server";
serverPickButton.onclick = async () => {
    clearServerItems();
    showServerDiscoveryMenu(true);
    const files = await discoverFiles();

    files.forEach((file) => addServerItem(file, ()=>{
        fetch(`${url}/discovery/${file}`)
            .then((res) => res.text())
            .then((data) => {
                deserializeGraph(graph, data);
                hideServerDiscoveryMenu();
            });
    }, false));

    if (files.length === 0) hideServerDiscoveryMenu();

    stopLoadingServerDiscoveryMenu();
}

topbar.appendChild(saveButton);
topbar.appendChild(loadButton);
topbar.appendChild(document.createElement("br"));
topbar.appendChild(saveFileButton);
topbar.appendChild(fileLabel);
topbar.appendChild(fileInput);
topbar.appendChild(serverPickButton);

// @ts-ignore
window.graph = graph;