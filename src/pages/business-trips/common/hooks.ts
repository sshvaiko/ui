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
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Dispatch, SetStateAction } from 'react';

export const TRANSPORT_TYPES = [
  'company_car',
  'private_car',
  'train',
  'plane',
  'public_transport',
  'taxi',
  'walking',
  'transport_other',
] as const;

export const TRIP_STATUSES: { id: number; label: string }[] = [
  { id: 1, label: 'trip_status_draft' },
  { id: 2, label: 'trip_status_requested' },
  { id: 3, label: 'trip_status_approved' },
  { id: 4, label: 'trip_status_rejected' },
  { id: 5, label: 'trip_status_settled' },
];

interface HandleChangeBusinessTripParams {
  setBusinessTrip: Dispatch<SetStateAction<BusinessTrip | undefined>>;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function useHandleChange(params: HandleChangeBusinessTripParams) {
  const { setBusinessTrip, setErrors } = params;

  return <T extends keyof BusinessTrip>(
    property: T,
    value: BusinessTrip[typeof property]
  ) => {
    setErrors(undefined);

    setBusinessTrip(
      (businessTrip) => businessTrip && { ...businessTrip, [property]: value }
    );
  };
}
