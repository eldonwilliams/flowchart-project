interface Attribute {
    id: string;
    multivalue: boolean;
    label: string;
    key: boolean;
    composite: boolean;
}

function isAttribute(vertex: Vertex): vertex is Attribute {
    return vertex.hasOwnProperty('composite');
}

interface Relationship {
    id: string;
    weak: boolean;
    label: string;
    attributes: Attribute[];
    connects: number[];
}

function isRelationship(vertex: Vertex): vertex is Relationship {
    return vertex.hasOwnProperty('connects');
}

interface Entity {
    id: string;
    weak: boolean;
    label: string;
    attributes: Attribute[];
}

function isEntity(vertex: Vertex): vertex is Entity {
    return !vertex.hasOwnProperty('connects') && !vertex.hasOwnProperty('composite');
}

type Edge = [number, number];

type Vertex = Entity | Relationship | Attribute;

interface Graph {
    entities: Entity[];
    relationships: Relationship[];
}

/**
 * Gets all verticies which are connected to a given vertex
 */
function getConnectedVerticies(vertex: Vertex, verticies: Vertex[], edges: Edge): Vertex[] {
    return [];
}

function populateAttributesProperty(verticies: Vertex[], edges: Edge): Vertex[] {
    return [];
}

function populateConnectsProperty(verticies: Vertex[], edges: Edge): Vertex[] {
    return [];
}

/**
 * Deserializes a vertex with the most information available
 * Some properties (attributes, connects) require a list of all verticies to populate
 * 
 */
function deserializeVertex(vertex: string): Vertex | undefined {
    let { value, cellId: id } = JSON.parse(vertex);
    let { label, dashed, underlined, double, shape } = value;

    if (shape == "Attribute") {
        return {
            composite: dashed ?? false,
            key: underlined ?? false,
            label,
            multivalue: double ?? false,
            id,
        } satisfies Attribute;
    }

    if (shape == "Entity") {
        return {
            attributes: [],
            label,
            weak: double ?? false,
            id,
        } satisfies Entity;
    }

    if (shape == "Relation") {
        return {
            label,
            attributes: [],
            connects: [],
            weak: double ?? false,
            id,
        } satisfies Relationship;
    }
}

function getEdgesBetweenSets(a: Vertex[], b: Vertex[], edges: string[]): Edge[] {
    return edges.map((e: string) => {
        const { source, target } = JSON.parse(e);

        return ([
            a.findIndex((v) => v.id === source || v.id === target),
            b.findIndex((v) => v.id === source || v.id === target),
        ]);
    }).filter((v: number[]) => v.indexOf(-1) === -1 && v.length === 2).map((v: number[]) => v as Edge);
}

function insertAttributesToSet<T>(set: T[], attributes: Attribute[], edges: Edge[]): T[] {
    return set.map((v, i) => ({
        ...v,
        attributes: attributes.filter((_, j) => edges.findIndex((edge) => edge[0] === i && edge[1] === j) != -1),
    }));
}

export function deserializeGraph(data: string): Graph {
    let { root, edges } = JSON.parse(data);

    let verticies = JSON.parse(root).children;
    verticies = verticies.map(deserializeVertex)

    let attributes: Attribute[] = verticies.filter(isAttribute);
    let entities: Entity[] = verticies.filter(isEntity);
    let relationships: Relationship[] = verticies.filter(isRelationship);

    /**
     * Array of edges of entity->relationship connections.
     */
    let entityRelationshipEdges: Edge[] = getEdgesBetweenSets(entities, relationships, edges);

    relationships = relationships.map((r, i) => ({
        ...r,
        connects: entityRelationshipEdges
            .filter(e => e[1] === i)
            .map(edge => edge[0])
    }));

    let entitiesToAttributeEdges: Edge[] = getEdgesBetweenSets(entities, attributes, edges);
    let relationshipToAttributeEdges: Edge[] = getEdgesBetweenSets(relationships, attributes, edges);
    entities = insertAttributesToSet(entities, attributes, entitiesToAttributeEdges);
    relationships = insertAttributesToSet(relationships, attributes, relationshipToAttributeEdges);

    return {
        entities,
        relationships
    }
}