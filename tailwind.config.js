const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
                raleway: ['Raleway', 'sans-serif'],
            },

			animation: {
				modaldown: 'setModalDown 0.3s ease-out',
				modalup: 'setModalUp 0.3s ease-out',
                fade: 'fadeIn 0.7s ease-in'
			},

			keyframes: theme => ({
				setModalDown: {
					'0%': { transform: 'translateY(-3rem)' },
					'100%': { transform: 'translateY(0px)' }
				},
				
				setModalUp: {
					'0%': { transform: 'translateY(0px)' },
					'100%': { transform: 'translateY(-3rem)' }
				},

                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },

			}),
        },
    },

    plugins: [
		require('@tailwindcss/forms'),
	],
};
