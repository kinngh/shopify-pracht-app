import shopify from "../utils/shopify.js";

function declarativeWriter(config) {
  try {
    const metafields = shopify.user?.metafields;
    if (!Array.isArray(metafields) || metafields.length === 0) return;

    for (const def of metafields) {
      writeMetafield(config, def);
    }
  } catch (e) {
    console.error("---> An error occured while writing declarative metafields");
    console.log(e instanceof Error ? e.message : e);
  }
}

function writeMetafield(config, def) {
  const owner = def.owner_type;
  const namespace = def.namespace || "app";
  const key = def.key;

  if (!owner || !namespace || !key) return;

  config[owner] ??= {};
  config[owner].metafields ??= {};
  config[owner].metafields[namespace] ??= {};

  const out = {
    name: def.name,
    description: def.description ?? "",
    type: def.type,
  };

  if (def.access && typeof def.access === "object") {
    out.access = {};
    if (def.access.admin) out.access.admin = def.access.admin;
    if (def.access.storefront) out.access.storefront = def.access.storefront;
    if (def.access.customer_account) {
      out.access.customer_account = def.access.customer_account;
    }
    if (Object.keys(out.access).length === 0) delete out.access;
  }

  if (def.capabilities && typeof def.capabilities === "object") {
    out.capabilities = {};
    if (typeof def.capabilities.admin_filterable === "boolean") {
      out.capabilities.admin_filterable = def.capabilities.admin_filterable;
    }
    if (typeof def.capabilities.unique_values === "boolean") {
      out.capabilities.unique_values = def.capabilities.unique_values;
    }
    if (Object.keys(out.capabilities).length === 0) delete out.capabilities;
  }

  const validations = normalizeValidations(def.validations);
  if (typeof validations !== "undefined") {
    out.validations = validations;
  }

  config[owner].metafields[namespace][key] = out;
}

function normalizeValidations(validations) {
  if (validations == null) return undefined;

  if (Array.isArray(validations)) {
    const validationsTable = {};
    for (const validation of validations) {
      const name =
        typeof validation.name === "string"
          ? validation.name.trim()
          : String(validation.name || "");
      if (!name) continue;

      const value = validation.value;
      if (value == null) continue;
      if (typeof value === "string" && !value.trim()) continue;

      validationsTable[name] = value;
    }

    return Object.keys(validationsTable).length > 0
      ? validationsTable
      : undefined;
  }

  if (typeof validations === "object") {
    return Object.keys(validations).length > 0 ? validations : undefined;
  }

  if (typeof validations === "string") {
    return validations.trim() ? validations : undefined;
  }

  return undefined;
}

export default declarativeWriter;
