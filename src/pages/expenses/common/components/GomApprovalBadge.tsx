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
import { GomExpenseApproval } from '$app/common/interfaces/gom-expense-approval.interface';

interface Props {
  approval: GomExpenseApproval | undefined;
}

export function GomApprovalBadge(props: Props) {
  const [t] = useTranslation();

  const { approval } = props;

  if (approval?.status === 1) {
    return <Badge withDot variant="yellow">{t('gom_approval_requested')}</Badge>;
  }

  if (approval?.status === 2) {
    return <Badge withDot variant="green">{t('gom_approval_approved')}</Badge>;
  }

  if (approval?.status === 3) {
    return <Badge withDot variant="red">{t('gom_approval_rejected')}</Badge>;
  }

  return <Badge withDot variant="generic">{t('gom_approval_none')}</Badge>;
}
