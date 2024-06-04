import "@maxgraph/core";
import CustomGraph from "./CustomGraph";
import { Client, InternalEvent } from "@maxgraph/core";
import { deserializeGraph, serializeGraph } from "./util/Serialization";
import discoverFiles from "./util/ServerDiscovery";
import {
  addServerItem,
  clearServerItems,
  hideServerDiscoveryMenu,
  hideStartMenu,
  showServerDiscoveryMenu,
  showStartMenu,
  stopLoadingServerDiscoveryMenu,
} from "./util/Menus";
import { url } from "./API_URL";
import PropertiesHandler from "./plugins/PropertiesHandler";
import { getCellValue } from "./util/CellUtil";
import { Graph } from "@maxgraph/core/dist/view/Graph";

Client.setImageBasePath("/images");

const container = document.getElementById("graph-container");
InternalEvent.disableContextMenu(container);

const graph = new CustomGraph(container);
const propertyHandler = graph.getPlugin(PropertiesHandler.pluginId) as PropertiesHandler;

// @ts-ignore
window.graph = graph;

const topbar = document.getElementById("topbar");

let assignmentData = "";
let saveData = "";

const saveButton = document.createElement("button");
saveButton.innerText = "Save";
saveButton.onclick = () => {
  saveData = serializeGraph(graph);
};

const loadButton = document.createElement("button");
loadButton.innerText = "Load";
loadButton.onclick = () => {
  if (saveData === "") return;
  deserializeGraph(graph, saveData);
};

const saveFileButton = document.createElement("button");
saveFileButton.innerText = "Save File";
saveFileButton.onclick = () => {
  saveData = serializeGraph(graph);
  const blob = new Blob([saveData], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "graph.dat";
  a.click();
};

const saveAssignmentButton = document.createElement("button");
saveAssignmentButton.innerText = "Download Assignment";
saveAssignmentButton.onclick = () => {
  // TODO: Make this different than the other save file button
  // by having a popup where information re: grading is selected, and other options
  saveData = serializeGraph(graph);
  const blob = new Blob([saveData], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "assignment.dat";
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
    };
    reader.readAsText(file);
  }
};

const fileLabel = document.createElement("button");
fileLabel.innerHTML = "<label for='file-input'>Load File</label>";

const serverPickButton = document.createElement("button");
serverPickButton.innerText = "Load from Server";
serverPickButton.onclick = async () => {
  clearServerItems();
  showServerDiscoveryMenu(true);
  const files = await discoverFiles();

  files.forEach((file) =>
    addServerItem(
      file,
      () => {
        fetch(`${url}/discovery/${file}`)
          .then((res) => res.text())
          .then((data) => {
            hideServerDiscoveryMenu();
            deserializeGraph(graph, data);
          });
      },
      false
    )
  );

  if (files.length === 0) hideServerDiscoveryMenu();

  stopLoadingServerDiscoveryMenu();
};

const gradeButton = document.createElement("button");
gradeButton.innerText = "Submit";
gradeButton.onclick = async () => {

  const score = await fetch(`${url}/grading`, {
    method: "POST",
    body: `${serializeGraph(graph)}\n${assignmentData}`,
  }).then((res) => res.text()).then(alert);
};

// topbar.appendChild(saveButton);
// topbar.appendChild(loadButton);
// topbar.appendChild(document.createElement("br"));
// topbar.appendChild(saveFileButton);
// topbar.appendChild(fileLabel);
// topbar.appendChild(fileInput);
// topbar.appendChild(serverPickButton);
// topbar.appendChild(gradeButton);

function clearTopbar() {
  while (topbar.hasChildNodes()) {
    topbar.removeChild(topbar.firstChild);
  }
}

function addTopbarSpacer() {
  topbar.appendChild(document.createElement("br"));
}

const assignmentUploadInput = document.querySelector('#assignment-upload') as HTMLInputElement;
assignmentUploadInput.addEventListener('input', (event) => {
  const file = (event.target as HTMLInputElement).files[0];
  (event.target as HTMLInputElement).value = "";
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result as string;
      assignmentData = contents;
      let g = new Graph(null);
      deserializeGraph(g as CustomGraph, assignmentData, true);
      let labels = [...new Set(g.getDefaultParent().children.map(v => getCellValue(v, "label")).filter(v => v != null))]
      propertyHandler.labelOptions = labels;
      g.destroy();
    };
    reader.readAsText(file);
  }
  clearTopbar();
  hideStartMenu();
  let title = document.createElement('div');
  title.innerHTML = `Assignment ${assignmentUploadInput.value.split('\\').pop()}`
  topbar.appendChild(title);
  topbar.appendChild(saveButton);
  topbar.appendChild(loadButton);
  addTopbarSpacer();
  topbar.appendChild(saveFileButton);
  topbar.appendChild(gradeButton);
})

document.querySelector('#assignment-creation').addEventListener('click', () => {
  clearTopbar();
  hideStartMenu();
  let title = document.createElement('div');
  title.innerHTML = `Assignment Creation`;
  topbar.appendChild(title);
  topbar.appendChild(saveButton);
  topbar.appendChild(loadButton);
  addTopbarSpacer();
  topbar.appendChild(saveAssignmentButton);
  topbar.appendChild(fileInput);
  topbar.appendChild(fileLabel);
})

document.querySelector('#document-creation').addEventListener('click', () => {
  clearTopbar();
  hideStartMenu();
  let title = document.createElement('div');
  title.innerHTML = `Document Freedraw`;
  topbar.appendChild(title);
  topbar.appendChild(saveButton);
  topbar.appendChild(loadButton);
  addTopbarSpacer();
  topbar.appendChild(saveFileButton);
  topbar.appendChild(serverPickButton);
  topbar.appendChild(fileInput);
  topbar.appendChild(fileLabel);
})

showStartMenu();