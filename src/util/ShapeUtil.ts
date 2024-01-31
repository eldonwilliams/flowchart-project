import { Shape } from "@maxgraph/core";

export function getDisplayName(shape: typeof Shape): string {
    //@ts-ignore it might
    if (shape.shapeKey) {
        //@ts-ignore
        return shape.friendlyName ?? shape.shapeKey;
    }
    return "";
}