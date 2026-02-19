import nextPlugin from '@next/eslint-plugin-next'

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'build/**', 'dist/**'],
  },
  nextPlugin.flatConfig.coreWebVitals,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
]
