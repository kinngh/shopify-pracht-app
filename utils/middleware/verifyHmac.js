import crypto from "node:crypto";
import shopify from "../shopify";
import { readBody } from "./withMiddleware";

/**
 * @param {import("@pracht/core").MiddlewareArgs} args
 */
const verifyHmac = async (args) => {
  try {
    const { body, rawBody } = await readBody(args);
    const generateHash = crypto
      .createHmac("SHA256", process.env.SHOPIFY_API_SECRET ?? "")
      .update(JSON.stringify(body), "utf8")
      .digest("base64");

    const hmac = args.request.headers.get("x-shopify-hmac-sha256");

    if (shopify.auth.safeCompare(generateHash, hmac ?? "")) {
      return {
        context: {
          body,
          rawBody,
        },
      };
    }

    return Response.json(
      { success: false, message: "HMAC verification failed" },
      { status: 401 }
    );
  } catch (e) {
    console.log(
      "---> An error occured while verifying HMAC",
      e instanceof Error ? e.message : e
    );
    return Response.json(
      { success: false, message: "HMAC verification failed" },
      { status: 401 }
    );
  }
};

export default verifyHmac;
