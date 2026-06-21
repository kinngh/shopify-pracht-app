import withMiddleware, { readJson } from "@/utils/middleware/withMiddleware";
import verifyHmac from "@/utils/middleware/verifyHmac";

/**
 * @param {import("@pracht/core").ApiRouteArgs} args
 */
const handler = async (args) => {
  if (args.request.method !== "POST") {
    return new Response("Must be POST", { status: 401 });
  }

  try {
    const body = await readJson(args);
    const shop = body?.shop_domain;
    console.log("gdpr/customers_data_request", body, shop);
    return Response.json({ message: "ok" });
  } catch (e) {
    console.error(
      `---> An error occured at /api/gdpr/customers_data_request: ${
        e instanceof Error ? e.message : String(e)
      }`,
      e
    );
    return Response.json({ error: true }, { status: 500 });
  }
};

export default withMiddleware(verifyHmac, handler);
