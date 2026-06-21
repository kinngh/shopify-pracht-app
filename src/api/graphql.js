import withMiddleware, { readJson } from "@/utils/middleware/withMiddleware";
import verifyRequest from "@/utils/middleware/verifyRequest";
import shopify from "@/utils/shopify";

/**
 * @param {import("@pracht/core").ApiRouteArgs} args
 */
const handler = async (args) => {
  if (args.request.method !== "POST") {
    return Response.json({ text: "We don't do that here." }, { status: 400 });
  }

  try {
    const response = await shopify.clients.graphqlProxy({
      session: args.context.userSession,
      rawBody: await readJson(args),
    });

    return new Response(
      typeof response.body === "string"
        ? response.body
        : JSON.stringify(response.body),
      {
        headers: { "content-type": "application/json; charset=utf-8" },
      }
    );
  } catch (e) {
    console.error("An error occured at /api/graphql", e);
    return Response.json(e, { status: 403 });
  }
};

export default withMiddleware(verifyRequest, handler);
