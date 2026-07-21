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
import { useOutletContext } from 'react-router-dom';
import { useHandleChange } from '../common/hooks';
import { BusinessTripForm } from '../common/components/BusinessTripForm';
import { SegmentsTable } from '../common/components/SegmentsTable';

export interface Context {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  businessTrip: BusinessTrip;
  setBusinessTrip: Dispatch<SetStateAction<BusinessTrip | undefined>>;
}

export default function Edit() {
  const context: Context = useOutletContext();

  const { errors, setErrors, businessTrip, setBusinessTrip } = context;

  const handleChange = useHandleChange({ setBusinessTrip, setErrors });

  return (
    <div className="space-y-4">
      <BusinessTripForm
        businessTrip={businessTrip}
        handleChange={handleChange}
        pageType="edit"
        errors={errors}
      />

      <SegmentsTable businessTrip={businessTrip} handleChange={handleChange} />
    </div>
  );
}
