import { createController } from "../common/utils";

export const errorController = createController(({ response }) => {
  response.statusCode = 404;
  response.statusMessage = "Not Found";
  response.end();
});
