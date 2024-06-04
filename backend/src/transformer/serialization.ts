import { findIndexById } from "./util";

type ServerGenericVertexRepresentation = {
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

type ServerEntityVertexRepresentation = ServerGenericVertexRepresentation & {
  shape: "Entity" | "Relation";
  attributes: ServerGenericVertexRepresentation[];
};

/**
 * Verticies can either be Generic or Entity. This distinction is made because entities have all their attributes
 * encoded in the attributes key. If the shape != "Entity" then attributes will be undefined.
 */
export type ServerVertexRepresentation = ServerGenericVertexRepresentation | ServerEntityVertexRepresentation;

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
): void {
  let { cellId, value, children } = JSON.parse(data);

  let vertex = { ...defaultVertex, ...value, id: cellId }; // gotta love the spread operator

  if (children && children.length > 0) {
    children.forEach((child: string) => deserializeVertex(child, accum));
    return; // If there is children, we should not serialize this one. (In a well formed input this should only be the root. Children are not used)
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

function insertAttributes(edges: ServerEdgeRepresentation[], verticies: ServerVertexRepresentation[]): void {
  verticies.forEach((attributeVertex, i) => {
    if (attributeVertex.shape !== "Attribute") {
      return;
    }
    const edgesWithThisVertex = edges.filter(e => e.source == i || e.target == i);
    edgesWithThisVertex.forEach((edge) => {
      const otherVertex = verticies[edge.source === i ? edge.target : edge.source];
      if (otherVertex.shape !== "Entity" && otherVertex.shape !== "Relation") {
        return;
      }
      if ((otherVertex as ServerEntityVertexRepresentation).attributes === undefined) {
        // TODO: Find a better way to do this, multiple consecutive casts is bad practice.
        (otherVertex as ServerEntityVertexRepresentation).attributes = [];
      }
      // If the other vertex is Entity or Relation we can push this attribute into its list of attributes
      (otherVertex as ServerEntityVertexRepresentation).attributes.push(attributeVertex);
    });
  })
}

/**
 * Returns ne
 * @param edges 
 * @param verts 
 * @returns 
 */
function makeEdges(edgesData: string[], verts: ServerVertexRepresentation[]): ServerEdgeRepresentation[] {
  let cache: Map<string, number> = new Map<string, number>();
  return edgesData.map((edge) => deserializeEdge(edge, verts, cache));
}

function mapVertexToEdgeIndicies(edges: ServerEdgeRepresentation[], verts: ServerVertexRepresentation[]) {
  return verts.map((v, i) => ({
    ...v,
    edges: edges
      .map((e, i) => ({ ...e, idx: i, }))
      .filter(e => e.source === i || e.target === i)
      .map((e) => e.idx),
  }))
}

export function deserializeGraph(data: string): ServerERRespresentation | undefined {
  let parsed = JSON.parse(data);
  let vertices: ServerVertexRepresentation[] = [];
  let cache = new Map<string, number>(); // use a memo for index to id lookups
  let rootChildrenVerticies: string[] = JSON.parse(parsed.root).children;
  rootChildrenVerticies.forEach(v => deserializeVertex(v, vertices));

  let edges: ServerEdgeRepresentation[] = makeEdges(parsed.edges, vertices)
  if (rootChildrenVerticies === undefined || rootChildrenVerticies.length == 0) {
    return undefined;
  }

  
  insertAttributes(edges, vertices);
  // remove edges where either souce or target is a Attribute
  edges = edges.filter(e =>
    !(vertices[e.source].shape === "Attribute" || vertices[e.target].shape === "Attribute")
  );
  vertices = vertices.filter(v => v.shape !== "Attribute");
  edges = makeEdges(parsed.edges, vertices).filter((edge) => edge.source !== -1 && edge.target !== -1);
  vertices = mapVertexToEdgeIndicies(edges, vertices);
  // filter attribute verts

  return { vertices, edges };
}
