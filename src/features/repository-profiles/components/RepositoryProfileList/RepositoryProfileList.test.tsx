import { renderWithProviders } from "@/tests/render";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";
import RepositoryProfileList from "./RepositoryProfileList";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

describe("RepositoryProfileList", () => {
  it("renders table headers and rows", async () => {
    renderWithProviders(
      <RepositoryProfileList repositoryProfiles={repositoryProfiles} />,
    );

    const table = screen.getByRole("table");
    expect(table).toHaveTexts(["Title", "Description", "Access group"]);

    for (const profile of repositoryProfiles) {
      const row = within(table).getByRole("row", {
        name: (name) =>
          name.toLowerCase().includes(profile.title.toLowerCase()),
      });
      expect(row).toBeInTheDocument();

      if (profile.description) {
        expect(within(row).getByText(profile.description)).toBeInTheDocument();
      } else {
        expect(
          within(row).getByRole("cell", { name: /description/i }),
        ).toHaveTextContent(NO_DATA_TEXT);
      }

      const accessGroup = accessGroups.find(
        (group) => group.name === profile.access_group,
      )?.title;
      assert(accessGroup);

      expect(await within(row).findByText(accessGroup)).toBeInTheDocument();
    }
  });

  it("filters with search param", () => {
    renderWithProviders(
      <RepositoryProfileList repositoryProfiles={repositoryProfiles} />,
      undefined,
      `/?search=${repositoryProfiles[0].title}`,
    );

    expect(
      screen.getByRole("rowheader", { name: repositoryProfiles[0].title }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("rowheader", { name: repositoryProfiles[1].title }),
    ).not.toBeInTheDocument();
  });
});
