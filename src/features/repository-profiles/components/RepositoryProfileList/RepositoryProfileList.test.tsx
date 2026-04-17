import { accessGroups } from "@/tests/mocks/accessGroup";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import RepositoryProfileList from "./RepositoryProfileList";

describe("RepositoryProfileList", () => {
  const user = userEvent.setup();

  it("renders table headers and rows", async () => {
    renderWithProviders(
      <RepositoryProfileList repositoryProfiles={repositoryProfiles} />,
    );

    const table = screen.getByRole("table");
    expect(table).toHaveTexts(["Profile Name", "Associated", "Access group"]);

    for (const profile of repositoryProfiles) {
      const row = within(table).getByRole("row", {
        name: (name) =>
          name.toLowerCase().includes(profile.title.toLowerCase()),
      });
      expect(row).toBeInTheDocument();

      const accessGroup = accessGroups.find(
        (group) => group.name === profile.access_group,
      )?.title;
      assert(accessGroup);

      expect(await within(row).findByText(accessGroup)).toBeInTheDocument();
    }
  });

  it("renders applied count for each profile row", async () => {
    const [firstProfile] = repositoryProfiles;
    renderWithProviders(
      <RepositoryProfileList repositoryProfiles={[firstProfile]} />,
    );

    const table = screen.getByRole("table");
    const row = within(table).getByRole("row", {
      name: (name) => name.toLowerCase().includes(firstProfile.title.toLowerCase()),
    });

    expect(
      await within(row).findByText(String(firstProfile.applied_count)),
    ).toBeInTheDocument();
  });

  it("filters with search param", () => {
    renderWithProviders(
      <RepositoryProfileList repositoryProfiles={repositoryProfiles} />,
      undefined,
      `/?search=${repositoryProfiles[0].title}`,
    );

    expect(
      screen.getByRole("rowheader", {
        name: `${repositoryProfiles[0].title} profile title and name`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("rowheader", {
        name: `${repositoryProfiles[1].title} profile title and name`,
      }),
    ).not.toBeInTheDocument();
  });
});
