/**
 * Theme configuration and utilities
 */

export const THEME = {
  colors: {
    primary: '#0F4C81',
    secondary: '#1D3557',
    accent: '#2A9D8F',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    border: '#D9DEE7',
    text: '#222222',
    textMuted: '#5B6575',
    success: '#2E7D32',
    warning: '#ED6C02',
    danger: '#C62828',
    info: '#1976D2',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      size: '32px',
      weight: 700,
      lineHeight: '1.2',
    },
    h2: {
      size: '28px',
      weight: 700,
      lineHeight: '1.3',
    },
    h3: {
      size: '24px',
      weight: 600,
      lineHeight: '1.4',
    },
    h4: {
      size: '20px',
      weight: 600,
      lineHeight: '1.4',
    },
    body: {
      size: '16px',
      weight: 400,
      lineHeight: '1.5',
    },
    bodySmall: {
      size: '14px',
      weight: 400,
      lineHeight: '1.5',
    },
    label: {
      size: '14px',
      weight: 500,
      lineHeight: '1.4',
    },
    caption: {
      size: '12px',
      weight: 400,
      lineHeight: '1.4',
    },
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1440px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

/**
 * Get color by status
 */
export const getStatusColor = (status) => {
  const statusMap = {
    success: THEME.colors.success,
    warning: THEME.colors.warning,
    danger: THEME.colors.danger,
    error: THEME.colors.danger,
    info: THEME.colors.info,
  };
  return statusMap[status] || THEME.colors.primary;
};

/**
 * Media query helper
 */
export const media = {
  mobile: `@media (max-width: ${THEME.breakpoints.mobile})`,
  tablet: `@media (min-width: ${THEME.breakpoints.tablet}) and (max-width: ${THEME.breakpoints.laptop})`,
  laptop: `@media (min-width: ${THEME.breakpoints.laptop})`,
  desktop: `@media (min-width: ${THEME.breakpoints.desktop})`,
};
