import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RebootProfilesList from "./RebootProfilesList";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { accessGroups } from "@/tests/mocks/accessGroup";

describe("RebootProfilesList", () => {
  it("renders table headers", () => {
    renderWithProviders(<RebootProfilesList profiles={rebootProfiles} />);

    const table = screen.getByRole("table");
    expect(table).toHaveTexts([
      "name",
      "access group",
      "Tags",
      "associated",
      "scheduled reboot",
    ]);
  });

  it("renders rows with profile data", async () => {
    renderWithProviders(<RebootProfilesList profiles={rebootProfiles} />);

    for (const profile of rebootProfiles) {
      const accessGroup = accessGroups.find(
        (group) => group.name === profile.access_group,
      )?.title;
      assert(accessGroup);

      const row = screen.getByRole("row", {
        name: (name) =>
          name.toLowerCase().includes(profile.title.toLowerCase()),
      });
      expect(
        within(row).getByRole("button", { name: profile.title }),
      ).toBeInTheDocument();

      expect(await within(row).findByText(accessGroup)).toBeInTheDocument();

      if (profile.tags.length === 0) {
        expect(
          within(row).getByRole("cell", { name: /tags/i }),
        ).toHaveTextContent(NO_DATA_TEXT);
      }
    }
  });

  it("filters profiles based on search", async () => {
    renderWithProviders(
      <RebootProfilesList profiles={rebootProfiles} />,
      undefined,
      `/?search=${rebootProfiles[0].title}`,
    );

    expect(
      screen.getByRole("button", { name: rebootProfiles[0].title }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: rebootProfiles[1].title }),
    ).not.toBeInTheDocument();
  });
});
