import http from "http";
import { config } from "@kunai/common";
import { homeController } from "./src/home/homeController";
import { errorController } from "./src/error/errorController";

const server = http.createServer((req, res) => {
  const { url } = req;

  const controller =
    {
      "/": homeController,
    }[url || "/"] || errorController;

  controller(req, res);
});

const PORT = process.env.PORT || config.SERVER_PORT;

server.listen(PORT, () => {
  console.log(`${config.APP_NAME}: Server running at http://localhost:${PORT}`);
});
