import { ServerERRespresentation, ServerVertexRepresentation } from "./serialization";
import { isMatch, isSimilar } from "./util";

/**
 * Weight of grading metric
 * [0, 1]
 */
type Weight = number;

function isWeight(w: number): w is Weight {
  return w >= 0 && w <= 1;
}

interface Weights {
  cardinality: Weight;
  labeling: Weight;
  shape: Weight;
  connection: Weight;
}

export interface Configuration {
  weights: Weights;
  labelingDistance: number;
}

const defaultWeights: Weights = {
  cardinality: 0.2,
  labeling: 0.1,
  shape: 0.75,
  connection: 0.5,
};

export const defaultConfig: Configuration = {
  labelingDistance: 4,
  weights: defaultWeights,
};

const defaults: Configuration = defaultConfig;

function gradeVertex(
  assignmentVertex: ServerVertexRepresentation,
  assignment: ServerERRespresentation,
  template: ServerERRespresentation,
  config: Configuration,
  score: number
): number {
  // TODO: Improve finding the vertex in the template
  let templateVertex = template.vertices.find((v) =>
    isSimilar(assignmentVertex, v, config)
  );

  if (!templateVertex) {
    score -= config.weights.labeling;
    score -= config.weights.shape;
    score -= config.weights.connection;
    return score;
  }

  if (!isSimilar(assignmentVertex, templateVertex, config)) {
    score -= config.weights.labeling;
  }

  if (assignmentVertex.shape != templateVertex.shape) {
    score -= config.weights.shape;
  }

  assignmentVertex.edges.forEach((edge) => {
    let assignmentEdge = assignmentVertex.edges[edge];

    // find the edge in the template
    let templateEdge = templateVertex.edges.find((e) => {
      let templateEdge = template.edges[e];
      let source = template.vertices[templateEdge.source];
      let target = template.vertices[templateEdge.target];
      return (
        isSimilar(source, assignmentVertex, config) || isSimilar(target, assignmentVertex, config)
      );
    });

    if (templateEdge === undefined) {
      score -= config.weights.connection / assignmentVertex.edges.length;
      return;
    }

    if (assignment.edges[assignmentEdge].cardinality != template.edges[templateEdge].cardinality) {
      score -= config.weights.cardinality / assignmentVertex.edges.length;
    }

    if (assignment.edges[assignmentEdge].double != template.edges[templateEdge].double) {
      score -= config.weights.cardinality / assignmentVertex.edges.length;
    }
  });

  return score;
}

export default function grade(
  assignment: ServerERRespresentation,
  template: ServerERRespresentation,
  config: Configuration = defaults
): number {
  // score is knocked down each time a infraction is found
  let maxScore =
    template.vertices.length *
    Object.values(config.weights).reduce((a, b) => a + b, 0);
  let score = maxScore;

  let rootIndex: number = -1;
  // find the root vertex in the template by matching the first vertex in the assignment with similar features to the root

  for (let i = 0; i < assignment.vertices.length; i++) {
    if (rootIndex != -1) break;
    for (let j = 0; j < template.vertices.length; j++) {
      if (isSimilar(assignment.vertices[i], template.vertices[j], config)) {
        rootIndex = i;
        break;
      }
    }
  }

  if (rootIndex == -1) {
    // no root found, lose all points regarding verticies
    // TODO: try to match connections

    return 0;
  }

  assignment.vertices.forEach((v, i) => {
    score = gradeVertex(v, assignment, template, config, score);
  });

  return score / maxScore;
}
