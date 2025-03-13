import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  // i18n: {
  //   locales: ["nb", "en"],
  //   defaultLocale: "nb",
  // },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
