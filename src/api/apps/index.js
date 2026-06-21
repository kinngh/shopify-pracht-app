import withMiddleware from "@/utils/middleware/withMiddleware";
import verifyRequest from "@/utils/middleware/verifyRequest";

/**
 * @param {import("@pracht/core").ApiRouteArgs}
 */
const handler = async ({ request }) => {
  if (request.method !== "GET") {
    console.log("Serve this only if the request method is GET");
    return Response.json({ error: true }, { status: 405 });
  }

  try {
    return Response.json({ text: "This is an example route" });
  } catch (e) {
    console.error(
      `---> An error occured at /api/apps: ${
        e instanceof Error ? e.message : String(e)
      }`,
      e
    );
    return Response.json({ error: true }, { status: 403 });
  }
};

export default withMiddleware(verifyRequest, handler);
