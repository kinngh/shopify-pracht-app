import { useNavigate } from "@pracht/core";
// import isInitialLoad from "@/utils/middleware/isInitialLoad";

// /**
//  * @param {import("@pracht/core").LoaderArgs} args
//  */
// export async function loader(args) {
//   return isInitialLoad(args);
// }

const HomePage = () => {
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  async function caller() {
    const response = await (
      await fetch("/api/apps/caller", {
        method: "GET",
      })
    ).json();
    console.dir(response, { depth: null });
  }

  return (
    <s-page heading="Home">
      <s-grid
        gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
        gap="base"
      >
        <s-button
          onClick={() => {
            caller();
          }}
        >
          Clicker
        </s-button>
        {isDev ? (
          <s-section heading="Debug Cards">
            <s-stack gap="base">
              <s-paragraph>
                Explore how the repository handles data fetching from the
                backend, App Proxy, GraphQL requests, Billing API and more.
              </s-paragraph>
              <s-stack direction="inline" justifyContent="end">
                <s-button
                  variant="primary"
                  onClick={() => {
                    navigate("/debug/billing");
                  }}
                >
                  Debug Cards
                </s-button>
              </s-stack>
            </s-stack>
          </s-section>
        ) : null}

        <s-section heading="App Bridge CDN">
          <s-stack gap="base">
            <s-paragraph>
              App Bridge has moved from an npm package to CDN.
            </s-paragraph>
            <s-stack direction="inline" justifyContent="end">
              <s-button
                variant="primary"
                href="https://shopify.dev/docs/api/app-bridge-library/reference"
                target="_blank"
              >
                Explore
              </s-button>
            </s-stack>
          </s-stack>
        </s-section>

        <s-section heading="Repository">
          <s-stack gap="base">
            <s-paragraph>
              Found a bug? Open an issue on the repository, or star on GitHub.
            </s-paragraph>
            <s-stack direction="inline" gap="base" justifyContent="end">
              <s-button
                href="https://github.com/kinngh/shopify-nextjs-prisma-app/issues?q=is%3Aissue"
                target="_blank"
              >
                Issues
              </s-button>
              <s-button
                variant="primary"
                href="https://github.com/kinngh/shopify-nextjs-prisma-app"
                target="_blank"
              >
                Star
              </s-button>
            </s-stack>
          </s-stack>
        </s-section>

        <s-section heading="Course">
          <s-stack gap="base">
            <s-paragraph>
              [BETA] I'm building course as a live service on How To Build
              Shopify Apps.
            </s-paragraph>
            <s-stack direction="inline" justifyContent="end">
              <s-button
                variant="primary"
                href="https://kinngh.gumroad.com/l/how-to-make-shopify-apps?utm_source=boilerplate&utm_medium=pracht"
                target="_blank"
              >
                Buy
              </s-button>
            </s-stack>
          </s-stack>
        </s-section>
      </s-grid>
    </s-page>
  );
};

export default HomePage;
