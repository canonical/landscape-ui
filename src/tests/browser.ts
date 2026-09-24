import {
  API_URL,
  API_URL_DEB_ARCHIVE,
  API_URL_OLD,
  MSW_ENDPOINTS_TO_INTERCEPT,
} from "@/constants";
import type { AuthUser } from "@/features/auth";
import type { RequestHandler } from "msw";
import { http, HttpResponse, passthrough } from "msw";
import { setupWorker } from "msw/browser";
import fallbackHandlers from "./server/handlers";
import {
  setStaffGlobalRoles,
  staffState,
} from "./server/handlers/staffAccounts";

// --- Dev session ---
//
// The mocks know the caller only by the `Authorization` header, which the
// app's `GET /me` never sends (a real server reads the cookie), so on its own
// a reload signs you out. Remember the last auth state the mocks issued and
// serve it from `GET /me`; `window.msw.setGlobalRoles(...)` makes that user
// Canonical staff.

const SESSION_KEY = "msw:authState";
const GLOBAL_ROLES_KEY = "msw:globalRoles";

const readJson = <T>(key: string): T | null => {
  const value = sessionStorage.getItem(key);

  return value ? (JSON.parse(value) as T) : null;
};

const readGlobalRoles = (): string[] =>
  readJson<string[]>(GLOBAL_ROLES_KEY) ?? [];

const isAuthState = (body: unknown): body is AuthUser =>
  typeof body === "object" &&
  body !== null &&
  "current_account" in body &&
  typeof (body as AuthUser).token === "string";

const hasToken = (body: unknown): body is { token: string } =>
  typeof body === "object" &&
  body !== null &&
  typeof (body as { token?: unknown }).token === "string";

/** Remembers auth state issued by the mocks; forgets it on logout. */
const rememberSession = async (request: Request, response: Response) => {
  // A rejected request changes nothing, in the app or here.
  if (!response.ok) {
    return;
  }

  const path = new URL(request.url).pathname;

  if (path.endsWith("logout")) {
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }

  if (!response.headers.get("content-type")?.includes("json")) {
    return;
  }

  const body: unknown = await response.clone().json();
  const session = readJson<AuthUser>(SESSION_KEY);

  if (isAuthState(body)) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(body));
  } else if (path.endsWith("switch-account") && session && hasToken(body)) {
    const { account_name } = (await request.clone().json()) as {
      account_name: string;
    };

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        ...session,
        current_account: account_name,
        token: body.token,
      }),
    );
  }
};

declare global {
  interface Window {
    msw?: {
      setGlobalRoles: (roles: string[]) => void;
    };
  }
}

setStaffGlobalRoles(readGlobalRoles());

window.msw = {
  setGlobalRoles: (roles) => {
    sessionStorage.setItem(GLOBAL_ROLES_KEY, JSON.stringify(roles));
    setStaffGlobalRoles(roles);
    console.info("[MSW] Global roles set; reload to apply them.");
  },
};

console.info(
  "[MSW] Sign in with any credentials. To be Canonical staff, run " +
    'window.msw.setGlobalRoles(["SupportProvider", "AccountManager"]) and reload.',
);

// --- Handlers ---

const handlers: RequestHandler[] = [
  http.all("*", ({ request }) => {
    if (
      !request.url.includes(API_URL) &&
      !request.url.includes(API_URL_OLD) &&
      !request.url.includes(API_URL_DEB_ARCHIVE)
    ) {
      return passthrough();
    }

    if (request.url.match(/\.(ts|tsx|scss)/)) {
      return passthrough();
    }

    if (
      MSW_ENDPOINTS_TO_INTERCEPT.some((url: string) =>
        request.url.includes(url),
      )
    ) {
      return;
    }

    return passthrough();
  }),

  // The remembered session, for the app's tokenless `GET /me`.
  http.get(`${API_URL}me`, ({ request }) => {
    const session = readJson<AuthUser>(SESSION_KEY);

    if (request.headers.get("Authorization") || !session) {
      return;
    }

    return HttpResponse.json({
      ...session,
      global_roles: [...staffState.globalRoles],
    });
  }),

  ...fallbackHandlers,

  http.all("*", ({ request }) => {
    console.warn("MSW: No handler matched, passing through:", request.url);
    return passthrough();
  }),
];

export const worker = setupWorker(...handlers);

worker.events.on("response:mocked", ({ request, response }) => {
  rememberSession(request, response).catch((error: unknown) => {
    console.warn("MSW: could not remember the session:", error);
  });
});
