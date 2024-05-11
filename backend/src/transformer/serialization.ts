import Array2D from "./2darray";
import { findIndexById } from "./util";

export type ServerVertexRepresentation = {
  id: string;
  label: string;
  dashed: boolean;
  underlined: boolean;
  double: boolean;
  updated: number;
  created: number;
  shape: string;
};

export type ServerEdgeRepresentation = {
  cardinality: string;
  double: boolean;
  updated: number;
  created: number;
};

export type ServerERRespresentation = {
  vertices: ServerVertexRepresentation[];
  /***
   * 2D adjacency matrix of edges
  //  * source->target
   * a-b this is a doubly linked edge
   */
  edges: Array2D<ServerEdgeRepresentation>;
};

const defaultVertex: ServerVertexRepresentation = {
  id: "NULL",
  label: "NULL",
  dashed: false,
  underlined: false,
  double: false,
  updated: -1,
  created: -1,
  shape: "NULL",
};

const defaultEdge: ServerEdgeRepresentation = {
  cardinality: "NULL",
  double: false,
  updated: -1,
  created: -1,
};

// use the accumulator pattern because verticies on the frontend
// use a children property, but we don't want to use that on the backend
export function deserializeVertex(
  data: string,
  accum: ServerVertexRepresentation[] = []
): ServerVertexRepresentation {
  let { cellId, value, children } = JSON.parse(data);

  let vertex = { ...defaultVertex, ...value, id: cellId }; // gotta love the spread operator

  if (children) {
    children.forEach((child: string) => deserializeVertex(child, accum));
  }

  accum.push(vertex);
  return vertex;
}

export function deserializeEdge(
  data: string,
  arr: Array2D<ServerEdgeRepresentation>,
  verts: ServerVertexRepresentation[],
  cache: Map<string, number> | undefined = undefined
): ServerEdgeRepresentation {
  let { source, target, value } = JSON.parse(data);
  let sourceIndex = findIndexById(source, verts, cache);
  let targetIndex = findIndexById(target, verts, cache);

  let edge = { ...defaultEdge, ...value };

  arr.set(sourceIndex, targetIndex, edge);
  arr.set(targetIndex, sourceIndex, edge); // doubly linked edge

  return edge;
}

export function deserializeGraph(data: string): ServerERRespresentation {
  let parsed = JSON.parse(data);
  let vertices: ServerVertexRepresentation[] = [];
  JSON.parse(parsed.root).children.forEach((v: string) =>
    deserializeVertex(v, vertices)
  );
  let edges = new Array2D<ServerEdgeRepresentation>(0, 0, undefined);
  let cache = new Map<string, number>(); // use a memo for index to id lookups
  JSON.parse(parsed.edges).forEach((e: string) =>
    deserializeEdge(e, edges, vertices, cache)
  );
  return { vertices, edges };
}
