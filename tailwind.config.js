module.exports = (isProd) => ({
    prefix: '',
    purge: {
      enabled: isProd,
      content: ['**/*.html', '**/*.ts']
    },
    theme: {},
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
    ]
});
