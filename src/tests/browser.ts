import { setupWorker } from "msw/browser";
import {
  createBrowserHandlers,
  createRememberedSessionHandler,
} from "./authTesting/browserHandlers";
import { getAuthTestingConfig } from "./authTesting/config";
import { ROOT_PATH } from "@/constants";
import { MOCK_INVITATION_ID } from "./authTesting/handlers";
import type { AuthUser } from "@/features/auth";
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

const authTestingConfig = getAuthTestingConfig(import.meta.env);
if (authTestingConfig?.invitationEnabled) {
  console.info(
    "MSW authentication testing invitation:",
    new URL(
      `${ROOT_PATH}accept-invitation/${MOCK_INVITATION_ID}`,
      window.location.origin,
    ).href,
  );
}
export const worker = setupWorker(
  createRememberedSessionHandler(
    () => readJson<AuthUser>(SESSION_KEY),
    () => [...staffState.globalRoles],
  ),
  ...createBrowserHandlers(authTestingConfig, readJson<AuthUser>(SESSION_KEY)),
);

worker.events.on("response:mocked", ({ request, response }) => {
  rememberSession(request, response).catch((error: unknown) => {
    console.warn("MSW: could not remember the session:", error);
  });
});
