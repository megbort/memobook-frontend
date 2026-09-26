import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Maps the Figma "UI Components" buttons to PrimeVue props:
//   Figma                 PrimeVue
//   Filled                <Button />                                (blue)
//   Filled / Secondary    <Button severity="secondary" />           (dark blue)
//   Flat                  <Button variant="outlined" />             (+ severity="secondary")
//   Important             <Button severity="danger" />              (error red)
//   Icon Button           <Button icon="…" />  /  severity="danger"
//   Text Button / Link    <Button variant="link" />
//   (not in Figma) Neutral <Button severity="contrast" variant="outlined" />  grey, for Cancel

const darken = (color: string, amount = 12) => `color-mix(in srgb, ${color}, #000 ${amount}%)`;
const tint = (color: string, amount = 12) => `color-mix(in srgb, ${color} ${amount}%, transparent)`;

const BLUE = 'var(--memobook-blue)';
const DARK_BLUE = 'var(--memobook-dark-blue)';
const ERROR = 'var(--memobook-error)';
const ERROR_DARK = 'var(--memobook-error-dark)';
const WHITE = 'var(--memobook-white)';
const BLACK = 'var(--memobook-black)';
const GREY = 'var(--memobook-dark-grey)';
const LIGHT_GREEN = 'var(--memobook-light-green)';
const GREEN = 'var(--memobook-green)';
const DARK_GREEN = 'var(--memobook-dark-green)';

const mix = (color: string, other: string, otherAmount: number) =>
  `color-mix(in srgb, ${color}, ${other} ${otherAmount}%)`;

// Aura's primary palette defaults to emerald; every shade is rebuilt from the MemoBook greens.
const greenPalette = {
  50: mix(LIGHT_GREEN, '#fff', 50),
  100: LIGHT_GREEN,
  200: mix(LIGHT_GREEN, GREEN, 35),
  300: mix(LIGHT_GREEN, GREEN, 65),
  400: mix(GREEN, LIGHT_GREEN, 20),
  500: GREEN,
  600: mix(GREEN, DARK_GREEN, 50),
  700: DARK_GREEN,
  800: darken(DARK_GREEN, 20),
  900: darken(DARK_GREEN, 35),
  950: darken(DARK_GREEN, 50),
};

const primaryScheme = {
  color: GREEN,
  contrastColor: BLACK,
  hoverColor: darken(GREEN),
  activeColor: darken(GREEN, 20),
};

const solid = (color: string, hover: string, active: string) => ({
  background: color,
  hoverBackground: hover,
  activeBackground: active,
  borderColor: color,
  hoverBorderColor: hover,
  activeBorderColor: active,
  color: WHITE,
  hoverColor: WHITE,
  activeColor: WHITE,
  focusRing: { color, shadow: 'none' },
});

const outlined = (color: string) => ({
  hoverBackground: tint(color, 10),
  activeBackground: tint(color, 20),
  borderColor: color,
  color,
});

const text = (color: string) => ({
  hoverBackground: tint(color, 10),
  activeBackground: tint(color, 20),
  color,
});

const buttonScheme = (textColor: string) => ({
  root: {
    primary: solid(BLUE, darken(BLUE), darken(BLUE, 20)),
    secondary: solid(DARK_BLUE, darken(DARK_BLUE), darken(DARK_BLUE, 20)),
    danger: solid(ERROR, ERROR_DARK, darken(ERROR_DARK)),
  },
  outlined: {
    primary: outlined(BLUE),
    secondary: outlined(DARK_BLUE),
    danger: outlined(ERROR),
    contrast: { ...outlined(GREY), color: textColor },
  },
  text: {
    primary: text(BLUE),
    secondary: text('var(--memobook-dark-grey)'),
    danger: text(ERROR),
  },
  link: {
    color: BLUE,
    hoverColor: DARK_BLUE,
    activeColor: DARK_BLUE,
  },
});

export const MemobookPreset = definePreset(Aura, {
  semantic: {
    primary: greenPalette,
    colorScheme: {
      light: {
        primary: primaryScheme,
        highlight: {
          background: LIGHT_GREEN,
          focusBackground: darken(LIGHT_GREEN, 6),
          color: BLACK,
          focusColor: BLACK,
        },
      },
      dark: {
        primary: primaryScheme,
        highlight: {
          background: tint(GREEN, 16),
          focusBackground: tint(GREEN, 24),
          color: 'var(--memobook-light-grey)',
          focusColor: 'var(--memobook-light-grey)',
        },
      },
    },
  },
  components: {
    tabs: {
      colorScheme: {
        // Mid green is too faint as text on white; the underline stays mid green via {primary.color}.
        light: { tab: { activeColor: DARK_GREEN } },
        dark: { tab: { activeColor: GREEN } },
      },
    },
    button: {
      root: {
        borderRadius: '4px',
      },
      colorScheme: {
        light: buttonScheme('var(--memobook-black)'),
        dark: buttonScheme(WHITE),
      },
    },
  },
});
