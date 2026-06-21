import shopify from "../shopify";
import validateJWT from "../validateJWT";

/**
 * @param {import("@pracht/core").MiddlewareArgs}
 */
const verifyCheckout = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200 });
  }

  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      throw Error("No authorization header found.");
    }

    const payload = validateJWT(authHeader.split(" ")[1]);
    const shop = shopify.utils.sanitizeShop(
      payload.dest.replace("https://", "")
    );
    if (!shop) {
      throw Error("No shop found, not a valid request");
    }

    return {
      context: {
        userShop: shop,
      },
    };
  } catch (e) {
    console.error(
      `---> An error happened at verifyCheckout middleware: ${
        e instanceof Error ? e.message : String(e)
      }`
    );
    return Response.json({ error: "Unauthorized call" }, { status: 401 });
  }
};

export default verifyCheckout;
