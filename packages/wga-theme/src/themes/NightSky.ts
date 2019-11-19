import { ITheme } from '../contexts/Theme'

const slate = (
  lightness: number = 0,
  opacity: number = 1,
  saturation: number = 15,
  hue: number = 200
) =>
  opacity === 1
    ? `hsl(${hue}, ${saturation}%, ${lightness}%)`
    : `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`

export const NightSky: ITheme = {
  global: {
    radius: 3,
    thick: 800,
    thin: 600,
  },
  /**
   * Navigation.
   */
  iconBar: {
    icon: slate(65),
    iconHover: slate(95),
    iconFocused: slate(95),
    iconBackground: slate(5),
    iconBackgroundHover: slate(15),
    background: slate(5),
    border: `1px solid ${slate(2.5)}`,
  },
  sideBar: {
    title: slate(95),
    footer: slate(65),
    options: slate(65),
    optionsHover: slate(95),
    optionsFocused: slate(95),
    background: slate(7.5),
    backgroundHover: slate(12.5),
    border: `1px solid ${slate(2.5)}`,
  },
  /**
   * Screens.
   */
  page: {
    title: slate(95),
    subtitle: slate(65),
    branding: slate(35),
    brandingHover: slate(65),
    label: slate(65),
    labelHover: slate(95),
    header: slate(7.5),
    headerHover: slate(12.5),
    border: `1px solid ${slate(2.5)}`,
    background: slate(10),
  },
  gadgets: {
    title: slate(95),
    subtitle: slate(65),
    branding: slate(35),
    brandingHover: slate(65),
    header: slate(7.5),
    border: `1px solid ${slate(2.5)}`,
    background: slate(10),
  },
  searchBar: {
    label: slate(65),
    labelHover: slate(95),
    labelDisabled: slate(35),
    placeholder: slate(35),
    background: slate(7.5),
    backgroundHover: slate(12.5),
    backgroundDisabled: slate(7.5),
    border: `1px solid ${slate(2.5)}`,
  },
  scroller: {
    background: slate(12.5),
    backgroundHover: slate(17.5),
    underneath: slate(7.5),
    border: `1px solid ${slate(5)}`,
  },
  modal: {
    background: slate(5),
    shadow: `0 0 13px -3px ${slate(0, 0.5)}`,
    border: `1px solid ${slate(2.5)}`,
    cover: slate(5, 0.25),
  },
  /**
   * Lists.
   */
  table: {
    label: slate(95),
    value: slate(65),
    valueHover: slate(95),
    header: slate(10),
    headerHover: slate(15),
    background: slate(12.5),
    backgroundHover: slate(17.5),
    border: `1px solid ${slate(7.5)}`,
  },
  snippet: {
    label: slate(95),
    value: slate(65),
    arrow: slate(65),
    background: slate(12.5),
    backgroundHover: slate(17.5),
    border: `1px solid ${slate(7.5)}`,
  },
  /**
   * Forms.
   */
  input: {
    label: slate(95),
    helper: slate(45),
    placeholder: slate(35),
    value: slate(65),
    valueHover: slate(95),
    background: slate(12.5),
    backgroundHover: slate(17.5),
    backgroundDisabled: slate(10),
    shadow: `0 0 13px -3px ${slate(0, 0.5)}`,
    border: `1px solid ${slate(5)}`,
    borderFocused: `1px solid ${slate(55)}`,
    on: slate(32.5),
    off: slate(7.5),
  },
  button: {
    label: slate(65),
    labelHover: slate(95),
    labelDisabled: slate(35),
    background: slate(17.5),
    backgroundMinor: slate(15),
    backgroundDisabled: slate(7.5),
    backgroundHover: slate(22.5),
    shadow: `0 0 13px -3px ${slate(0, 0.5)}`,
    border: `1px solid ${slate(5)}`,
  },
  /**
   * Helpers.
   */
  pointer: {
    label: slate(95),
    helper: slate(65),
    background: slate(22.5),
    shadow: `0 0 13px -3px ${slate(0, 0.5)}`,
    border: `none`,
  },
  menu: {
    label: slate(95),
    helper: slate(65),
    background: slate(12.5),
    backgroundHover: slate(17.5),
    border: `1px solid ${slate(10)}`,
    shadow: `0 0 13px -3px ${slate(0, 0.5)}`,
  },
  poster: {
    label: slate(95),
    helper: slate(65),
    background: slate(12.5),
    border: `1px solid ${slate(5)}`,
  },
  empty: {
    label: slate(95),
    helper: slate(65),
    background: slate(12.5),
    shadow: `0 0 13px -3px ${slate(0, 0.5)}`,
    border: `none`,
    cover: slate(5, 0.75),
  },
  focus: {
    label: slate(95),
    helper: slate(65),
    background: slate(7.5),
  },
  toaster: {
    label: slate(95),
    helper: slate(65),
    background: slate(12.5),
    backgroundHover: slate(17.5),
    shadow: `0 0 13px -3px ${slate(0, 0.5)}`,
    border: `1px solid ${slate(55)}`,
  },
}
