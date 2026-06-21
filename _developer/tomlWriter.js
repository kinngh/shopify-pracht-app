import toml from "@iarna/toml";
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import setupCheck from "../utils/setupCheck.js";
import declarativeWriter from "./declarativeWriter.js";
import eventWriter from "./eventWriter.js";
import webhookWriter from "./webhookWriter.js";

let config = {};

try {
  setupCheck();

  let appUrl = process.env.SHOPIFY_APP_URL ?? "";
  if (appUrl.endsWith("/")) {
    appUrl = appUrl.slice(0, -1);
  }

  config.name = process.env.APP_NAME;
  config.handle = process.env.APP_HANDLE;
  config.client_id = process.env.SHOPIFY_API_KEY;
  config.application_url = appUrl;
  config.embedded = true;
  config.extension_directories = ["../extension/extensions/**"];

  config.auth = {};
  config.auth.redirect_urls = [`${appUrl}/api/`];

  config.access_scopes = {};
  config.access_scopes.scopes = process.env.SHOPIFY_API_SCOPES;
  if (process.env.SHOPIFY_API_OPTIONAL_SCOPES?.trim()) {
    config.access_scopes.optional_scopes =
      process.env.SHOPIFY_API_OPTIONAL_SCOPES.split(",")
        .map((scope) => scope.trim())
        .filter(Boolean);
  }
  config.access_scopes.use_legacy_install_flow = false;

  if (
    process.env.DIRECT_API_MODE &&
    process.env.EMBEDDED_APP_DIRECT_API_ACCESS
  ) {
    config.access = {};
    config.access.admin = {};
    config.access.admin.direct_api_mode = process.env.DIRECT_API_MODE;
    config.access.admin.embedded_app_direct_api_access =
      process.env.EMBEDDED_APP_DIRECT_API_ACCESS === "true";
  }

  config.webhooks = {};
  config.webhooks.api_version = process.env.SHOPIFY_API_VERSION;

  webhookWriter(config);
  eventWriter(config);
  declarativeWriter(config);

  config.webhooks.privacy_compliance = {};
  config.webhooks.privacy_compliance.customer_data_request_url = `${appUrl}/api/gdpr/customers_data_request`;
  config.webhooks.privacy_compliance.customer_deletion_url = `${appUrl}/api/gdpr/customers_redact`;
  config.webhooks.privacy_compliance.shop_deletion_url = `${appUrl}/api/gdpr/shop_redact`;

  if (
    process.env.APP_PROXY_PREFIX?.length > 0 &&
    process.env.APP_PROXY_SUBPATH?.length > 0
  ) {
    config.app_proxy = {};
    config.app_proxy.url = `${appUrl}/api/proxy_route`;
    config.app_proxy.prefix = process.env.APP_PROXY_PREFIX;
    config.app_proxy.subpath = process.env.APP_PROXY_SUBPATH;
  }

  if (process.env.POS_EMBEDDED && process.env.POS_EMBEDDED.length > 1) {
    config.pos = {};
    config.pos.embedded = process.env.POS_EMBEDDED === "true";
  }

  writeToml(path.join(process.cwd(), "shopify.app.toml"), config);

  const extensionsDir = path.join("..", "extension");
  config.extension_directories = ["./extensions/**"];
  const extensionConfig = { ...config };

  config.extension_directories = ["extension/extensions/**"];
  const globalConfig = { ...config };

  if (fs.existsSync(extensionsDir)) {
    writeToml(path.join(process.cwd(), "..", "shopify.app.toml"), globalConfig);
    writeToml(path.join(extensionsDir, "shopify.app.toml"), extensionConfig);
  }
} catch (e) {
  console.error("---> An error occured while writing toml files");
  console.log(e instanceof Error ? e.message : e);
}

function writeToml(filePath, nextConfig) {
  const content =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" +
    toml.stringify(nextConfig);

  fs.writeFileSync(filePath, content);
}
