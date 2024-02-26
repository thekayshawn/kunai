import { IncomingMessage, ServerResponse } from "http";
import handlebars from "handlebars";
import urlParser from "url";

export type RequestMethod = "get" | "post" | "put" | "delete" | "patch";

/**
 * A request controller.
 * @param request
 * @param response
 */
function controller(request: IncomingMessage, response: ServerResponse) {
  const method = request.method as RequestMethod;
  const url = urlParser.parse(request.url!, true);

  const accept = request.headers.accept || "application/json";
  const contentType = request.headers["content-type"] || "application/json";

  function sendJson({ data, message }: { data?: object; message?: string }) {
    response.statusCode = 200;
    response.statusMessage = message || "Success";
    response.setHeader("Content-Type", "application/json");
    response.end(data ? JSON.stringify(data) : null);
  }

  async function sendHtml({
    message,
    templateData,
    templatePromise,
  }: {
    message?: string;
    templateData?: object;
    templatePromise: Promise<string>;
  }) {
    response.statusCode = 200;
    response.statusMessage = message || "Success";
    response.setHeader("Content-Type", "text/html");

    // Get the template
    const template = await templatePromise;

    // Compile it
    const renderer = handlebars.compile(template);

    // Render the template with the provided data
    const html = renderer(templateData);

    response.end(html);
  }

  return {
    request,
    response,
    url,
    method,
    sendJson,
    sendHtml,
    isHtml: contentType.includes("text/html"),
    isJson: contentType.includes("application/json"),
    isPlain: contentType.includes("text/plain"),
    isFormData: contentType.includes("application/x-www-form-urlencoded"),
    isMultipart: contentType.includes("multipart/form-data"),
    isRequestingHtml: accept.includes("text/html"),
    isRequestingJson: accept.includes("application/json"),
    isRequestingPlain: accept.includes("text/plain"),
    isRequestingFormData: accept.includes("application/x-www-form-urlencoded"),
    isRequestingMultipart: accept.includes("multipart/form-data"),
  };
}

export type ControllerProps = ReturnType<typeof controller>;

export type RequestHandler = (props: ControllerProps) => void;

/**
 * Factory method to create a request controller.
 * @param handler The method to inject controller props with.
 * @returns The handler, injected with {@link ControllerProps}.
 */
export function createController(handler: RequestHandler) {
  return (request: IncomingMessage, response: ServerResponse) =>
    handler(controller(request, response));
}
