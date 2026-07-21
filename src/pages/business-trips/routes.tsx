/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Route } from 'react-router-dom';
import { lazy } from 'react';

const BusinessTrips = lazy(
  () => import('$app/pages/business-trips/index/BusinessTrips')
);
const Create = lazy(() => import('$app/pages/business-trips/create/Create'));
const BusinessTrip = lazy(
  () => import('$app/pages/business-trips/BusinessTrip')
);
const Edit = lazy(() => import('$app/pages/business-trips/edit/Edit'));
const Documents = lazy(
  () => import('$app/pages/business-trips/documents/Documents')
);

/* PoC: guardless — reachable only by admins through the Green0meter embed. */
export const businessTripRoutes = (
  <Route path="business_trips">
    <Route path="" element={<BusinessTrips />} />
    <Route path="create" element={<Create />} />
    <Route path=":id" element={<BusinessTrip />}>
      <Route path="edit" element={<Edit />} />
      <Route path="documents" element={<Documents />} />
    </Route>
  </Route>
);
