import { accessGroups } from "@/tests/mocks/accessGroup";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { describe, expect, it, vi } from "vitest";
import RepositoryProfileList from "./RepositoryProfileList";
import { pluralizeWithCount } from "@/utils/_helpers";

vi.mock("@/hooks/useRoles", () => ({
  default: vi.fn(() => ({
    getAccessGroupQuery: vi.fn(() => ({ data: { data: accessGroups } })),
  })),
}));

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

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
      name: (name) =>
        name.toLowerCase().includes(firstProfile.title.toLowerCase()),
    });

    expect(
      await within(row).findByText(
        pluralizeWithCount(firstProfile.applied_count ?? 0, "instance"),
      ),
    ).toBeInTheDocument();
  });

  it("sets sidePath=view and name in URL when clicking a profile title", async () => {
    const [firstProfile] = repositoryProfiles;
    renderWithProviders(
      <>
        <RepositoryProfileList repositoryProfiles={repositoryProfiles} />
        <LocationDisplay />
      </>,
    );

    await user.click(
      await screen.findByRole("button", { name: firstProfile.title }),
    );

    expect(screen.getByTestId("location")).toHaveTextContent("sidePath=view");
    expect(screen.getByTestId("location")).toHaveTextContent(
      `name=${firstProfile.name}`,
    );
  });

  it("renders only the profiles passed in (server-side filtering)", () => {
    renderWithProviders(
      <RepositoryProfileList
        repositoryProfiles={[repositoryProfiles[0]]}
        totalCount={1}
      />,
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
