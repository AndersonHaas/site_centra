import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    // This app has two independent root layouts (app/(selector)/layout.tsx
    // and app/[locale]/layout.tsx — no shared app/layout.tsx), so there is
    // no single layout tree Next.js can compose a 404 from for URLs that
    // don't match any route at all. Without this flag, such URLs (e.g. a
    // business-unit route not yet built) fall through to Next's built-in
    // default 404 instead of app/global-not-found.tsx. See
    // node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md.
    globalNotFound: true,
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
