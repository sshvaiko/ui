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
import { toast } from '$app/common/helpers/toast/toast';
import { $refetch } from '$app/common/hooks/useRefetch';
import { Expense } from '$app/common/interfaces/expense';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useExpenseApprovalsQuery } from '$app/common/queries/gom-expense-approvals';
import { Card, Element } from '$app/components/cards';
import { Button, InputField } from '$app/components/forms';
import { UserSelector } from '$app/components/users/UserSelector';
import { useColorScheme } from '$app/common/colors';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GomApprovalBadge } from './GomApprovalBadge';

interface Props {
  expense: Expense;
}

type ApprovalAction = 'submit' | 'approve' | 'reject';

export function GomExpenseApprovalCard(props: Props) {
  const [t] = useTranslation();

  const { expense } = props;

  const colors = useColorScheme();

  const { byExpenseId, isLoading } = useExpenseApprovalsQuery();

  const approval = byExpenseId[expense.id];

  const [approverId, setApproverId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const canSubmit = !approval || approval.status === 3;
  const canAct = approval?.status === 1;

  const handleAction = (action: ApprovalAction) => {
    if (isFormBusy) {
      return;
    }

    toast.processing();
    setIsFormBusy(true);

    const body: { approver_id?: string; note?: string } = {
      ...(action === 'submit' && { approver_id: approverId }),
      ...(note && { note }),
    };

    request(
      'PUT',
      endpoint(`/api/v1/gom_expense_approvals/:expense_id/${action}`, {
        expense_id: expense.id,
      }),
      body
    )
      .then(() => {
        toast.success(
          action === 'submit' ? 'gom_approval_submitted' : 'gom_approval_updated'
        );

        setNote('');

        $refetch(['gom_expense_approvals']);
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => setIsFormBusy(false));
  };

  return (
    <Card
      title={t('gom_approval')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
      isLoading={isLoading}
      withContainer
    >
      <Element leftSide={t('status')} noExternalPadding>
        <GomApprovalBadge approval={approval} />
      </Element>

      {approval?.approver_name && (
        <Element leftSide={t('gom_approver')} noExternalPadding>
          {approval.approver_name}
        </Element>
      )}

      {approval?.requested_by_name && (
        <Element leftSide={t('user')} noExternalPadding>
          {approval.requested_by_name}
        </Element>
      )}

      {approval?.note && (
        <Element leftSide={t('gom_approval_note')} noExternalPadding>
          {approval.note}
        </Element>
      )}

      {canSubmit && (
        <UserSelector
          inputLabel={t('gom_approver')}
          value={approverId}
          clearButton={Boolean(approverId)}
          onClearButtonClick={() => setApproverId('')}
          onChange={(user) => setApproverId(user.id)}
        />
      )}

      {(canSubmit || canAct) && (
        <InputField
          label={t('gom_approval_note')}
          value={note}
          onValueChange={(value) => setNote(value)}
        />
      )}

      {canSubmit && (
        <div className="flex justify-end">
          <Button
            behavior="button"
            onClick={() => handleAction('submit')}
            disabled={isFormBusy || !approverId}
            disableWithoutIcon
          >
            {t('gom_submit_approval')}
          </Button>
        </div>
      )}

      {canAct && (
        <div className="flex justify-end space-x-2">
          <Button
            behavior="button"
            type="secondary"
            onClick={() => handleAction('reject')}
            disabled={isFormBusy}
            disableWithoutIcon
          >
            {t('gom_reject')}
          </Button>

          <Button
            behavior="button"
            onClick={() => handleAction('approve')}
            disabled={isFormBusy}
            disableWithoutIcon
          >
            {t('gom_approve')}
          </Button>
        </div>
      )}
    </Card>
  );
}
