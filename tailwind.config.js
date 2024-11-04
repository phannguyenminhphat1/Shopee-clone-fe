import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export const content = ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
export const corePlugins = {
  container: false
}
export const theme = {
  extend: {
    colors: {
      primaryColor: '#ee4d2d'
    }
  }
}
export const plugins = [
  plugin(function ({ addComponents, theme }) {
    addComponents({
      '.container': {
        maxWidth: theme('columns.7xl'),
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: theme('spacing.4'),
        paddingRight: theme('spacing.4')
      }
    })
  })
]
