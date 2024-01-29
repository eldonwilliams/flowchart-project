import { Cell, EventObject, Graph, GraphPlugin, InternalEvent, SelectionCellsHandler } from "@maxgraph/core";

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

        if (selectedCell.vertex) {
            this.handleClickOnVertex(selectedCell);
        }
    }

    private handleClickOnVertex(vertex: Cell) {
        this.resetProperties();

        this.graph.addListener(InternalEvent.CELLS_REMOVED, (_, event: EventObject) => {
            event.getProperty("cells").forEach((cell: Cell) => {
                if (cell == vertex) {
                    this.resetProperties();
                }
            });
        });

        this.addProperty("Label", vertex.value, PROPERTY_TYPE.STRING, ((event) => {
            this.graph.batchUpdate(() => {
                vertex.setValue(event.value);
            });
            this.graph.refresh(vertex);
        }).bind(this));
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