/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

/* Green0meter embed bridge: token-injection auth + locale/theme/navigation
 * sync with the host platform. Inert unless the app runs inside an iframe.
 * Replaces the DOM-driving auto-login that previously lived in the
 * nginx-injected gom-embed.js. */

import { getDefaultStore } from 'jotai';
import { gomDarkModeAtom, gomEmbedAtom, gomLocaleAtom } from './atoms';

const ALLOWED = [
  'https://app.greenometer.com',
  'https://app2-stage.green0meter.com',
  'http://localhost:5173',
];

const AZURE_STATIC_RE =
  /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.azurestaticapps\.net$/;

const TOKEN_KEY = 'X-NINJA-TOKEN';
const BOOT_TIMEOUT_MS = 8000;
const GOM_HASH_KEYS = ['gom_token', 'gom_locale', 'gom_dark'];

interface GomAuthPayload {
  token?: string;
  locale?: string;
  dark?: boolean;
}

function isAllowedOrigin(origin: string) {
  return ALLOWED.includes(origin) || AZURE_STATIC_RE.test(origin);
}

function isEmbedded() {
  return window.self !== window.top;
}

function seedPreferences(payload: GomAuthPayload) {
  const store = getDefaultStore();

  if (typeof payload.locale === 'string' && payload.locale.length > 0) {
    store.set(gomLocaleAtom, payload.locale);
  }

  if (typeof payload.dark === 'boolean') {
    store.set(gomDarkModeAtom, payload.dark);
  }
}

function applyToken(token: string) {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.setItem(TOKEN_KEY, token);
}

/** Reads gom_* params from the location hash and strips them, preserving any
 * other hash content the router may own. */
function consumeHashPayload(): GomAuthPayload | null {
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.substring(1)
    : window.location.hash;

  if (!hash.includes('gom_token') && !hash.includes('gom_locale')) {
    return null;
  }

  const params = new URLSearchParams(hash);
  const token = params.get('gom_token') ?? undefined;
  const locale = params.get('gom_locale') ?? undefined;
  const darkParam = params.get('gom_dark');

  GOM_HASH_KEYS.forEach((key) => params.delete(key));

  const remainder = params.toString();

  window.history.replaceState(
    window.history.state,
    '',
    window.location.pathname +
      window.location.search +
      (remainder ? `#${remainder}` : '')
  );

  return {
    token,
    locale,
    dark: darkParam === null ? undefined : darkParam === '1',
  };
}

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
}

function installRuntimeListener() {
  window.addEventListener('message', (event: MessageEvent) => {
    if (!isAllowedOrigin(event.origin)) {
      return;
    }

    const data = event.data as { type?: string } & GomAuthPayload & {
        path?: string;
      };

    if (!data || typeof data.type !== 'string') {
      return;
    }

    if (data.type === 'gom-navigate') {
      if (typeof data.path === 'string' && data.path.startsWith('/')) {
        navigateTo(data.path);
      }

      return;
    }

    if (data.type === 'gom-locale') {
      if (typeof data.locale === 'string' && data.locale.length > 0) {
        getDefaultStore().set(gomLocaleAtom, data.locale);
      }

      return;
    }

    if (data.type === 'gom-theme') {
      if (typeof data.dark === 'boolean') {
        getDefaultStore().set(gomDarkModeAtom, data.dark);
      }

      return;
    }

    if (data.type === 'gom-auth') {
      if (typeof data.token !== 'string' || data.token.length === 0) {
        return;
      }

      seedPreferences(data);

      if (localStorage.getItem(TOKEN_KEY) !== data.token) {
        // Identity change: the app keys redux, react-query and preference
        // atoms off the session — a reload is the sanctioned reset (the
        // company switcher does exactly the same).
        applyToken(data.token);
        window.location.reload();
      }
    }
  });
}

function awaitParentAuth(): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (!settled) {
        settled = true;
        window.removeEventListener('message', onMessage);
        resolve();
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (!isAllowedOrigin(event.origin)) {
        return;
      }

      const data = event.data as { type?: string } & GomAuthPayload;

      if (
        data &&
        data.type === 'gom-auth' &&
        typeof data.token === 'string' &&
        data.token.length > 0
      ) {
        applyToken(data.token);
        seedPreferences(data);
        finish();
      }
    };

    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'gom-ready' }, '*');

    // Give up after a while so a human can still reach /login manually.
    setTimeout(finish, BOOT_TIMEOUT_MS);
  });
}

/** Runs before the React root mounts. Resolves once auth state (if any) is in
 * localStorage so the first useAuthenticated() call sees it. */
export async function gomBridgeBoot(): Promise<void> {
  const hashPayload = consumeHashPayload();

  if (!isEmbedded()) {
    // Direct visits: hash fast-path still honored (handy for local testing),
    // no listener, no handshake.
    if (hashPayload?.token) {
      applyToken(hashPayload.token);
      seedPreferences(hashPayload);
    }

    return;
  }

  getDefaultStore().set(gomEmbedAtom, true);
  installRuntimeListener();

  if (hashPayload?.token) {
    applyToken(hashPayload.token);
    seedPreferences(hashPayload);
  } else if (hashPayload) {
    seedPreferences(hashPayload);
  }

  if (!localStorage.getItem(TOKEN_KEY)) {
    await awaitParentAuth();
  }

  window.parent.postMessage({ type: 'gom-booted' }, '*');
}
