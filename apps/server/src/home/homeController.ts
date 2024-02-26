import fs from "fs";
import path, { dirname } from "path";
import { createController } from "../common/utils";
import { fileURLToPath } from "url";

export const homeController = createController(({ sendHtml }) => {
  const filePath = fileURLToPath(import.meta.url);

  const templatePath = path.join(dirname(filePath), "homeTemplate.html");

  sendHtml({
    templatePromise: fs.promises.readFile(templatePath, { encoding: "utf-8" }),
    templateData: { title: "Hello World" },
  });
});
