/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '$app/components/cards';
import { InputField, SelectField } from '$app/components/forms';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { BusinessTrip } from '$app/common/interfaces/business-trip.interface';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import { CountrySelector } from '$app/components/CountrySelector';
import { CurrencySelector } from '$app/components/CurrencySelector';
import { ProjectSelector } from '$app/components/projects/ProjectSelector';
import { TaskSelector } from '$app/components/tasks/TaskSelector';
import { UserSelector } from '$app/components/users/UserSelector';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '$app/common/colors';
import { TRIP_STATUSES } from '../hooks';
import { BusinessTripStatus } from './BusinessTripStatus';

export interface BusinessTripCardProps {
  businessTrip: BusinessTrip | undefined;
  handleChange: <T extends keyof BusinessTrip>(
    property: T,
    value: BusinessTrip[T]
  ) => void;
  errors?: ValidationBag | undefined;
}

interface Props extends BusinessTripCardProps {
  pageType: 'create' | 'edit';
}

export function BusinessTripForm(props: Props) {
  const [t] = useTranslation();

  const { businessTrip, handleChange, pageType, errors } = props;

  const colors = useColorScheme();

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 xl:col-span-4">
        <Card
          title={t('business_trip')}
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
          isLoading={!businessTrip}
          withContainer
        >
          {businessTrip && pageType === 'edit' && (
            <>
              <Element leftSide={t('status')} noExternalPadding>
                <BusinessTripStatus entity={businessTrip} />
              </Element>

              <InputField
                label={t('trip_number')}
                value={businessTrip.number}
                readOnly
              />
            </>
          )}

          {businessTrip && (
            <UserSelector
              inputLabel={t('traveller')}
              value={businessTrip.assigned_user_id}
              clearButton={Boolean(businessTrip.assigned_user_id)}
              onClearButtonClick={() => handleChange('assigned_user_id', '')}
              onChange={(user) => handleChange('assigned_user_id', user.id)}
              errorMessage={errors?.errors.assigned_user_id}
            />
          )}

          {businessTrip && (
            <ClientSelector
              inputLabel={t('client')}
              value={businessTrip.client_id}
              clearButton={Boolean(businessTrip.client_id)}
              onClearButtonClick={() => {
                handleChange('client_id', '');
                handleChange('project_id', '');
                handleChange('task_id', '');
              }}
              onChange={(client) => {
                handleChange('client_id', client.id);
                handleChange('project_id', '');
                handleChange('task_id', '');
              }}
              errorMessage={errors?.errors.client_id}
            />
          )}

          {businessTrip && (
            <ProjectSelector
              inputLabel={t('project')}
              value={businessTrip.project_id}
              clientId={businessTrip.client_id || undefined}
              clearButton={Boolean(businessTrip.project_id)}
              onClearButtonClick={() => {
                handleChange('project_id', '');
                handleChange('task_id', '');
              }}
              onChange={(project) => {
                handleChange('project_id', project.id);
                handleChange('task_id', '');
              }}
              errorMessage={errors?.errors.project_id}
            />
          )}

          {businessTrip && (
            /* The tasks endpoint has no project filter the TaskSelector exposes,
               so tasks are narrowed by client only. */
            <TaskSelector
              label={t('task') as string}
              defaultValue={businessTrip.task_id}
              clientId={businessTrip.client_id || undefined}
              onValueChange={(task) =>
                handleChange('task_id', task.resource?.id ?? '')
              }
              onClearButtonClick={() => handleChange('task_id', '')}
              errorMessage={errors?.errors.task_id}
            />
          )}

          {businessTrip && (
            <InputField
              label={t('trip_purpose')}
              value={businessTrip.purpose}
              onValueChange={(value) => handleChange('purpose', value)}
              errorMessage={errors?.errors.purpose}
            />
          )}

          {businessTrip && (
            <InputField
              label={t('description')}
              element="textarea"
              value={businessTrip.description}
              onValueChange={(value) => handleChange('description', value)}
              errorMessage={errors?.errors.description}
            />
          )}
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card
          title={t('dates')}
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
          isLoading={!businessTrip}
          withContainer
        >
          {businessTrip && (
            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="date"
                label={t('departure_date')}
                value={businessTrip.departure_date}
                onValueChange={(value) => handleChange('departure_date', value)}
                errorMessage={errors?.errors.departure_date}
              />

              <InputField
                type="time"
                label={t('departure_time')}
                value={businessTrip.departure_time}
                onValueChange={(value) => handleChange('departure_time', value)}
                errorMessage={errors?.errors.departure_time}
              />

              <InputField
                type="date"
                label={t('return_date')}
                value={businessTrip.return_date}
                onValueChange={(value) => handleChange('return_date', value)}
                errorMessage={errors?.errors.return_date}
              />

              <InputField
                type="time"
                label={t('return_time')}
                value={businessTrip.return_time}
                onValueChange={(value) => handleChange('return_time', value)}
                errorMessage={errors?.errors.return_time}
              />
            </div>
          )}

          {businessTrip && (
            <InputField
              label={t('main_destination')}
              value={businessTrip.destination}
              onValueChange={(value) => handleChange('destination', value)}
              errorMessage={errors?.errors.destination}
            />
          )}

          {businessTrip && (
            <CountrySelector
              label={t('country')}
              value={businessTrip.country_id}
              onChange={(id) => handleChange('country_id', id)}
              errorMessage={errors?.errors.country_id}
              dismissable
            />
          )}
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card
          title={t('amount')}
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
          isLoading={!businessTrip}
          withContainer
        >
          {businessTrip && (
            <CurrencySelector
              label={t('currency')}
              value={businessTrip.currency_id}
              onChange={(currency) => handleChange('currency_id', currency)}
              errorMessage={errors?.errors.currency_id}
              dismissable
            />
          )}

          {businessTrip && (
            <NumberInputField
              label={t('planned_amount')}
              value={businessTrip.planned_amount || ''}
              onValueChange={(value) =>
                handleChange('planned_amount', parseFloat(value) || 0)
              }
              errorMessage={errors?.errors.planned_amount}
            />
          )}

          {businessTrip && (
            <NumberInputField
              label={t('actual_amount')}
              value={businessTrip.actual_amount || ''}
              onValueChange={(value) =>
                handleChange('actual_amount', parseFloat(value) || 0)
              }
              errorMessage={errors?.errors.actual_amount}
            />
          )}

          {businessTrip && (
            <SelectField
              label={t('status')}
              value={businessTrip.status_id.toString()}
              onValueChange={(value) =>
                handleChange('status_id', parseInt(value) || 1)
              }
              errorMessage={errors?.errors.status_id}
            >
              {TRIP_STATUSES.map((status) => (
                <option key={status.id} value={status.id.toString()}>
                  {t(status.label)}
                </option>
              ))}
            </SelectField>
          )}

          {businessTrip && (
            <UserSelector
              inputLabel={t('current_approver')}
              value={businessTrip.approver_id}
              clearButton={Boolean(businessTrip.approver_id)}
              onClearButtonClick={() => handleChange('approver_id', '')}
              onChange={(user) => handleChange('approver_id', user.id)}
              errorMessage={errors?.errors.approver_id}
            />
          )}

          {businessTrip && (
            <InputField
              label={t('public_notes')}
              element="textarea"
              value={businessTrip.public_notes}
              onValueChange={(value) => handleChange('public_notes', value)}
              errorMessage={errors?.errors.public_notes}
            />
          )}

          {businessTrip && (
            <InputField
              label={t('private_notes')}
              element="textarea"
              value={businessTrip.private_notes}
              onValueChange={(value) => handleChange('private_notes', value)}
              errorMessage={errors?.errors.private_notes}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
