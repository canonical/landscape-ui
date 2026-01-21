import type { Page, TestInfo } from "@playwright/test";
import { test as base } from "@playwright/test";
import fs from "fs";
import path from "path";
import { login } from "../helpers/auth";
import { USER } from "../constants";
import { closeWelcomeModal } from "../helpers/utils";
import { mockStandaloneAccount } from "../helpers/standaloneAccount";

interface AuthFixtures {
  authenticatedPage: Page;
}

type StandaloneAccountMockMode = "exists" | "missing" | "disabled";

export const test = base.extend<
  AuthFixtures & { standaloneAccountMock: StandaloneAccountMockMode }
>({
  standaloneAccountMock: ["exists", { option: true }],
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
    await login(page, USER.email, USER.password);
    await closeWelcomeModal(page);
    await use(page);
  },
});

export { expect } from "@playwright/test";
