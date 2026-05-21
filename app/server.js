import { createServer } from "node:http";
import { createApp } from "./src/app.js";
import { config } from "./src/config.js";

const app = await createApp();

createServer((req, res) => {
  app.handle(req, res).catch((error) => app.send(res, 500, { error: error.message }));
}).listen(config.port, config.host, () => {
  console.log(`Stable Audio 3 UI running at http://${config.host}:${config.port}`);
});
