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
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import CommonProps from '../../common/interfaces/common-props.interface';
import { Spinner } from '../Spinner';
import { styled } from 'styled-components';
import { useColorScheme } from '$app/common/colors';

interface Props extends CommonProps {
  children?: ReactNode;
  variant?: 'block';
  disabled?: boolean;
  destructive?: boolean;
  type?: 'primary' | 'secondary' | 'minimal';
  onClick?: any;
  to?: string;
  behavior?: 'button' | 'submit';
  disableWithoutIcon?: boolean;
  noBackgroundColor?: boolean;
  form?: string;
}

const defaultProps: Props = {
  type: 'primary',
  behavior: 'submit',
};

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color} !important;
  background-color: ${(props) => props.theme.backgroundColor} !important;
  border-color: ${(props) => props.theme.borderColor} !important;

  &:hover {
    background-color: ${(props) => props.theme.hoverColor} !important;
  }
`;

const StyledButton = styled.button`
  color: ${(props) => props.theme.color} !important;
  border-color: ${(props) => props.theme.borderColor} !important;
  background-color: ${(props) => props.theme.backgroundColor} !important;

  &:hover {
    background-color: ${(props) => props.theme.hoverColor} !important;
  }
`;

export function Button(props: Props) {
  props = { ...defaultProps, ...props };

  const colors = useColorScheme();
  const accentColor = useAccentColor();

  /* gom: hover shade for the default platform accent; custom accents keep flat hover */
  const accentHoverColor =
    accentColor.toLowerCase() === '#26794c' ? '#195A37' : accentColor;
  const destructiveColor = colors.$0 === 'dark' ? '#E57373' : '#D32F2F';
  const secondaryTextColor = props.destructive ? destructiveColor : colors.$3;

  const css: React.CSSProperties = {
    backgroundColor: props.noBackgroundColor ? 'transparent' : undefined,
    color:
      props.type !== 'primary' && props.type !== 'secondary'
        ? props.destructive
          ? destructiveColor
          : accentColor
        : '',
  };

  if (props.to) {
    return (
      <StyledLink
        to={props.to}
        theme={{
          backgroundColor: props.type === 'primary' ? accentColor : colors.$1,
          color: props.type === 'primary' ? '#FFFFFF' : secondaryTextColor,
          borderColor: props.type === 'primary' ? 'transparent' : colors.$24,
          hoverColor: props.type === 'primary' ? accentHoverColor : colors.$7,
        }}
        className={classNames(
          `border inline-flex items-center space-x-2 px-4 justify-center rounded-md text-sm motion-safe:transition-colors motion-safe:duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3AAC6F]/40 ${props.className}`,
          {
            'py-2 px-4': props.type !== 'minimal',
            'w-full': props.variant === 'block',
            'p-0 m-0': props.type === 'minimal',
            'opacity-75 pointer-events-none': props.disabled,
            'font-semibold': props.type === 'primary',
            'font-medium': props.type !== 'primary',
          }
        )}
        style={css}
      >
        {props.disabled && !props.disableWithoutIcon ? (
          <Spinner variant="light" />
        ) : (
          props.children
        )}
      </StyledLink>
    );
  }

  return (
    <StyledButton
      type={props.behavior}
      disabled={props.disabled}
      theme={{
        backgroundColor: props.type === 'primary' ? accentColor : colors.$1,
        color: props.type === 'primary' ? '#FFFFFF' : secondaryTextColor,
        borderColor: props.type === 'primary' ? 'transparent' : colors.$24,
        hoverColor: props.type === 'primary' ? accentHoverColor : colors.$7,
      }}
      className={classNames(
        `border inline-flex items-center space-x-2 px-4 justify-center rounded-md text-sm motion-safe:transition-colors motion-safe:duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3AAC6F]/40 ${props.className} disabled:cursor-not-allowed disabled:opacity-75`,
        {
          'py-2 px-4': props.type !== 'minimal',
          'w-full': props.variant === 'block',
          'p-0 m-0': props.type === 'minimal',
          'font-semibold': props.type === 'primary',
          'font-medium': props.type !== 'primary',
        }
      )}
      style={css}
      onClick={props.onClick}
      form={props.form}
    >
      {props.disabled && !props.disableWithoutIcon ? (
        <Spinner variant="light" />
      ) : (
        props.children
      )}
    </StyledButton>
  );
}
