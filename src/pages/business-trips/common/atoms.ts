/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { BusinessTrip } from '$app/common/interfaces/business-trip.interface';
import { atom } from 'jotai';

export const businessTripAtom = atom<BusinessTrip | undefined>(undefined);
