import { ServerERRespresentation } from "./serialization";

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

export default function grade(
  assignment: ServerERRespresentation,
  template: ServerERRespresentation,
  config: Configuration = defaults
): number {
  // score is knocked down each time a infraction is found
  let score =
    template.vertices.length *
    Object.values(config.weights).reduce((a, b) => a + b, 0);

    let assignmentCache = new Map<string, number>();
    let templateCache = new Map<string, number>();

    // first, find a vertex to start with
    // this can be any vertex in the template for which a match exists in the assignment
    // a match is defined as a vertex where the label is within the levenshtein distance of the assignment vertex
  
}
