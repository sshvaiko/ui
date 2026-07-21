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
import { DocumentsTable } from '$app/components/DocumentsTable';
import { Upload } from '$app/pages/settings/company/documents/components';
import { useOutletContext } from 'react-router-dom';
import { Context } from '../edit/Edit';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useTranslation } from 'react-i18next';
import { Card } from '$app/components/cards';
import { useColorScheme } from '$app/common/colors';

export default function Documents() {
  const [t] = useTranslation();

  const context: Context = useOutletContext();
  const { businessTrip } = context;

  const colors = useColorScheme();

  const invalidateCache = () => {
    $refetch(['business_trips']);
  };

  return (
    <Card
      title={t('documents')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      <div className="flex flex-col items-center w-full px-6 py-2">
        <div className="w-full lg:w-2/3">
          <Upload
            widgetOnly
            endpoint={endpoint('/api/v1/business_trips/:id/upload', {
              id: businessTrip.id,
            })}
            onSuccess={invalidateCache}
          />
        </div>

        <div className="w-full lg:w-2/3">
          <DocumentsTable
            documents={businessTrip?.documents || []}
            onDocumentDelete={invalidateCache}
          />
        </div>
      </div>
    </Card>
  );
}
