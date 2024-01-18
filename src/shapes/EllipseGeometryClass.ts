import { ConnectionConstraint, Geometry, Point } from "@maxgraph/core";

export default class EllipseGeometryClass extends Geometry {
    constraints = [
        new ConnectionConstraint(new Point(0.5, 0), true),
        new ConnectionConstraint(new Point(0.5, 1), true),
        new ConnectionConstraint(new Point(0, 0.5), true),
        new ConnectionConstraint(new Point(1, 0.5), true),
    ]
}