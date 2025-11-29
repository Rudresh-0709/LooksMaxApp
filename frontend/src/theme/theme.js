export const theme = {
  colors: {
    background: '#020b14',
    primary: '#00f0ff', // Cyan
    secondary: '#ffffff', // White
    text: '#e0f7fa',
    textDim: 'rgba(224, 247, 250, 0.6)',
    border: 'rgba(0, 240, 255, 0.3)',
    glow: '#00f0ff',
    error: '#ff3333',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  typography: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    label: {
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    body: {
      fontSize: 16,
    },
  },
  borders: {
    thin: 1,
    radius: 0, // No rounded corners as per "Technical blueprint theme"
  },
};
