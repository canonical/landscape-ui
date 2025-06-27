import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RemovalProfileList from "./RemovalProfileList";
import { accessGroups } from "@/tests/mocks/accessGroup";

describe("RemovalProfileList", () => {
  it("renders table headers", () => {
    renderWithProviders(<RemovalProfileList profiles={removalProfiles} />);

    expect(screen.getByRole("table")).toHaveTexts([
      "Name",
      "Access group",
      "Tags",
      "Associated",
    ]);
  });

  it("renders rows with profile data", () => {
    renderWithProviders(<RemovalProfileList profiles={removalProfiles} />);

    removalProfiles.forEach(async (profile) => {
      const row = screen.getByRole("row", {
        name: (name) =>
          name.toLowerCase().includes(profile.title.toLowerCase()),
      });
      expect(
        within(row).getByRole("button", {
          name: `Open "${profile.title}" profile details`,
        }),
      ).toBeInTheDocument();

      const accessGroup = accessGroups.find(
        (group) => group.name === profile.access_group,
      )?.title;
      assert(accessGroup);

      expect(await within(row).findByText(accessGroup)).toBeInTheDocument();

      if (profile.tags.length === 0) {
        expect(
          within(row).getByRole("cell", { name: /tags/i }),
        ).toHaveTextContent(NO_DATA_TEXT);
      }
    });
  });

  it("filters rows based on search query", () => {
    renderWithProviders(
      <RemovalProfileList profiles={removalProfiles} />,
      undefined,
      `/?search=${removalProfiles[0].title}`,
    );

    expect(
      screen.getByRole("button", {
        name: `Open "${removalProfiles[0].title}" profile details`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: `Open "${removalProfiles[1].title}" profile details`,
      }),
    ).not.toBeInTheDocument();
  });
});
