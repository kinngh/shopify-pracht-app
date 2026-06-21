import EmbeddedAppProvider from "@/components/providers/EmbeddedAppProvider";

export function headers() {
  return {
    "Content-Security-Policy":
      "frame-ancestors https://*.myshopify.com https://admin.shopify.com;",
  };
}

/**
 * @param {import("@pracht/core").ShellProps} props
 */
export function Shell({ children }) {
  return (
    <>
      <script
        src={`https://cdn.shopify.com/shopifycloud/app-bridge.js?apiKey=${process.env.CONFIG_SHOPIFY_API_KEY}`}
      />
      <script src="https://cdn.shopify.com/shopifycloud/polaris.js" />
      <EmbeddedAppProvider>
        <ui-nav-menu>
          <a href="/debug">Debug Cards</a>
        </ui-nav-menu>
        {children}
      </EmbeddedAppProvider>
    </>
  );
}
