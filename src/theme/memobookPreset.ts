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
const GREY = 'var(--memobook-dark-grey)';

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
  components: {
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
