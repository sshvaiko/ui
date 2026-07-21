/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Document } from './document.interface';

export interface BusinessTripSegment {
  start_location: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  arrival_date: string;
  arrival_time: string;
  transport_type: string;
  vehicle: string;
  distance_km: number | '';
  purpose: string;
  notes: string;
}

export interface BusinessTrip {
  id: string;
  user_id: string;
  assigned_user_id: string;
  client_id: string;
  project_id: string;
  task_id: string;
  approver_id: string;
  number: string;
  purpose: string;
  description: string;
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  destination: string;
  country_id: string;
  currency_id: string;
  planned_amount: number;
  actual_amount: number;
  status_id: number;
  public_notes: string;
  private_notes: string;
  segments: BusinessTripSegment[];
  is_deleted: boolean;
  updated_at: number;
  archived_at: number;
  created_at: number;
  entity_type: string;
  documents: Document[];
}
