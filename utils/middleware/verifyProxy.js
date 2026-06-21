import crypto from "node:crypto";

/**
 * @param {import("@pracht/core").MiddlewareArgs}
 */
const verifyProxy = async ({ url }) => {
  const signature = url.searchParams.get("signature");

  const queryURI = encodeQueryData(url.searchParams)
    .replace("/?", "")
    .replace(/&signature=[^&]*/, "")
    .split("&")
    .map((x) => decodeURIComponent(x))
    .sort()
    .join("");

  const calculatedSignature = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET ?? "")
    .update(queryURI, "utf-8")
    .digest("hex");

  if (calculatedSignature === signature) {
    return {
      context: {
        userShop: url.searchParams.get("shop") ?? undefined,
      },
    };
  }

  return Response.json(
    {
      success: false,
      message: "Signature verification failed",
    },
    { status: 401 }
  );
};

function encodeQueryData(searchParams) {
  const queryString = [];
  for (const [key, value] of searchParams.entries()) {
    queryString.push(`${key}=${encodeURIComponent(value)}`);
  }
  return queryString.join("&");
}

export default verifyProxy;
