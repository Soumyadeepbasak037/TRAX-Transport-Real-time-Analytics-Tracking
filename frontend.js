import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

https
  .createServer(options, (req, res) => {
    let filePath = path.join(
      __dirname,
      req.url === "/" ? "driverfrontend.html" : req.url
    );

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not Found");
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  })
  .listen(7789, () => {
    console.log("HTTPS server running at https://localhost:7789");
  });
