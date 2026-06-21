function withMiddleware(...chain) {
  const handler = chain[chain.length - 1];
  const middleware = chain.slice(0, -1);

  /**
   * @param {import("@pracht/core").ApiRouteArgs} args
   */
  return async (args) => {
    let context = { ...(args.context ?? {}) };

    for (const next of middleware) {
      const result = await next({ ...args, context });

      if (!result) continue;

      if (result instanceof Response) {
        return result;
      }

      if ("redirect" in result) {
        return new Response(null, {
          status: 302,
          headers: { location: result.redirect },
        });
      }

      if ("context" in result) {
        context = { ...context, ...result.context };
      }
    }

    return handler({ ...args, context });
  };
}

export async function readBody(args) {
  if (typeof args.context.rawBody === "string") {
    return {
      body: args.context.body,
      rawBody: args.context.rawBody,
    };
  }

  if (["GET", "HEAD"].includes(args.request.method.toUpperCase())) {
    return { body: undefined, rawBody: "" };
  }

  const rawBody = await args.request.clone().text();
  return {
    body: parseBody(rawBody, args.request.headers.get("content-type")),
    rawBody,
  };
}

export async function readJson(args) {
  const { body } = await readBody(args);
  return body;
}

function parseBody(rawBody, contentType) {
  if (!rawBody) {
    return undefined;
  }

  if (contentType?.includes("application/json")) {
    try {
      return JSON.parse(rawBody);
    } catch {
      return rawBody;
    }
  }

  return rawBody;
}

export default withMiddleware;
