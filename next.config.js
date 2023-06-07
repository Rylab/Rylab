module.exports = {
  experimental: { appDir: true },
  poweredByHeader: false,
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  },
}
