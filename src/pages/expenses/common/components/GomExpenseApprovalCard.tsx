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

/* gom: initials avatar chip — 28px tinted circle + name */
function GomPersonChip(props: { name: string }) {
  const scheme = useColorScheme();
  const initials = props.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className="flex items-center space-x-2">
      <span
        className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium flex-shrink-0"
        style={{
          backgroundColor:
            scheme.$0 === 'dark' ? 'rgba(58, 172, 111, 0.18)' : '#E6F5ED',
          color: scheme.$0 === 'dark' ? '#77C499' : '#26794C',
        }}
      >
        {initials}
      </span>
      <span className="truncate">{props.name}</span>
    </div>
  );
}

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
          <GomPersonChip name={approval.approver_name} />
        </Element>
      )}

      {approval?.requested_by_name && (
        <Element leftSide={t('user')} noExternalPadding>
          <GomPersonChip name={approval.requested_by_name} />
        </Element>
      )}

      {approval?.note && (
        <Element leftSide={t('gom_approval_note')} noExternalPadding>
          <div
            className="border-l-2 pl-3 py-0.5 text-sm"
            style={{ borderColor: '#3AAC6F', color: colors.$22 }}
          >
            {approval.note}
          </div>
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
            destructive
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
