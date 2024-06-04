import { Attribute, Entity, Graph, Relationship, } from "./serialization";

// correct_entity_name = 0.2  # Default Weighting = 0.2
// correct_attributes = 0.1  # Default Weighting = 0.1
// correct_primary_keys = 0.2  # Default Weighting = 0.2
// extra_entities = 0.25  # Default Weighting = 0.25
// correct_weak_entities = 0.5  # Default Weighting = 0.5
// correct_relationship_entities = 0.5  # Default Weighting = 0.5
// correct_cardinality = 0.25  # Default Weighting = 0.25
// extra_relationship = 0.25  # Default Weighting = 0.25
// #  correct_cardinality_text = 0.25  # Default Weighting = 0.25
// MAXIMUM_GRADE = 10

type Weight = number;

function isWeight(a: any): a is Weight {
    return typeof a === "number" && a > 0 && a < 1;
}

export interface GradeWeights {
    EntityName: Weight;
    AttributesCorrect: Weight;
    PrimaryKeys: Weight;
    ExtraEntities: Weight;
    WeakEntities: Weight;
    RelationshipEntities: Weight;
    ExtraRelationshipConnections: Weight;
    ExtraRelationships: Weight;
    ExtraAttributes: Weight;
}

const defaultWeights: GradeWeights = {
    EntityName: 0.2,
    AttributesCorrect: 0.1,
    PrimaryKeys: 0.2,
    ExtraEntities: 0.25,
    WeakEntities: 0.0, // 0.5,
    RelationshipEntities: 0.5,
    ExtraRelationshipConnections: 0.25,
    ExtraRelationships: 0.25,
    ExtraAttributes: 0.1
}

/**
 * Calculates the maximum grade of a given template, returns a number 
 * @param template 
 */
function calculateMaxGrade(template: Graph, weighting: GradeWeights = defaultWeights): number {
    let total = 0;

    template.entities.forEach(v => {
        total += weighting.EntityName +
            weighting.AttributesCorrect * v.attributes.length +
            weighting.PrimaryKeys * v.attributes.filter(a => a.key).length +
            (v.weak ? weighting.WeakEntities : 0)
    })

    template.relationships.forEach(v => {
        total += weighting.RelationshipEntities +
            weighting.AttributesCorrect * v.attributes.length
    })

    return total;
}

/**
 * Compare two arrays of attributes
 * 
 * @param submission 
 * @param template 
 * @param weighting 
 * @returns 
 */
function compareAttributes(submission: Attribute[], template: Attribute[], isRelation: boolean = false, weighting: GradeWeights = defaultWeights): number {
    let marks = 0;
    let lengthAdjust = 0;

    template.forEach(templateAttribute => {
        // TODO: Change to be more inline with how other things are calculate (take highest marks)
        // Run through all attributes and see which works best
        let submissionAttribute = submission.find(a => a.label === templateAttribute.label);
        if (submissionAttribute === undefined) {
            lengthAdjust++;
            // marks -= weighting.AttributesCorrect; // You lose out on points for missing a attribute
            // not a penalty
            // console.log(`SUB b/c couldn't find attribute`)
            return;
        }
        submission = submission.filter(v => v.label !== templateAttribute.label); // remove it

        if (submissionAttribute.composite === templateAttribute.composite && submissionAttribute.multivalue === templateAttribute.multivalue) {
            marks += weighting.AttributesCorrect;
            console.log(`ADD b/c attribute correct`)
        }

        if (templateAttribute.key && submissionAttribute.key === templateAttribute.key && !isRelation) {
            marks += weighting.PrimaryKeys;
            console.log(`ADD b/c primary keys`)
        }
    });

    marks -= weighting.ExtraAttributes * (submission.length - lengthAdjust);
    console.log(`SUB b/c extra attrbitues`)

    return marks;
}

/**
 * Compares two entities and returns a score
 * 
 * @param submission 
 * @param template 
 * @param weighting 
 */
function compareEntities(submission: Entity, template: Entity, weighting: GradeWeights = defaultWeights): number {
    let marks = compareAttributes(submission.attributes, template.attributes, false, weighting);

    if (submission.label === template.label) {
        marks += weighting.EntityName;
    }

    if (submission.weak === template.weak) {
        marks += weighting.WeakEntities; // I think I am using this wrong
        // I don't really understand what this does from the AutoER implementation
        // I think it comes to a difference in how we are doing things, may need to be removed
    }

    return marks;
}

/**
 * Compares two relationships and returns a score
 * 
 * @param submissionCopy 
 * @param template 
 * @param weighting 
 */
function compareRelationship(submission: Relationship, template: Relationship, submissionEntities: Entity[], templateEntities: Entity[], weighting: GradeWeights = defaultWeights): number {
    let marks = compareAttributes(submission.attributes, template.attributes, true, weighting);

    let submissionCopy = { ...submission, attributes: [...submission.attributes], connects: [...submission.connects] } satisfies Relationship

    template.connects.forEach(templateIndex => {
        let templateEntity = templateEntities[templateIndex];
        let [_, submissionIndex] = submissionCopy.connects.reduce((pv, submissionIndex) => {
            if (compareEntities(submissionEntities[submissionIndex], templateEntity, weighting) > pv[0]) {
                return [compareEntities(submissionEntities[submissionIndex], templateEntity, weighting), submissionIndex];
            }
            return pv;
        }, [-Infinity, -1])
        submissionCopy.connects = submissionCopy.connects.filter(i => i !== submissionIndex);
        let submissionEntity = submissionEntities[submissionIndex];
        if (templateEntity.label === submissionEntity.label && templateEntity.weak === submissionEntity.weak) {
            marks += weighting.RelationshipEntities / template.connects.length;
            console.log(`ADD for RelationshipEntities`)
        }
    });
    marks -= submissionCopy.connects.length * weighting.ExtraRelationshipConnections
    if (submissionCopy.connects.length > 0)
        console.log(`SUB ${weighting.ExtraRelationshipConnections * submissionCopy.connects.length} for ExtraRelationshipConnections`)
    return marks;
}

/**
 * 
 * Grades a submission with a given template. It is assumed both have already beeen deserialized.
 * Returns a destructurable array where element 0 is the grade [0-1] and a string of comments.
 * 
 * @param submission 
 * @param template 
 * @returns 
 */
export function grade(submission: Graph, template: Graph, weighting: GradeWeights = defaultWeights): [number, string] {
    let maxScore = calculateMaxGrade(template, weighting);
    let studentScore = 0;

    // TODO: make these remove used template entities and relationship object
    // e.g. if one is found to have highest marks, it should be removed from pool of possible answers
    // bc the submission cannot have a reponse which maps to two answers
    let submissionEntitiesCopy = [...submission.entities]
    for (let i = 0; template.entities.length > i; i++) {
        let topmarkIndex = -1;
        let topmark = -Infinity;
        for (let j = 0; submissionEntitiesCopy.length > j; j++) {
            let marks = compareEntities(submissionEntitiesCopy[j], template.entities[i], weighting);
            if (marks > topmark) {
                topmark = marks;
                topmarkIndex = j;
            }
        }
        submissionEntitiesCopy = submissionEntitiesCopy.filter((_, i) => i !== topmarkIndex);
        studentScore += topmark;
    }


    for (let i = 0; template.relationships.length > i; i++) {
        let topmarkIndex = -1;
        let topmark = -Infinity;
        for (let j = 0; submission.relationships.length > j; j++) {
            let marks = compareRelationship(submission.relationships[j], template.relationships[i], submission.entities, template.entities, weighting);
            if (marks > topmark) {
                topmark = marks;
                topmarkIndex = j;
            }
        }
        submission.relationships = submission.relationships.filter((_, i) => i !== topmarkIndex);
        studentScore += topmark;
    }

    return [studentScore / maxScore, ""];
}