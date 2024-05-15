import { Application } from "express";
import { text } from "body-parser";
import { deserializeGraph } from "../transformer/serialization";
import grade from "../transformer/grade";

export default function Grading(app: Application) {
    app.post('/grading', text({
        limit: '250kb'
    }), (req, res) => {
        let data = req.body;

        let split = data.split('\n');
        let assignment = deserializeGraph(split[0]);
        let template = deserializeGraph(split[1]);

        let score = grade(assignment, template);

        res.send(score.toString());

    })
}