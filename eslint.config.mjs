import nextPlugin from '@next/eslint-plugin-next'

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'build/**', 'dist/**', 'docker/**'],
  },
  nextPlugin.configs['core-web-vitals'],
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
]
