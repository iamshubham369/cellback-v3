/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#16a34a',
                    dark: '#15803d',
                    light: '#4ade80',
                },
                accent: {
                    DEFAULT: '#f59e0b',
                    dark: '#d97706',
                    light: '#fbbf24',
                },
                slate: {
                    950: '#0f172a',
                    900: '#1e293b',
                    800: '#334155',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
