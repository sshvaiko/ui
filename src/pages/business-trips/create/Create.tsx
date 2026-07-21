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
import { BusinessTrip } from '$app/common/interfaces/business-trip.interface';
import { blankBusinessTrip } from '$app/common/queries/business-trips';
import { Default } from '$app/components/layouts/Default';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { toast } from '$app/common/helpers/toast/toast';
import { useNavigate } from 'react-router-dom';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { AxiosError } from 'axios';
import { route } from '$app/common/helpers/route';
import { useAtom } from 'jotai';
import { businessTripAtom } from '../common/atoms';
import { useHandleChange } from '../common/hooks';
import { $refetch } from '$app/common/hooks/useRefetch';
import { BusinessTripForm } from '../common/components/BusinessTripForm';
import { SegmentsTable } from '../common/components/SegmentsTable';

export default function Create() {
  const { documentTitle } = useTitle('new_business_trip');
  const [t] = useTranslation();

  const navigate = useNavigate();

  const pages = [
    { name: t('business_trips'), href: '/business_trips' },
    { name: t('new_business_trip'), href: '/business_trips/create' },
  ];

  const [businessTrip, setBusinessTrip] = useAtom(businessTripAtom);
  const [errors, setErrors] = useState<ValidationBag>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const handleChange = useHandleChange({ setBusinessTrip, setErrors });

  const onSave = () => {
    if (!isFormBusy) {
      toast.processing();
      setErrors(undefined);
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/business_trips'), businessTrip)
        .then((response: GenericSingleResourceResponse<BusinessTrip>) => {
          toast.success('created_business_trip');

          $refetch(['business_trips']);

          navigate(
            route('/business_trips/:id/edit', { id: response.data.data.id })
          );
        })
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            setErrors(error.response.data);
            toast.dismiss();
          }
        })
        .finally(() => setIsFormBusy(false));
    }
  };

  useEffect(() => {
    setBusinessTrip(blankBusinessTrip());
  }, []);

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      onSaveClick={() => businessTrip && onSave()}
      disableSaveButton={isFormBusy}
    >
      <div className="space-y-4">
        <BusinessTripForm
          businessTrip={businessTrip}
          handleChange={handleChange}
          pageType="create"
          errors={errors}
        />

        <SegmentsTable
          businessTrip={businessTrip}
          handleChange={handleChange}
        />
      </div>
    </Default>
  );
}
