/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { useTitle } from '$app/common/hooks/useTitle';
import { BusinessTrip as BusinessTripType } from '$app/common/interfaces/business-trip.interface';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBusinessTripQuery } from '$app/common/queries/business-trips';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { Tab, Tabs } from '$app/components/Tabs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { Spinner } from '$app/components/Spinner';
import { DocumentsTabLabel } from '$app/components/DocumentsTabLabel';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { toast } from '$app/common/helpers/toast/toast';
import { AxiosError } from 'axios';
import { $refetch } from '$app/common/hooks/useRefetch';

export default function BusinessTrip() {
  const [t] = useTranslation();

  const { documentTitle } = useTitle('business_trip');

  const { id } = useParams();
  const { data } = useBusinessTripQuery({ id });

  const pages: Page[] = [
    { name: t('business_trips'), href: '/business_trips' },
    {
      name: t('business_trip'),
      href: route('/business_trips/:id/edit', { id }),
    },
  ];

  const [errors, setErrors] = useState<ValidationBag>();
  const [businessTrip, setBusinessTrip] = useState<BusinessTripType>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const tabs: Tab[] = [
    {
      name: t('edit'),
      href: route('/business_trips/:id/edit', { id }),
    },
    {
      name: t('documents'),
      href: route('/business_trips/:id/documents', { id }),
      formatName: () => (
        <DocumentsTabLabel
          numberOfDocuments={businessTrip?.documents?.length}
        />
      ),
    },
  ];

  const save = (trip: BusinessTripType) => {
    if (isFormBusy) {
      return;
    }

    toast.processing();
    setErrors(undefined);
    setIsFormBusy(true);

    request(
      'PUT',
      endpoint('/api/v1/business_trips/:id', { id: trip.id }),
      trip
    )
      .then(() => {
        toast.success('updated_business_trip');

        $refetch(['business_trips']);
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data);
          toast.dismiss();
        }
      })
      .finally(() => setIsFormBusy(false));
  };

  useEffect(() => {
    if (data) {
      setBusinessTrip(data);
    }
  }, [data]);

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      onSaveClick={() => businessTrip && save(businessTrip)}
      disableSaveButton={!businessTrip || isFormBusy}
    >
      {businessTrip ? (
        <div className="space-y-4">
          <Tabs tabs={tabs} />

          <Outlet
            context={{
              errors,
              setErrors,
              businessTrip,
              setBusinessTrip,
            }}
          />
        </div>
      ) : (
        <Spinner />
      )}
    </Default>
  );
}
