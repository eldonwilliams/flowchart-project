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

        if (template === undefined || assignment === undefined) {
            res.send("Malformed Input");
            return;
        }

        let score = grade(assignment, template);

        res.send(score.toString());

    })

    app.post('/grading/serialize', text({ limit: '250kb', }), (req, res) => {
        let data = req.body;

        let split = data.split('\n');
        let assignment = deserializeGraph(split[0]);
        let template = deserializeGraph(split[1]);

        res.send({ assignment, template });
    })
}