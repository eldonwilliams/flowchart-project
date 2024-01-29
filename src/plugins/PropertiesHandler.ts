import { Cell, EventObject, Geometry, Graph, GraphPlugin, InternalEvent, SelectionCellsHandler } from "@maxgraph/core";

enum PROPERTY_TYPE {
    NUMBER,
    STRING,
    JOIN_SELECTION,
    BREAK,
}

export default class PropertiesHandler implements GraphPlugin {
    static pluginId = "PropertiesHandlerPlugin";
    static PROPERTY_ELEMENT = document.querySelector('#properties-mananger').querySelector('form');

    graph: Graph;

    propertyDrawerCleanupFunctions: Function[] = [];

    constructor(graph: Graph) {
        this.graph = graph;

        graph.addListener(InternalEvent.CLICK, this.handleSelectEvent.bind(this));
    }

    private handleSelectEvent() {
        const selectedCell = this.graph.getSelectionCell();

        if (selectedCell == null) return;

        this.resetProperties();

        const handleRemoval = (_, event: EventObject) => {
            console.log("hi")
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
        const doUpdate = (fn: Function, updateEdges: boolean = false) => {
            this.graph.batchUpdate(() => {
                fn();
            });
            this.graph.refresh(vertex);
            if (updateEdges) {
                this.graph.getEdges(vertex).forEach(edge => {
                    this.graph.refresh(edge);
                });
            }
        }

        const handleLabelChange = (input: HTMLInputElement) => doUpdate(() => {
            vertex.setValue(input.value);
        });

        const handleGeometryChange = (geometry: keyof Geometry, input: HTMLInputElement) => doUpdate(() => {
            // @ts-ignore shutup
            vertex.geometry[geometry] = Number(input.value);
        }, true);

        this.addProperty("Label", vertex.value, PROPERTY_TYPE.STRING, handleLabelChange);
        this.addProperty("X", vertex.geometry.x, PROPERTY_TYPE.NUMBER, handleGeometryChange.bind(this, 'x'));
        this.addProperty("Y", vertex.geometry.y, PROPERTY_TYPE.NUMBER, handleGeometryChange.bind(this, 'y'));
        this.addProperty("Width", vertex.geometry.width, PROPERTY_TYPE.NUMBER, handleGeometryChange.bind(this, 'width'));
        this.addProperty("Height", vertex.geometry.height, PROPERTY_TYPE.NUMBER, handleGeometryChange.bind(this, 'height'));
    }

    private handleClickOnEdge(edge: Cell) {
        const handleLabelChange = (input: HTMLInputElement) => {
            this.graph.batchUpdate(() => {
                edge.setValue(input.value);
            });
            this.graph.refresh(edge);
        }

        this.addProperty("Label", edge.value, PROPERTY_TYPE.STRING, handleLabelChange);
    }

    /**
     * Starts a horizontal group in the drawer
     * @param name 
     */
    private startGroup(name: string = "") {
        
    }

    /**
     * Adds a property to the drawer
     */
    private addProperty(name: string, value: any, type: PROPERTY_TYPE, handleChange: Function) {
        let input: HTMLInputElement;

        switch (type) {
            case PROPERTY_TYPE.BREAK:
                const br = document.createElement('br');
                PropertiesHandler.PROPERTY_ELEMENT.appendChild(br);
                return;
            case PROPERTY_TYPE.NUMBER:
                const a = document.createElement('label');
                a.htmlFor = name;
                a.innerText = name;

                input = document.createElement('input');
                input.type = "number";
                input.value = value;
                input.id = name;
                input.name = name;

                PropertiesHandler.PROPERTY_ELEMENT.appendChild(a);
                PropertiesHandler.PROPERTY_ELEMENT.appendChild(input);
                break;
            case PROPERTY_TYPE.STRING:
                const b = document.createElement('label');
                b.htmlFor = name;
                b.innerText = name;

                input = document.createElement('input');
                input.type = "text";
                input.value = value;
                input.id = name;
                input.name = name;

                PropertiesHandler.PROPERTY_ELEMENT.appendChild(b);
                PropertiesHandler.PROPERTY_ELEMENT.appendChild(input);
                break;
            case PROPERTY_TYPE.JOIN_SELECTION:
                // Implement later
                return;
        }

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
    }

    onDestroy() {
        this.graph.removeListener(this.handleSelectEvent);
    }

}