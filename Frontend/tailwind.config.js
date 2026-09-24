/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#1F6B3A',
                    accent: '#D0121A',
                    bg: '#F5F2EB',
                    text: '#2C221E',
                    gold: '#E2B880',
                },
                terracotta: {
                    DEFAULT: '#D0121A',
                    dark: '#A40E16',
                    light: '#E85C61',
                },
                safran: {
                    DEFAULT: '#E2B880',
                    light: '#F1D7AE',
                },
                zellige: {
                    DEFAULT: '#1F6B3A',
                    dark: '#15502B',
                },
                olive: {
                    DEFAULT: '#2E8B3A',
                    light: '#D8E8D4',
                },
                henne: {
                    DEFAULT: '#8C2F1B',
                },
                sable: {
                    DEFAULT: '#F5F2EB',
                    50: '#FFFFFF',
                },
                encre: {
                    DEFAULT: '#2C221E',
                    muted: '#6F625B',
                },
            },
            boxShadow: {
                souk: '0 12px 30px -18px rgba(44, 34, 30, 0.28)',
            },
            fontFamily: {
                display: ['Source Sans 3', 'system-ui', 'sans-serif'],
                sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
