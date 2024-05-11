import { Application } from "express";
import { text } from "body-parser";
import { deserializeGraph } from "../transformer/serialization";

export default function Grading(app: Application) {
    app.post('/grading', text({
        limit: '250kb'
    }), (req, res) => {
        let data = req.body;

        let split = data.split('\n');
        let assignment = split[0];
        let template = split[1];

        console.log(template)
        let r = deserializeGraph(assignment);
        console.log(r);

        res.send(r);

    })
}