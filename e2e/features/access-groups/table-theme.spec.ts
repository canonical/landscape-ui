import { test, expect } from "../../support/fixtures/auth";
import { navigateTo } from "../../support/helpers/navigation";

const DESKTOP_WIDTH = 1440;
const SCROLL_OFFSET = { left: 80, top: 40 };
const administrators = Array.from({ length: 8 }, (_, index) => ({
  name: `Table administrator ${index + 1}`,
  email: `table-admin-${index + 1}@example.com`,
}));

for (const theme of ["light", "dark"]) {
  for (const viewport of [
    { width: DESKTOP_WIDTH, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    test.describe(`@saas ${theme} theme at ${viewport.width}px`, () => {
      test.use({ viewport });

      test("matches side-panel table surfaces and preserves sticky cells", async ({
        authenticatedPage: page,
      }) => {
        await page.route("**/api/**", async (route) => {
          const action = new URL(route.request().url()).searchParams.get(
            "action",
          );
          switch (action) {
            case "GetAccessGroups":
              await route.fulfill({
                json: [
                  {
                    name: "global",
                    title: "Table theme test",
                    parent: "",
                    children: "",
                  },
                ],
              });
              break;
            case "GetRoles":
              await route.fulfill({
                json: [
                  {
                    name: "Table auditor",
                    permissions: [],
                    persons: administrators.map(({ email }) => email),
                    access_groups: ["global"],
                  },
                ],
              });
              break;
            case "GetAdministrators":
              await route.fulfill({ json: administrators });
              break;
            default:
              await route.continue();
          }
        });
        await page.evaluate((value) => {
          localStorage.setItem("_landscape_dark_theme", value);
        }, theme);
        await navigateTo(page, "/settings/access-groups");

        const fullPageTable = page.getByRole("table");
        const defaultBackground =
          theme === "dark" ? "rgb(38, 38, 38)" : "rgb(255, 255, 255)";
        await expect(fullPageTable.locator("thead")).toHaveCSS(
          "background-color",
          defaultBackground,
        );
        if (viewport.width === DESKTOP_WIDTH) {
          await expect(fullPageTable.locator("tbody td").first()).toHaveCSS(
            "background-color",
            defaultBackground,
          );
        }

        await page
          .getByRole("button", { name: "Table theme test", exact: true })
          .click();
        const panel = page.getByRole("complementary", { name: "Side panel" });
        const table = panel.getByRole("table");
        const header = table.locator("thead");
        const firstCell = table.locator("tbody td").first();
        await expect(panel).toBeVisible();
        await expect(header).toBeVisible();
        const surface = await panel.evaluate(
          (element) => getComputedStyle(element).backgroundColor,
        );

        expect(surface).not.toBe("");
        expect(surface).not.toBe("rgba(0, 0, 0, 0)");
        await expect(header).toHaveCSS("background-color", surface);
        await expect(header).toHaveCSS("position", "sticky");

        const isDesktop = viewport.width === DESKTOP_WIDTH;
        await expect(firstCell).toHaveCSS(
          "position",
          isDesktop ? "sticky" : "static",
        );
        if (isDesktop) {
          await expect(firstCell).toHaveCSS("background-color", surface);
          await expect(table.locator("thead th").first()).toHaveCSS(
            "background-color",
            surface,
          );
        }

        // Force overflow on both axes to exercise the sticky layers.
        const scroller = table.locator("..");
        await expect(scroller).toHaveCSS("overflow-x", "auto");
        await scroller.evaluate((element) => {
          element.style.maxWidth = "320px";
          element.style.maxHeight = "120px";
        });
        const beforeHeaderY = await header.evaluate(
          (element) => element.getBoundingClientRect().y,
        );
        const beforeCellX = await firstCell.evaluate(
          (element) => element.getBoundingClientRect().x,
        );
        await scroller.evaluate((element, offset) => {
          element.scrollLeft = offset.left;
          element.scrollTop = offset.top;
        }, SCROLL_OFFSET);
        await expect
          .poll(() => scroller.evaluate((element) => element.scrollLeft))
          .toBe(SCROLL_OFFSET.left);
        await expect
          .poll(() => scroller.evaluate((element) => element.scrollTop))
          .toBe(SCROLL_OFFSET.top);
        await expect
          .poll(() =>
            header.evaluate((element) => element.getBoundingClientRect().y),
          )
          .toBeCloseTo(beforeHeaderY, 0);
        await expect
          .poll(() =>
            firstCell.evaluate((element) => element.getBoundingClientRect().x),
          )
          .toBeCloseTo(beforeCellX - (isDesktop ? 0 : SCROLL_OFFSET.left), 0);
      });
    });
  }
}
