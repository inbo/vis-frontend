module.exports = {
  prefix: '',
  purge: {
    enabled: true,
    content: ['**/*.html', '**/*.ts']
  },
  theme: {
    extend: {
      boxShadow: {
        'under': '0 2px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ]
};
