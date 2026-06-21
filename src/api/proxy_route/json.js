import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import verifyProxy from "@/utils/middleware/verifyProxy";

/**
 * @param {import("@pracht/core").ApiRouteArgs}
 */
const handler = async ({ context }) => {
  try {
    await clientProvider.offline.graphqlClient({
      shop: context.userShop,
    });

    return Response.json({ content: "Proxy Be Working" });
  } catch (e) {
    console.error(
      `---> An error occured at /api/proxy_route/json: ${
        e instanceof Error ? e.message : String(e)
      }`,
      e
    );
    return Response.json({ error: true }, { status: 400 });
  }
};

export default withMiddleware(verifyProxy, handler);
