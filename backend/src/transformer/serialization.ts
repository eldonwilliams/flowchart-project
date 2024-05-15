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
  edges: number[];
};

export type ServerEdgeRepresentation = {
  cardinality: string;
  double: boolean;
  updated: number;
  created: number;
  source: number;
  target: number;
};

export type ServerERRespresentation = {
  vertices: ServerVertexRepresentation[];
  edges: ServerEdgeRepresentation[];
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
  edges: [],
};

const defaultEdge: ServerEdgeRepresentation = {
  cardinality: "NULL",
  double: false,
  updated: -1,
  created: -1,
  source: -1,
  target: -1,
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
  verts: ServerVertexRepresentation[],
  cache: Map<string, number> | undefined = undefined
): ServerEdgeRepresentation {
  let { source, target, value } = JSON.parse(data);
  let sourceIndex = findIndexById(source, verts, cache);
  let targetIndex = findIndexById(target, verts, cache);

  let edge = {
    ...defaultEdge,
    ...value,
    source: sourceIndex,
    target: targetIndex,
  };

  return edge;
}

export function deserializeGraph(data: string): ServerERRespresentation {
  let parsed = JSON.parse(data);
  let vertices: ServerVertexRepresentation[] = [];
  JSON.parse(parsed.root).children.forEach((v: string) =>
    deserializeVertex(v, vertices)
  );
  let cache = new Map<string, number>(); // use a memo for index to id lookups
  let edges: ServerEdgeRepresentation[] = parsed.edges.map((e: string) =>
    deserializeEdge(e, vertices, cache)
  );
  vertices = vertices.map((v, i) => ({
    ...v,
    edges: edges
      .map((e, i) => ({ ...e, idx: i, }))
      .filter(e => e.source === i || e.target === i)
      .map((e) => e.idx),
  }))
  return { vertices, edges };
}
