module.exports = {

  important: true,
  target: 'ie11',
  purge: ['./src/**/*.html','./public/**/*.html','./src/**/*.tsx','*.ts','*.tsx'],
  theme: {
    fontFamily: {
      display: ['Helvetica Neue', 'Arial','sans-serif'],
      body: ['Helvetica Neue','Arial','sans-serif']
    },
    extend: {
      colors: {

      },
      spacing: {
          72: '18rem',
          84: '21rem',
          96: '24rem'
      },
      inset: {
        '-12': '-3rem',
        '1,2': '50%'
      },
      minHeight: {
        px: '1px',
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem'
      },
      maxWidth: {
        'screen-2xl':'1440px'
      }
    }
  },
  variants: {
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  }
}