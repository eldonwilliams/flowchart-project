import { ConnectionConstraint, Geometry, Point } from "@maxgraph/core";

export default class SquareGeometryClass extends Geometry {
    constraints = [
        new ConnectionConstraint(new Point(0.25, 0), true),
        new ConnectionConstraint(new Point(0.5, 0), true),
        new ConnectionConstraint(new Point(0.75, 0), true),
        new ConnectionConstraint(new Point(0, 0.25), true),
        new ConnectionConstraint(new Point(0, 0.5), true),
        new ConnectionConstraint(new Point(0, 0.75), true),
        new ConnectionConstraint(new Point(1, 0.25), true),
        new ConnectionConstraint(new Point(1, 0.5), true),
        new ConnectionConstraint(new Point(1, 0.75), true),
        new ConnectionConstraint(new Point(0.25, 1), true),
        new ConnectionConstraint(new Point(0.5, 1), true),
        new ConnectionConstraint(new Point(0.75, 1), true),
      ];
}