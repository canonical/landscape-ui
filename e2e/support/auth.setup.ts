import { test as setup } from "./fixtures/auth";
import { AUTH_STATE_PATH, USER } from "./constants";
import { login } from "./helpers/auth";
import { closeWelcomeModal } from "./helpers/utils";

// Log in once per run; the logged-in fixtures restore this session instead
// of each going through the login form.
setup("log in", async ({ page }) => {
  await login(page, USER.email, USER.password);
  await closeWelcomeModal(page);

  await page.context().storageState({ path: AUTH_STATE_PATH });
});
