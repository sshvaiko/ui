/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from '$app/common/hooks/useTitle';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { Default } from '$app/components/layouts/Default';
import { useTranslation } from 'react-i18next';
import { date } from '$app/common/helpers';
import { route } from '$app/common/helpers/route';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { BusinessTrip } from '$app/common/interfaces/business-trip.interface';
import { DynamicLink } from '$app/components/DynamicLink';
import { BusinessTripStatus } from '../common/components/BusinessTripStatus';

export default function BusinessTrips() {
  useTitle('business_trips');

  const [t] = useTranslation();

  const { dateFormat } = useCurrentCompanyDateFormats();
  const formatMoney = useFormatMoney();

  const pages = [{ name: t('business_trips'), href: '/business_trips' }];

  const columns: DataTableColumns<BusinessTrip> = [
    {
      id: 'number',
      label: t('trip_number'),
      format: (value, businessTrip) => (
        <DynamicLink
          to={route('/business_trips/:id/edit', { id: businessTrip.id })}
          renderSpan={false}
        >
          {value}
        </DynamicLink>
      ),
    },
    {
      id: 'status_id',
      label: t('status'),
      format: (_, businessTrip) => <BusinessTripStatus entity={businessTrip} />,
    },
    {
      id: 'purpose',
      label: t('trip_purpose'),
    },
    {
      id: 'destination',
      label: t('main_destination'),
    },
    {
      id: 'departure_date',
      label: t('departure_date'),
      format: (value) => (value ? date(value.toString(), dateFormat) : ''),
    },
    {
      id: 'return_date',
      label: t('return_date'),
      format: (value) => (value ? date(value.toString(), dateFormat) : ''),
    },
    {
      id: 'planned_amount',
      label: t('planned_amount'),
      format: (value, businessTrip) =>
        formatMoney(value, undefined, businessTrip.currency_id),
    },
    {
      id: 'actual_amount',
      label: t('actual_amount'),
      format: (value, businessTrip) =>
        formatMoney(value, undefined, businessTrip.currency_id),
    },
  ];

  return (
    <Default title={t('business_trips')} breadcrumbs={pages}>
      <DataTable
        resource="business_trip"
        endpoint="/api/v1/business_trips?sort=id|desc"
        columns={columns}
        bulkRoute="/api/v1/business_trips/bulk"
        linkToCreate="/business_trips/create"
        linkToEdit="/business_trips/:id/edit"
        withResourcefulActions
      />
    </Default>
  );
}
