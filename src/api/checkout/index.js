import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import verifyCheckout from "@/utils/middleware/verifyCheckout";

/**
 * @param {import("@pracht/core").ApiRouteArgs}
 */
const handler = async ({ request, context }) => {
  if (request.method !== "GET") {
    console.log("Serve this request only if method type is GET");
    return Response.json({ error: true }, { status: 405 });
  }

  try {
    console.log("Request came from checkout extension");

    const { client } = await clientProvider.offline.graphqlClient({
      shop: context.userShop,
    });

    await client.request(/* GraphQL */ `
      {
        shop {
          id
        }
      }
    `);

    return Response.json({ content: "Checkout Be Working" });
  } catch (e) {
    console.error(
      `---> An error occured in /api/checkout/index :${
        e instanceof Error ? e.message : String(e)
      }`,
      e
    );
    return Response.json({ error: true }, { status: 403 });
  }
};

export default withMiddleware(verifyCheckout, handler);
