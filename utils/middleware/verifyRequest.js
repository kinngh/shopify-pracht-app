import { RequestedTokenType, Session } from "@shopify/shopify-api";
import sessionHandler from "../sessionHandler";
import shopify from "../shopify";
import validateJWT from "../validateJWT";

/**
 * @param {import("@pracht/core").MiddlewareArgs}
 */
const verifyRequest = async ({ request }) => {
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

    const session = await getSession({ shop, authHeader });
    if (!session) {
      throw Error("Unable to load a Shopify session.");
    }

    return {
      context: {
        userSession: session,
        userShop: session.shop,
      },
    };
  } catch (e) {
    console.error(
      `---> An error happened at verifyRequest middleware: ${
        e instanceof Error ? e.message : String(e)
      }`
    );
    return Response.json({ error: "Unauthorized call" }, { status: 401 });
  }
};

async function getSession({ shop, authHeader }) {
  try {
    const sessionToken = authHeader.split(" ")[1];

    const { session: onlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });

    await sessionHandler.storeSession(onlineSession);

    const { session: offlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
      expiring: true,
    });

    await sessionHandler.storeSession(offlineSession);

    return new Session(onlineSession);
  } catch (e) {
    console.error(
      `---> Error happened while pulling session from Shopify: ${
        e instanceof Error ? e.message : String(e)
      }`
    );
  }
}

export default verifyRequest;
