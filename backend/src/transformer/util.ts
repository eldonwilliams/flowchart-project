import { Configuration, defaultConfig } from "./grade";
import { ServerVertexRepresentation } from "./serialization";

export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  if (a === b) return 0;
  if (a[0] === b[0]) return levenshteinDistance(a.slice(1), b.slice(1));
  return (
    1 +
    Math.min(
      levenshteinDistance(a, b.slice(1)),
      levenshteinDistance(a.slice(1), b),
      levenshteinDistance(a.slice(1), b.slice(1))
    )
  );
}

// checks if a and b are similar, but currently has the same implementation as isMatch (exact)
export function isSimilar(a: ServerVertexRepresentation, b: ServerVertexRepresentation, config: Configuration = defaultConfig): boolean {
  return levenshteinDistance(a.label, b.label) <= config.labelingDistance;
}

export function findIndexById(
  id: string,
  vertices: ServerVertexRepresentation[],
  cache: Map<string, number> | undefined = undefined
): number {
  if (cache != undefined && cache.has(id)) {
    return cache.get(id) as number;
  }
  for (let i = 0; i < vertices.length; i++) {
    if (vertices[i].id === id) {
      return i;
    }
  }
  return -1;
}

export function isMatch(
  a: ServerVertexRepresentation,
  b: ServerVertexRepresentation,
  config: Configuration = defaultConfig
): boolean {
  return a.label === b.label;
}
