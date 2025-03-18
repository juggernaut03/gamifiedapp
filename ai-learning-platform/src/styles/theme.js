import colors from './colors';
import typography from './typography';
import spacing from './spacing';

export const lightTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    background: colors.background.light,
    card: colors.card.light,
    text: colors.text.light,
    border: colors.text.light + '20',
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  },
  typography,
  spacing,
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    background: colors.background.dark,
    card: colors.card.dark,
    text: colors.text.dark,
    border: colors.text.dark + '20',
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  },
  typography,
  spacing,
};
