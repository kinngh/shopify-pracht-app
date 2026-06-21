import clientProvider from "@/utils/clientProvider";
import verifyRequest from "@/utils/middleware/verifyRequest";
import withMiddleware from "@/utils/middleware/withMiddleware";

/**
 * @param {import("@pracht/core").ApiRouteArgs}
 */
const handler = async ({ request, context }) => {
  if (request.method !== "GET") {
    console.log("Serve this only if the request method is GET");
    return Response.json({ error: true }, { status: 405 });
  }

  try {
    const { client } = await clientProvider.offline.graphqlClient({
      shop: context.userShop,
    });

    const response = await client.request(/* GraphQL */ `
      {
        shop {
          id
        }
      }
    `);

    return Response.json(response?.data);
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
