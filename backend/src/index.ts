import express from "express";
import cors from "cors";
import { readdir, readFile } from "fs";
import { join } from "path";
import { json } from "body-parser";

const app = express();

app.use(json())
app.use(cors());

readdir(join(__dirname, "./routes"), { recursive: true, withFileTypes: true, }, (err, files) => {
    if (err) console.log(err);

    console.log(`found ${files.length} routes to load`)
    files.forEach((direntry) => {
        try {
            const file = join(__dirname, "./routes", direntry.path ?? "", direntry.name);
            console.log(`loading route ${direntry.name} (@${file})`);
            const handler = require(file).default;
            if (typeof handler == "function") handler(app);
            console.log(`success`);
        } catch (err) {
            console.error(`Error occurred whilst loading route ${direntry.name}`);
        }
    });
});

app.listen(process.env.BACKEND_PORT ?? 8797, () => {
    console.log(`Server is running on port ${process.env.BACKEND_PORT ?? 8797}`);
});