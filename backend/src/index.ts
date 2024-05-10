import cors from "cors";
import express from "express";
import { readdir } from "fs";
import { join } from "path";

const app = express();

app.use(cors());

readdir(join(__dirname, "./routes"), (err, files) => {
  if (err) {
    console.error("Couldn't load file routes.");
    console.error(err.message);
  }

  files.forEach((file) => {
    try {
      require(join(__dirname, "./routes", file)).default(app);
    } catch (_) {
      console.error(`Couldn't load '${file}' handler`);
    }
  });
});

app.listen(process.env.BACKEND_PORT ?? 8797, () => {
  console.log(`Server is running on port ${process.env.BACKEND_PORT ?? 8797}`);
});
