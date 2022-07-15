const {guessProductionMode} = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
    mode: 'jit',
    purge: {
        content: [
            './src/**/*.{html,ts,css,scss,sass,less,styl}',
        ],
    },
    theme: {
        extend: {
            colors: {
                "pink": {
                    "50": "#F9ECF2",
                    "100": "#F2D9E6",
                    "200": "#E5B3CD",
                    "300": "#D98CB4",
                    "400": "#CD6A9D",
                    "500": "#C04384",
                    "600": "#9D346A",
                    "700": "#73264E",
                    "800": "#4C1A34",
                    "900": "#260D1A",
                },
            },
            height: {
                '125': '35rem',
            },
            boxShadow: {
                'under': '0 2px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio'),
    ],
};
