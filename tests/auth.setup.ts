import { test as setup } from "@playwright/test";
import { USER } from "./helpers/_constants";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(USER.email);
  await page.locator('input[name="password"]').fill(USER.password);
  await page.getByText("Remember this device").click();
  await page.getByRole("button", { name: "Login" }).click();

  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("/overview");

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
