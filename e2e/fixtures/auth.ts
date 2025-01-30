import { Page, test as base } from "@playwright/test";
import { login } from "../helpers/auth";
import { USER } from "../constants";
import { closeWelcomeModal } from "../helpers/utils";

interface AuthFixtures {
  authenticatedPage: Page;
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await login(page, USER.email, USER.password);
    await closeWelcomeModal(page);
    await use(page);
  },
});

export { expect } from "@playwright/test";
