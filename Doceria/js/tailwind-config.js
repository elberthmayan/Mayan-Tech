// Configuração Tailwind - DOCERIA ELEGANCE
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                serif: ['Playfair Display', 'serif'], // Fonte elegante e clássica
            },
            colors: {
                sweet: {
                    pink: '#ec4899',       // Rosa principal vibrante
                    pinkHover: '#db2777',  // Rosa escuro para botões
                    dark: '#4a044e',       // Roxo super escuro para os textos (substitui o preto)
                    bg: '#fdf2f8',         // Rosa super clarinho para o fundo
                    card: '#ffffff',
                    border: '#fbcfe8'      // Rosa claro para bordas
                }
            }
        }
    }
}