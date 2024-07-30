module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],

    // enable dark mode via class strategy
    darkMode: 'class',

    theme: {
        extend: {
            colors: {
                black: '#000000',
                darkGray: '#000000',
                blanco: '#FFFFFF',
                fondo:'#f0f4f9',
                section: '#F0F1F2',
                dorado:'#E6CD95',
                brightRed: 'hsl(12, 88%, 59%)',
                brightRedLight: 'hsl(12, 88%, 69%)',
                brightRedSupLight: 'hsl(12, 88%, 95%)',

                darkBlue: 'hsl(228, 39%, 23%)',
                darkGrayishBlue: 'hsl(227, 12%, 61%)',
                veryDarkBlue: 'hsl(233, 12%, 13%)',
            },
            fontSize: {
                title:'20px',
            },
            
            screens: {
                'mobilsmall': '375px',
              
              },
              
        },
    },
    plugins: [],
}
