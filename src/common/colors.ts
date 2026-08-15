/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useAtomValue } from 'jotai';

import { gomDarkModeAtom } from './gom/atoms';
import { useReactSettingsField } from './hooks/useReactSettings';

// export const $1 = {
//   name: 'invoiceninja.dark',
//   $0: 'dark',
//   $1: '#182433',
//   $2: '#151f2c',
//   $3: '#ffffff',
//   $4: '#1f2e41',
//   $5: '#1f2e41',
//   $6: '#151f2c',
//   $7: '#151f2c',
//   $8: '#1f2e41',
//   $9: '#ffffff',
// };

/* gom: dark scheme nudged from flat #121212 toward a deep blue-black
   (reference: modern finance dashboards) — same slots, calmer surfaces. */
export const darkColorScheme = {
  name: 'invoiceninja.dark',
  $0: 'dark',
  $1: '#0E1116',
  $2: '#0E1116',
  $3: '#E7EAF0',
  $4: '#1E2630',
  $5: '#1E2630',
  $6: '#0E1116',
  $7: '#151B23',
  $8: '#1E2630',
  $9: '#ffffff',
  $10: 0.87, // High emphasis text
  $11: 0.6, // Medium emphasis text
  $12: 0.38, // Disabled text
  $13: '#E5E7EB', // Navbar right icon hover
  $14: '#0B0E12', // Navigation bar background color
  $15: '#242B33', // Light gray background
  $16: '#A1A1AA', // Dark gray icon
  $17: '#9D9DA8', // Placeholder text, table header text color
  $18: '#FFFFFF', // Button background color
  $19: '#242B33', // Light border color
  $20: '#242B33', // Dropdown element hover background color
  $21: '#1E2630', // Divider color
  $22: '#a1a1aa', // Label color
  $23: '#0E1116', // Content background color
  $24: '#242B33', // Border color
  $25: '#151A21', // Hover element background color
  $26: '#FFFFFF', // gom: sidebar item text/icon (active)
  $27: '#9BA1AA', // gom: sidebar item text/icon (inactive)
  $28: '#1E2630', // gom: sidebar active item background
};

/* gom: light scheme aligned with the Green0meter platform
   (green0meter-app/src/theme — bg #F5F5F5, hairline #00000014 borders,
   near-black #262626 primary buttons, white sidebar). */
export const lightColorScheme = {
  name: 'invoiceninja.light',
  $0: 'light',
  $1: '#ffffff', // Primary background
  $2: '#F5F5F5', // Secondary background
  $3: '#101827', // Primary text
  $4: '#EBECEF', // Primary border
  $5: '#E7E8EC', // Secondary border (sidebar)
  $6: '#242930', // Secondary background
  $7: '#F4F5F8', // Primary hover
  $8: '#E6F5ED', // Secondary hover (platform primary tint)
  $9: '#ffffff', // Accent color text
  $10: 1, // High emphasis text
  $11: 0.8, // Secondary text opacity
  $12: 0.5, // Disabled text opacity
  $13: '#E5E7EB', // Navbar right icon hover
  $14: '#FFFFFF', // Navigation bar background color (gom: white sidebar)
  $15: '#EEEEF1', // Light gray background
  $16: '#62697C', // Dark gray icon
  $17: '#8A91A5', // Placeholder text, table header text color
  $18: '#262626', // Button background color (platform primary button)
  $19: '#09090B12', // Light border color
  $20: '#09090B13', // Dropdown element hover background color
  $21: '#00000014', // Divider color
  $22: '#62697C', // Label color
  $23: '#F5F5F5', // Content background color
  $24: '#00000021', // Border color
  $25: '#FAFAFB', // Hover element background color
  $26: '#26794C', // gom: sidebar item text/icon (active)
  $27: '#4F5668', // gom: sidebar item text/icon (inactive)
  $28: '#E6F5ED', // gom: sidebar active item background
};

export function useColorScheme() {
  const darkMode = useReactSettingsField('dark_mode');

  /* gom: a theme forced by the Green0meter host wins over the preference. */
  const gomDarkMode = useAtomValue(gomDarkModeAtom);
  const isDark = gomDarkMode !== null ? gomDarkMode : darkMode;

  return isDark ? darkColorScheme : lightColorScheme;
}
