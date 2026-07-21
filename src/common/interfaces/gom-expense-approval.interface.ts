/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface GomExpenseApproval {
  id: string;
  expense_id: string;
  status: number; // 1 = requested, 2 = approved, 3 = rejected
  approver_id: string;
  requested_by_id: string;
  approver_name: string;
  requested_by_name: string;
  note: string;
  acted_at: number | null;
  updated_at: number;
}
