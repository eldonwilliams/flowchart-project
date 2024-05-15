import { Cell, EventObject, Geometry, Graph, GraphPlugin, InternalEvent } from "@maxgraph/core";
import { ARROW } from "@maxgraph/core/dist/util/Constants";
import { getCellValue, setCellValue } from "../util/CellUtil";

enum PROPERTY_TYPE {
    NUMBER,
    STRING,
    DROPDOWN,
    BREAK,
    CHECKBOX
}

type PropertyStyle = {
    label: string,
    width: string,
    options?: string[],
}

const DoubleShapes = [
    "ellipse",
    "rectangle",
    "doubleEllipse",
    "doubleRectangle",
]

export default class PropertiesHandler implements GraphPlugin {
    static pluginId = "PropertiesHandlerPlugin";
    static PROPERTY_ELEMENT = document.querySelector('#properties-mananger').querySelector('form');

    graph: Graph;

    /**
     * The current element where drawer properties will be added to
     */
    get currentParent(): HTMLElement {
        if (this.parentStack.length == 0) return PropertiesHandler.PROPERTY_ELEMENT;
        return this.parentStack[this.parentStack.length - 1];
    }

    /**
     * A stack of parents, when a new group is started, the current parent is pushed to the stack
     * and the new parent is set as the current parent.
     * When the group is ended, the current parent is popped from the stack and set as the current parent.
     */
    parentStack: HTMLElement[] = [];

    propertyDrawerCleanupFunctions: Function[] = [];

    constructor(graph: Graph) {
        this.graph = graph;

        graph.addListener(InternalEvent.CLICK, this.handleSelectEvent.bind(this));
        graph.addListener(InternalEvent.DOUBLE_CLICK, this.closeOnDBLClick.bind(this));
    }

    private closeOnDBLClick(_, event: EventObject) {
        if (event.getProperty("cell") == null) {
            this.resetProperties();
        }
    }

    private handleSelectEvent() {
        const selectedCell = this.graph.getSelectionCell();

        if (selectedCell == null) return;

        this.resetProperties();

        const handleRemoval = (_, event: EventObject) => {
            event.getProperty("cells").forEach((cell: Cell) => {
                if (cell == selectedCell) {
                    this.resetProperties();
                }
            });
        };

        this.graph.addListener(InternalEvent.CELLS_REMOVED, handleRemoval)
        this.propertyDrawerCleanupFunctions.push(() => {
            this.graph.removeListener(handleRemoval);
        });

        if (selectedCell.vertex) {
            this.handleClickOnVertex(selectedCell);
        }

        if (selectedCell.edge) {
            this.handleClickOnEdge(selectedCell);
        }
    }

    private handleClickOnVertex(vertex: Cell) {
        const graph = this.graph;

        function doUpdate(fn: Function, updateEdges: boolean = false) {
            graph.batchUpdate(fn);
            graph.refresh(vertex);
            if (updateEdges) {
                graph.getEdges(vertex).forEach(function (edge) {
                    graph.refresh(edge);
                });
            }
        }

        const handleLabelChange = (input: HTMLInputElement) => doUpdate(() => {
            setCellValue(vertex, "label", input.value);
        });

        const handleGeometryChange = (geometry: keyof Geometry, input: HTMLInputElement) => doUpdate(() => {
            // @ts-ignore shutup
            vertex.geometry[geometry] = Number(input.value);
        }, true);

        this.addProperty(getCellValue(vertex, "label"), PROPERTY_TYPE.STRING, handleLabelChange, { label: "Label", width: "150px", });

        this.startGroup("Geometry - Position");
        this.addProperty(vertex.geometry.x, PROPERTY_TYPE.NUMBER, handleGeometryChange.bind(this, 'x'), { label: "X", width: "75px", });
        this.addProperty(vertex.geometry.y, PROPERTY_TYPE.NUMBER, handleGeometryChange.bind(this, 'y'), { label: "Y", width: "75px", });
        this.endGroup();

        this.startGroup("Geometry - Size")
        this.addProperty(vertex.geometry.width, PROPERTY_TYPE.NUMBER, handleGeometryChange.bind(this, 'width'), { label: "Width", width: "75px", });
        this.addProperty(vertex.geometry.height, PROPERTY_TYPE.NUMBER, handleGeometryChange.bind(this, 'height'), { label: "Height", width: "75px", });
        this.endGroup();

        this.addProperty(getCellValue(vertex, "double"), PROPERTY_TYPE.CHECKBOX, (input: HTMLInputElement) => {
            setCellValue(vertex, "double", input.checked);
        }, { label: "Double Border", width: "150px", });

        this.addProperty(getCellValue(vertex, "dashed"), PROPERTY_TYPE.CHECKBOX, (input: HTMLInputElement) => {
            setCellValue(vertex, "dashed", input.checked);
        }, { label: "Dashed", width: "150px", });


        this.addProperty(getCellValue(vertex, "underlined"), PROPERTY_TYPE.CHECKBOX, (input: HTMLInputElement) => {
            setCellValue(vertex, "underlined", input.checked);
        }, { label: "Underlined", width: "150px", });
        // this.endGroup();
    }

    private handleClickOnEdge(edge: Cell) {
        this.addProperty(getCellValue(edge, "double"), PROPERTY_TYPE.CHECKBOX, (input: HTMLInputElement) => {
            setCellValue(edge, "double", input.checked);
        }, { label: "Mandatory Participation", width: "150px", });

        let cardinality = getCellValue(edge, "cardinality");
        this.addProperty(cardinality === false ? "none" : cardinality, PROPERTY_TYPE.DROPDOWN, (input: HTMLInputElement) => {
            setCellValue(edge, "cardinality", input.value != "none" ? input.value : false)
        }, { label: "Cardinality", width: "150px", options: ["none", "I", "J", "M", "N",] })

    }

    /**
     * Starts a horizontal group in the drawer
     * @param name 
     */
    private startGroup(name: string = "") {
        const newParent = document.createElement('div');
        newParent.className = "flex flex-row w-full gap-2";
        this.currentParent.appendChild(newParent);
        this.parentStack.push(newParent);
    }

    /**
     * Ends the current group in the drawer
     */
    private endGroup() {
        this.parentStack.pop();
    }

    /**
     * Adds a property to the drawer
     */
    private addProperty(value: any, type: PROPERTY_TYPE, handleChange: Function, { label, width, options, }: PropertyStyle = { label: "", width: "w-full" }) {
        PropertiesHandler.PROPERTY_ELEMENT.parentElement.classList.remove('hidden');
        let input: HTMLInputElement | HTMLSelectElement;

        let parent = this.currentParent;
        if (type != PROPERTY_TYPE.BREAK) {
            parent = document.createElement('div');
            parent.className = "w-full flex flex-row justify-between whitespace-nowrap"
        }

        switch (type) {
            case PROPERTY_TYPE.BREAK:
                const br = document.createElement('br');
                // this behaviour may be weird,
                // but it is how it should be
                this.currentParent.appendChild(br);
                return;
            case PROPERTY_TYPE.NUMBER:
                const a = document.createElement('label');
                a.htmlFor = label;
                a.innerText = label;

                input = document.createElement('input');
                input.type = "number";
                input.value = value;
                input.id = label;
                input.name = label;

                parent.appendChild(a);
                parent.appendChild(input);
                break;
            case PROPERTY_TYPE.STRING:
                const b = document.createElement('label');
                b.htmlFor = label;
                b.innerText = label;

                input = document.createElement('input');
                input.type = "text";
                input.value = value;
                input.id = label;
                input.name = label;

                parent.appendChild(b);
                parent.appendChild(input);
                break;
            case PROPERTY_TYPE.DROPDOWN:
                const c = document.createElement('label');
                c.htmlFor = label;
                c.innerText = label;

                const select = document.createElement('select');
                select.id = label;
                select.name = label;

                options!.forEach(style => {
                    const option = document.createElement('option');
                    option.value = style;
                    // const previewGraph = new Graph(option);
                    // previewGraph.setCellsEditable(false);
                    // previewGraph.setCellsSelectable(false);
                    // previewGraph.batchUpdate(() => {
                    //     previewGraph.insertEdge({
                    //         parent: previewGraph.getDefaultParent(),
                    //         style: {
                    //             endArrow: style,
                    //         },
                    //         source: previewGraph.insertVertex(previewGraph.getDefaultParent(), null, "", 0, 0, 0, 0),
                    //         target: previewGraph.insertVertex(previewGraph.getDefaultParent(), null, "", 30, 0, 0, 0),
                    //     });
                    // });
                    option.innerText = style;
                    select.appendChild(option);
                });

                select.value = value ?? 'none';

                parent.appendChild(c);
                parent.appendChild(select);

                input = select;
                break;
            case PROPERTY_TYPE.CHECKBOX:
                const d = document.createElement('label');
                d.htmlFor = label;
                d.innerText = label;

                input = document.createElement('input');
                input.type = "checkbox";
                input.checked = value;
                input.id = label;
                input.name = label;

                parent.appendChild(d);
                parent.appendChild(input);
                break;
        }

        input.style.width = width;

        this.currentParent.appendChild(parent);

        const handler = () => handleChange(input);

        input.addEventListener('input', handler);
        this.propertyDrawerCleanupFunctions.push(() => {
            input.removeEventListener('input', handler);
        });
    }

    /**
     * Resets all the properties in the drawer.
     */
    private resetProperties() {
        this.propertyDrawerCleanupFunctions.forEach(clean => clean());
        Array.from(PropertiesHandler.PROPERTY_ELEMENT.children).forEach(child => child.remove());
        PropertiesHandler.PROPERTY_ELEMENT.parentElement.classList.add('hidden');
    }

    onDestroy() {
        this.graph.removeListener(this.handleSelectEvent);
        this.graph.removeListener(this.closeOnDBLClick);
    }

}