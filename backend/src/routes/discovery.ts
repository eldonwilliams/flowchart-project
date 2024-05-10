import { Application } from "express";
import { readdir, readFile } from "fs";

export default function Discovery(app: Application) {
  const discoveryDirectory = process.env.DISCOVERY_DIRECTORY ?? "./examples";

  app.get("/discovery", (req, res) => {
    readdir(discoveryDirectory, (err, files) => {
      if (err) {
        res.status(500).send("An error occurred while reading the directory.");
        return;
      }
      res.status(200).json(files.filter((file) => file.endsWith(".dat")));
    });
  });

  app.get("/discovery/:file", (req, res) => {
    const file = req.params.file;
    readFile(`${discoveryDirectory}/${file}`, "utf8", (err, data) => {
      if (err) {
        res.status(500).send("An error occurred while reading the file.");
        return;
      }
      res.status(200).send(data);
    });
  });
}
