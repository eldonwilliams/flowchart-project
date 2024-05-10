import { Application } from "express";

export default function Health(app: Application) {
    app.get('/health', (req, res) => {
        res.status(200).send(process.env.PROD?.toLowerCase() == "true" ? "OK FROM PROD!" : "OK FROM DEV!");
    });
}