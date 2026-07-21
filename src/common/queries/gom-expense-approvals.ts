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
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { GomExpenseApproval } from '$app/common/interfaces/gom-expense-approval.interface';

export function useExpenseApprovalsQuery() {
  const query = useQuery<GomExpenseApproval[]>(
    '/api/v1/gom_expense_approvals',
    () =>
      request('GET', endpoint('/api/v1/gom_expense_approvals')).then(
        (response) => response.data.data
      ),
    { staleTime: 30 * 1000 }
  );

  const byExpenseId = useMemo(() => {
    const lookup: Record<string, GomExpenseApproval> = {};

    (query.data ?? []).forEach((approval) => {
      lookup[approval.expense_id] = approval;
    });

    return lookup;
  }, [query.data]);

  return { ...query, byExpenseId };
}
