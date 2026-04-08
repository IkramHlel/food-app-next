import coreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...coreWebVitals,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
]

export default config
