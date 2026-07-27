/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import classNames from 'classnames';
import { useAccentColor } from '$app/common/hooks/useAccentColor';
import { useColorScheme } from '$app/common/colors';
import CommonProps from '../common/interfaces/common-props.interface';
import {
  hexToRGB,
  isColorLight,
  useAdjustColorDarkness,
} from '$app/common/hooks/useAdjustColorDarkness';

export type BadgeVariant =
  | 'primary'
  | 'white'
  | 'yellow'
  | 'red'
  | 'generic'
  | 'light-blue'
  | 'blue'
  | 'orange'
  | 'dark-blue'
  | 'green'
  | 'black'
  | 'purple'
  | 'transparent'
  | 'teal';

interface Props extends CommonProps {
  variant?: BadgeVariant;
  withDot?: boolean;
}

const defaultProps: Props = {
  variant: 'generic',
};

export function Badge(props: Props) {
  props = { ...defaultProps, ...props };

  const accentColor = useAccentColor();

  const adjustColorDarkness = useAdjustColorDarkness();

  const styles: React.CSSProperties = { ...props.style };

  if (props.variant === 'primary') {
    const { red, green, blue } = hexToRGB(
      styles.backgroundColor || accentColor
    );

    styles.backgroundColor = `rgba(${red}, ${green}, ${blue}, 0.15)`;
    styles.color = `rgba(${red}, ${green}, ${blue}, 1)`;
  }

  const getTextContrastColor = (color: string) => {
    if (color.length === 7) {
      const { red, green, blue, hex } = hexToRGB(color);

      const darknessAmount = isColorLight(red, green, blue) ? -220 : 220;

      return adjustColorDarkness(hex, darknessAmount);
    }

    return undefined;
  };

  /* gom: platform tint pairs (green0meter customPalette) — 50-shade bg with
     700-shade text in light mode; translucent bg with 300-shade text in dark. */
  const scheme = useColorScheme();

  const variantColors: Partial<
    Record<NonNullable<Props['variant']>, { bg: string; text: string }>
  > =
    scheme.$0 === 'dark'
      ? {
          generic: { bg: 'rgba(161, 161, 170, 0.14)', text: '#A1A1AA' },
          white: { bg: 'rgba(255, 255, 255, 0.06)', text: '#A1A1AA' },
          yellow: { bg: 'rgba(255, 175, 76, 0.16)', text: '#FFBD66' },
          orange: { bg: 'rgba(235, 121, 52, 0.16)', text: '#FFAF4C' },
          red: { bg: 'rgba(239, 83, 80, 0.16)', text: '#E57373' },
          'light-blue': { bg: 'rgba(100, 181, 246, 0.16)', text: '#90CAF9' },
          blue: { bg: 'rgba(66, 165, 245, 0.16)', text: '#64B5F6' },
          'dark-blue': { bg: 'rgba(79, 134, 178, 0.2)', text: '#7DA8CD' },
          green: { bg: 'rgba(89, 184, 132, 0.16)', text: '#77C499' },
          black: { bg: 'rgba(189, 189, 189, 0.16)', text: '#BDBDBD' },
          purple: { bg: 'rgba(119, 137, 234, 0.18)', text: '#A0ABF0' },
          teal: { bg: 'rgba(91, 191, 178, 0.16)', text: '#5BBFB2' },
        }
      : {
          generic: { bg: '#F5F5F5', text: '#616161' },
          white: { bg: '#FFFFFF', text: '#616161' },
          yellow: { bg: '#FFF4E4', text: '#F38837' },
          orange: { bg: '#FFF4E4', text: '#EB7934' },
          red: { bg: '#FFEBEE', text: '#D32F2F' },
          'light-blue': { bg: '#E3F2FD', text: '#1976D2' },
          blue: { bg: '#E3F2FD', text: '#1565C0' },
          'dark-blue': { bg: '#E8F1F8', text: '#0D3E62' },
          green: { bg: '#E6F5ED', text: '#2B8B58' },
          black: { bg: '#EEEEEE', text: '#424242' },
          purple: { bg: '#E9EBFB', text: '#2B4AD3' },
          teal: { bg: '#E2F4F2', text: '#228372' },
        };

  const pair = props.variant ? variantColors[props.variant] : undefined;

  return (
    <span
      style={{
        backgroundColor: pair?.bg,
        ...styles,
        color: styles.backgroundColor
          ? getTextContrastColor(styles.backgroundColor)
          : pair?.text,
      }}
      className={classNames(
        'text-xs px-2.5 py-1 rounded-full font-medium',
        {
          'bg-transparent': props.variant === 'transparent',
          border: props.variant === 'white',
          'bg-opacity-15': props.variant === 'primary',
        },
        props.className
      )}
    >
      {props.withDot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
          style={{ backgroundColor: 'currentColor' }}
        />
      )}
      {props.children}
    </span>
  );
}
