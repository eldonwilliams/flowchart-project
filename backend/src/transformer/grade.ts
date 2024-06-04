import { deserializeGraph, ServerEdgeRepresentation, ServerERRespresentation, ServerVertexRepresentation } from "./serialization";
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
  multivalue: Weight;
}

export interface Configuration {
  weights: Weights;
  labelingDistance: number;
}

const defaultWeights: Weights = {
  cardinality: 0.2,
  labeling: 0.1,
  shape: 0.3,
  connection: 0.5,
  multivalue: 0.1,
};

export const defaultConfig: Configuration = {
  labelingDistance: 4,
  weights: defaultWeights,
};

const defaults: Configuration = defaultConfig;

function findHomologOfVertex(templateVertex: ServerVertexRepresentation, assignment: ServerERRespresentation): number {
  return assignment.vertices.findIndex((v) => v.label === templateVertex.label);
}

function propogatedGrading(
  templateVertex: ServerVertexRepresentation,
  assignmentVertex: ServerVertexRepresentation,
  assignment: ServerERRespresentation,
  template: ServerERRespresentation,
  verticiesHit: Set<ServerVertexRepresentation>,
  edgesHit: Set<ServerEdgeRepresentation>,
  runningScore: number,
  weighting: Weights): number {
  if (verticiesHit.has(templateVertex)) {
    return runningScore; // hit a loop, deadend
    // probably malformed
  }

  verticiesHit.add(templateVertex);

  // grade the differences between the verticies
  if (templateVertex.edges.length > assignmentVertex.edges.length) {
    // This means some edges are missing, while they may just be misplaced, we will deduct points for this

  }

  // find all the edges which have these two templates
  return runningScore;
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

  let rootIndex = 0;
  while (rootIndex < template.vertices.length && findHomologOfVertex(template.vertices[rootIndex], assignment) === -1) {
    rootIndex++;
  }



  return score / maxScore;
}
