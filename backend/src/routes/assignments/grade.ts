import { Application } from "express";

export default function Grade(app: Application) {

    app.post('/assignments/grade', (req, res) => {
        if (!(req.body["assignment"]) || !(req.body["template"]) || Object.keys(req.body).length != 2) {
            res.status(400).send("Bad Request");
            return;
        }

        let response: any = {};

        if (req.body.assignment instanceof Array) {
            req.body.assignment.forEach((v: any) => {
                response[v.id] = Math.random().toFixed(3);
            })
        } else {
            response = {
                [req.body.assignment.id]: Math.random().toFixed(3)
            }
        }

        res.status(200).send(response);
    });
}