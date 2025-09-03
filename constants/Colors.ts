/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#FF5DA2'; // primary brand pink
const accentBlue = '#4C9AFF';
const surface = '#FFFFFF';
const textPrimary = '#0F172A'; // slate-900
const textSecondary = '#475569'; // slate-600
const iconDefault = '#94A3B8'; // slate-400

export const Colors = {
  light: {
    text: textPrimary,
    background: surface,
    tint: tintColorLight,
    icon: iconDefault,
    tabIconDefault: iconDefault,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F8FAFC',
    background: '#0B1020',
    tint: '#FF6BBA',
    icon: '#A8B1C7',
    tabIconDefault: '#A8B1C7',
    tabIconSelected: '#FF6BBA',
  },
};
