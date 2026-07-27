/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Badge } from '$app/components/Badge';
import { useTranslation } from 'react-i18next';
import { BusinessTrip } from '$app/common/interfaces/business-trip.interface';

interface Props {
  entity: BusinessTrip;
}

export function BusinessTripStatus(props: Props) {
  const [t] = useTranslation();

  const { status_id, archived_at, is_deleted } = props.entity;

  if (is_deleted) {
    return <Badge withDot variant="red">{t('deleted')}</Badge>;
  }

  if (archived_at) {
    return <Badge withDot variant="orange">{t('archived')}</Badge>;
  }

  if (status_id === 2) {
    return <Badge withDot variant="yellow">{t('trip_status_requested')}</Badge>;
  }

  if (status_id === 3) {
    return <Badge withDot variant="green">{t('trip_status_approved')}</Badge>;
  }

  if (status_id === 4) {
    return <Badge withDot variant="red">{t('trip_status_rejected')}</Badge>;
  }

  if (status_id === 5) {
    return <Badge withDot variant="light-blue">{t('trip_status_settled')}</Badge>;
  }

  return <Badge withDot variant="generic">{t('trip_status_draft')}</Badge>;
}
