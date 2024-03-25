import { CellState, Geometry, Shape } from "@maxgraph/core";

/**
 * an abstract class which lays out all the properties custom shapes must have for different systems
 * to work properly
 */
export default abstract class CustomShapeInterface {

    /**
     * The internal id of the shape
     */
    public static shapeKey: string;

    public static isDouble: boolean = false;

    public static isSingle: boolean = true;

    public static toDouble: string = null;

    public static toSingle: string = null;

    /**
     * The name to be used for this shape when user facing
     */
    public static friendlyName: string | null;

    /**
     * The default cell state for the shape,
     * 
     * import values are x, y, width, height, as they affect preview rendering.
     * They will also be used as the default value when placed.
     */
    public static defaultCellState: Partial<CellState>;

    /**
     * The geometryClass to be used when the element is inserted
     */
    public static geometryClass: typeof Geometry;

    /**
     * Gets the name to be used when displaying what this shape is
     */
    public static get displayName(): string {
        return this.friendlyName ?? this.shapeKey;
    }
}