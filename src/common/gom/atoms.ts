/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { atom } from 'jotai';

/** Locale forced by the Green0meter host app; null = use the user/company setting. */
export const gomLocaleAtom = atom<string | null>(null);

/** Dark mode forced by the Green0meter host app; null = use the user preference. */
export const gomDarkModeAtom = atom<boolean | null>(null);

/** Whether the app runs embedded inside the Green0meter platform iframe. */
export const gomEmbedAtom = atom<boolean>(false);
