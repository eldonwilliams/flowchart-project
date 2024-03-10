/**
 * This file is used to serialize and deserialize objects
 */

import { Cell, Graph, } from "@maxgraph/core";
import { getCellValueRoot } from "./CellUtil";
import { setupCellForShape } from "./ShapeUtil";
import CustomGraph from "../CustomGraph";

/**
 * Serialize a vertex to a string
 */
export function serializeVertex(cell: Cell): string {
    return JSON.stringify({
        cellId: cell.id,
        style: cell.style,
        value: getCellValueRoot(cell),
        parent: cell.parent?.id,
        geometry: {
            x: cell.geometry?.x,
            y: cell.geometry?.y,
            width: cell.geometry?.width,
            height: cell.geometry?.height,
        },
        children: cell.children.filter((cell) => cell.isVertex()).map(serializeVertex), // a little bit of recursion :)
    });
}

/**
 * Serialize an edge to a string
 */
export function serializeEdge(edge: Cell): string {
    return JSON.stringify({
        cellId: edge.id,
        style: edge.style,
        value: getCellValueRoot(edge),
        parent: edge.parent?.id,
        source: edge.source?.id,
        target: edge.target?.id,
    });
}

/**
 * Serialize a graph to a string
 */
export function serializeGraph(graph: CustomGraph): string {
    return JSON.stringify({
        root: serializeVertex(graph.getDefaultParent()),
        edges: graph.getChildCells(graph.getDefaultParent()).filter((cell) => cell.isEdge()).map(serializeEdge),
        logs: graph.logs.map(log => JSON.stringify(log))
    });
}

/**
 * Deserialize a cell from a string
 */
export function deserializeVertex(graph: Graph, serializedCell: string): Cell {
    const cellData = JSON.parse(serializedCell);
    const cell = graph.insertVertex({
        id: cellData.cellId,
        parent: graph.getDataModel().getCell(cellData.parent) ?? graph.getDefaultParent(),
        style: cellData.style,
        value: cellData.value,
        x: cellData.geometry.x,
        y: cellData.geometry.y,
        width: cellData.geometry.width,
        height: cellData.geometry.height,
    });
    if (cellData.style.shape)
        setupCellForShape(cell, graph.getCellRenderer().getShape(cellData.style.shape));
    cellData.children.forEach(deserializeVertex.bind(null, graph));
    return cell;
}

/**
 * Deserialize an edge from a string
 */
export function deserializeEdge(graph: Graph, serializedEdge: string): Cell {
    const edgeData = JSON.parse(serializedEdge);
    const edge = graph.insertEdge({
        id: edgeData.cellId,
        source: graph.getDataModel().getCell(edgeData.source),
        target: graph.getDataModel().getCell(edgeData.target),
        parent: graph.getDataModel().getCell(edgeData.parent) ?? graph.getDefaultParent(),
        style: edgeData.style,
        value: edgeData.value,
    });
    return edge;
}

/**
 * Deserialize a graph from a string
 */
export function deserializeGraph(graph: CustomGraph, serializedGraph: string, clearGraph: boolean = true) {
    if (clearGraph) {
        graph.removeCells(graph.getChildCells(graph.getDefaultParent()));
    }
    const graphData = JSON.parse(serializedGraph);
    deserializeVertex(graph, graphData.root);
    graphData.edges.forEach(deserializeEdge.bind(null, graph));
    graph.logs = []; // clear any old logs
    graphData.logs.forEach((log: string) => {
        graph.logs.push(JSON.parse(log));
    });
}