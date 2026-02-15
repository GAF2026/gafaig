/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        "snowflake-sdk",
      ];
    }

    // Ignore Snowflake binary type files
    config.module.rules.push({
      test: /\.d\.ts$/,
      use: "ignore-loader",
    });

    return config;
  },
};

module.exports = nextConfig;