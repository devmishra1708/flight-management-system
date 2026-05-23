import withPWA from "next-pwa";

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  // remove turbopack unless you actually configure it
};

export default withPWAConfig(nextConfig);