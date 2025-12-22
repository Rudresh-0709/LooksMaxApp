export const theme = {
  colors: {
    // === NEON GRADIENT THEME ===
    // Modern, vibrant aesthetic with purple-pink gradients

    // Backgrounds
    background: '#0A0A0F',           // Deep black
    backgroundElevated: '#12121A',   // Slightly lifted
    backgroundCard: '#1A1A25',       // Card background

    // Primary gradient colors
    gradientStart: '#667EEA',        // Purple-blue
    gradientEnd: '#764BA2',          // Deep purple

    // Accent
    accent: '#F093FB',               // Pink glow
    accentMuted: 'rgba(240, 147, 251, 0.15)',

    // Primary (for single color usage)
    primary: '#8B5CF6',              // Vibrant purple
    primaryMuted: 'rgba(139, 92, 246, 0.15)',
    primaryGlow: 'rgba(139, 92, 246, 0.4)',

    // Text
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textDim: 'rgba(255, 255, 255, 0.4)',

    // Borders
    border: 'rgba(139, 92, 246, 0.3)',
    borderMuted: 'rgba(255, 255, 255, 0.08)',

    // States
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    // Glass effect
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },

  gradients: {
    primary: ['#667EEA', '#764BA2'],
    accent: ['#F093FB', '#F5576C'],
    button: ['#8B5CF6', '#7C3AED'],
    card: ['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.05)'],
  },

  spacing: {
    xs: 4,
    s: 8,
    sm: 8,
    m: 16,
    md: 16,
    l: 24,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  typography: {
    header: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    subheader: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 26,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
    },
  },

  borders: {
    thin: 1,
    medium: 2,
    radius: {
      none: 0,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      full: 9999,
    },
  },

  shadows: {
    glow: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export default theme;
