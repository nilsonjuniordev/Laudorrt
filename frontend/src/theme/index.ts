import { createTheme, Theme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

// Constantes de cores
const colors = {
  primary: {
    main: '#A16F6F',
    light: '#B58585',
    dark: '#8D5959',
    contrastText: '#fff',
  },
  secondary: {
    main: '#CBB271',
    light: '#D6C28E',
    dark: '#B29B54',
    contrastText: '#000',
  },
  background: {
    default: '#CBB271',
    paper: 'rgba(161, 111, 111, 0.5)',
  },
  text: {
    primary: '#000',
    secondary: '#545454',
  },
} as const;

// Configuração da tipografia
const typography = {
  fontFamily: ['Poppins', 'Italiana', 'sans-serif'].join(','),
  h1: {
    fontFamily: 'Italiana, serif',
    fontSize: '4rem',
    fontWeight: 400,
    letterSpacing: '0.04em',
    lineHeight: 1.1,
    textTransform: 'uppercase',
  },
  h2: {
    fontFamily: 'Italiana, serif',
    fontSize: '3.2rem',
    fontWeight: 400,
    letterSpacing: '0.03em',
    lineHeight: 1.2,
    textTransform: 'uppercase',
  },
  h3: {
    fontFamily: 'Italiana, serif',
    fontSize: '2.4rem',
    fontWeight: 400,
    letterSpacing: '0.02em',
    lineHeight: 1.3,
  },
  h4: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '2rem',
    fontWeight: 200,
    letterSpacing: '0.02em',
    lineHeight: 1.3,
  },
  h5: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.6rem',
    fontWeight: 200,
    letterSpacing: '0.02em',
    lineHeight: 1.4,
  },
  h6: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    lineHeight: 1.4,
  },
  subtitle1: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    lineHeight: 1.5,
  },
  subtitle2: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    lineHeight: 1.5,
  },
  body1: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    fontWeight: 300,
    letterSpacing: '0.01em',
    lineHeight: 1.6,
  },
  body2: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.875rem',
    fontWeight: 300,
    letterSpacing: '0.01em',
    lineHeight: 1.6,
  },
  button: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 400,
    letterSpacing: '0.05em',
    textTransform: 'none',
  },
  caption: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    lineHeight: 1.4,
  },
  overline: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: 1.4,
  },
} as const;

// Configuração dos componentes
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 0,
        padding: '12px 24px',
        fontWeight: 400,
        letterSpacing: '0.05em',
        borderColor: colors.secondary.main,
        color: colors.secondary.main,
        fontFamily: 'Poppins, sans-serif',
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      outlined: {
        borderWidth: '1px',
        '&:hover': {
          borderWidth: '1px',
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: colors.secondary.main,
        '&.Mui-checked': {
          color: colors.secondary.main,
        },
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        color: colors.secondary.main,
        '&.Mui-checked': {
          color: colors.secondary.main,
        },
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
        backgroundColor: '#DECBCB',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: '#DECBCB',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1rem',
        letterSpacing: '0.01em',
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '0.9rem',
        letterSpacing: '0.01em',
        fontWeight: 300,
      },
    },
  },
} as const;

// Criação do tema
const theme = createTheme(
  {
    palette: colors,
    typography,
    components,
    shape: {
      borderRadius: 0,
    },
  },
  ptBR // Suporte para português do Brasil
);

export type AppTheme = Theme;
export default theme;
