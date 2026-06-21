import { RequestedTokenType } from "@shopify/shopify-api";
import freshInstall from "../freshInstall.js";
import prisma from "../prisma.js";
import sessionHandler from "../sessionHandler.js";
import shopify from "../shopify.js";
import "dotenv/config";

/**
 * @param {import("@pracht/core").LoaderArgs} args
 */
const isInitialLoad = async (args) => {
  const { url } = args;
  try {
    const shop = url.searchParams.get("shop");
    const idToken = url.searchParams.get("id_token");

    if (idToken && shop) {
      const { session: offlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
        expiring: true,
      });

      const { session: onlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OnlineAccessToken,
      });

      await sessionHandler.storeSession(offlineSession);
      await sessionHandler.storeSession(onlineSession);

      const isFreshInstall = await prisma.stores.findFirst({
        where: {
          shop: onlineSession.shop,
        },
      });

      if (!isFreshInstall || isFreshInstall?.isActive === false) {
        await freshInstall({ shop: onlineSession.shop });
      }
    }

    return { data: "ok" };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (
      message.includes("Failed to parse session token") &&
      process.env.NODE_ENV === "development"
    ) {
      console.warn(
        "JWT Error - happens in dev mode and can be safely ignored, but not in prod."
      );
    } else {
      console.error(`---> An error occured at isInitialLoad: ${message}`, e);
      return { serverError: true };
    }

    return { data: "ok" };
  }
};

export default isInitialLoad;
