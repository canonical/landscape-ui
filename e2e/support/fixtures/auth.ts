import type { BrowserContext, Page, TestInfo } from "@playwright/test";
import { test as base } from "@playwright/test";
import fs from "fs";
import path from "path";
import { AUTH_STATE_PATH } from "../constants";
import { navigateTo } from "../helpers/navigation";
import { closeWelcomeModal } from "../helpers/utils";
import { mockStandaloneAccount } from "../helpers/standaloneAccount";
import type { StaffApiMock, StaffApiMockOptions } from "../helpers/superAdmin";
import { mockStaffApi } from "../helpers/superAdmin";

// Signs in with the session `auth.setup.ts` saved, rather than through the
// login form: quicker, and parallel workers don't all log in at once. Only
// the cookies are restored, so the page still opens with the welcome modal,
// as it does after logging in.
async function signIn(page: Page): Promise<void> {
  const { cookies } = JSON.parse(fs.readFileSync(AUTH_STATE_PATH, "utf8")) as {
    cookies: Parameters<BrowserContext["addCookies"]>[0];
  };

  await page.context().addCookies(cookies);
  await navigateTo(page, "/overview");
  await closeWelcomeModal(page);
}

interface AuthFixtures {
  authenticatedPage: Page;
  /** The staff tier laid over the session; see `mockStaffApi`. */
  staffApi: StaffApiMock;
  /** A page logged in as Canonical staff, with `staffApi` installed. */
  staffPage: Page;
}

type StandaloneAccountMockMode = "exists" | "missing" | "disabled";

interface AuthOptions {
  standaloneAccountMock: StandaloneAccountMockMode;
  staffApiMock: StaffApiMockOptions;
}

export const test = base.extend<AuthFixtures & AuthOptions>({
  standaloneAccountMock: ["exists", { option: true }],
  staffApiMock: [{}, { option: true }],
  page: async ({ page, standaloneAccountMock }, use, testInfo: TestInfo) => {
    const logs: string[] = [];

    const timestamp = () => new Date().toISOString();

    page.on("console", (msg) => {
      logs.push(`[${timestamp()}][console:${msg.type()}] ${msg.text()}`);
    });

    page.on("pageerror", (error) => {
      logs.push(`[${timestamp()}][pageerror] ${error.message}`);
    });

    page.on("requestfailed", (request) => {
      const failure = request.failure();
      logs.push(
        `[${timestamp()}][requestfailed] ${request.url()} ${
          failure?.errorText ?? ""
        }`,
      );
    });

    const shouldMockExists = standaloneAccountMock === "exists";
    const shouldMockMissing = standaloneAccountMock === "missing";

    if (shouldMockExists) {
      await mockStandaloneAccount(page, true);
    } else if (shouldMockMissing) {
      await mockStandaloneAccount(page, false);
    }

    await use(page);

    if (logs.length > 0) {
      const filePath = path.join(
        testInfo.outputDir,
        `${testInfo.title.replace(/\W+/g, "_")}-console.log`,
      );
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, logs.join("\n"), "utf8");
    }
  },
  authenticatedPage: async ({ page }, use) => {
    await signIn(page);
    await use(page);
  },
  staffApi: async ({ page, staffApiMock }, use) => {
    await use(await mockStaffApi(page, staffApiMock));
  },
  staffPage: async ({ page, staffApi: _staffApi }, use) => {
    await signIn(page);
    await use(page);
  },
});

export { expect } from "@playwright/test";
