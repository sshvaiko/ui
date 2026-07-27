/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Link } from '../../../components/forms/Link';
import { useColorScheme } from '$app/common/colors';

/* gom: quiet Greenometer text lockup instead of the Invoice Ninja logo */
export function Header() {
  const colors = useColorScheme();

  return (
    <>
      <div className="flex justify-center py-8">
        <Link to="/">
          <span
            className="text-2xl font-semibold tracking-tight"
            style={{ color: colors.$0 === 'dark' ? '#FFFFFF' : '#101827' }}
          >
            Greenometer
          </span>
        </Link>
      </div>
    </>
  );
}
