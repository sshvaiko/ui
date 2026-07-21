/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { useQuery } from 'react-query';
import { BusinessTrip } from '$app/common/interfaces/business-trip.interface';

interface BusinessTripParams {
  id: string | undefined;
  enabled?: boolean;
}

export function useBusinessTripQuery(params: BusinessTripParams) {
  return useQuery<BusinessTrip>(
    ['/api/v1/business_trips', params.id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/business_trips/:id', { id: params.id })
      ).then((response) => response.data.data),
    { enabled: params.enabled ?? true, staleTime: Infinity }
  );
}

export function blankBusinessTrip(): BusinessTrip {
  return {
    id: '',
    user_id: '',
    assigned_user_id: '',
    client_id: '',
    project_id: '',
    task_id: '',
    approver_id: '',
    number: '',
    purpose: '',
    description: '',
    departure_date: '',
    departure_time: '',
    return_date: '',
    return_time: '',
    destination: '',
    country_id: '',
    currency_id: '',
    planned_amount: 0,
    actual_amount: 0,
    status_id: 1,
    public_notes: '',
    private_notes: '',
    segments: [],
    is_deleted: false,
    updated_at: 0,
    archived_at: 0,
    created_at: 0,
    entity_type: 'business_trip',
    documents: [],
  };
}
