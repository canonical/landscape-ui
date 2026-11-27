import { ProfileTypes } from "@/features/profiles";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SupportProfilesList from "./SupportProfilesList";

const [someInstances, allInstances, noInstances] = rebootProfiles;

const findAssociatedCell = async (title: string) =>
  screen.findByRole("cell", {
    name: `"${title}" profile associated instances`,
  });

describe("SupportProfilesList", () => {
  assert(someInstances);
  assert(allInstances);
  assert(noInstances);

  it("shows how many instances each profile is associated with", async () => {
    renderWithProviders(
      <SupportProfilesList
        type={ProfileTypes.reboot}
        profiles={[someInstances, allInstances, noInstances]}
        isPending={false}
      />,
    );

    expect(await findAssociatedCell(someInstances.title)).toHaveTextContent(
      `${someInstances.num_computers} instances`,
    );
    expect(await findAssociatedCell(allInstances.title)).toHaveTextContent(
      "All instances",
    );
    expect(await findAssociatedCell(noInstances.title)).toHaveTextContent(
      "---",
    );
  });

  it("labels each profile's cells", async () => {
    renderWithProviders(
      <SupportProfilesList
        type={ProfileTypes.reboot}
        profiles={[someInstances]}
        isPending={false}
      />,
    );

    expect(
      await screen.findByRole("rowheader", {
        name: `"${someInstances.title}" profile name`,
      }),
    ).toHaveTextContent(someInstances.title);
    expect(
      screen.getByRole("cell", {
        name: `"${someInstances.title}" profile access group`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", {
        name: `"${someInstances.title}" profile next restart`,
      }),
    ).toBeInTheDocument();
  });

  it("adds the removal timeframe column for removal profiles", async () => {
    renderWithProviders(
      <SupportProfilesList
        type={ProfileTypes.removal}
        profiles={[...removalProfiles]}
        isPending={false}
      />,
    );

    await findAssociatedCell(removalProfiles[0].title);

    expect(
      screen.getByRole("cell", {
        name: `"${removalProfiles[0].title}" profile removal timeframe`,
      }),
    ).toHaveTextContent(`${removalProfiles[0].days_without_exchange} days`);
    expect(
      screen
        .getAllByRole("columnheader")
        .map((header) => header.textContent?.trim()),
    ).toEqual([
      "Profile name",
      "Access group",
      "Associated",
      "Removal timeframe",
    ]);
  });

  it("is loading while the profiles are pending", () => {
    renderWithProviders(
      <SupportProfilesList
        type={ProfileTypes.reboot}
        profiles={[]}
        isPending
      />,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("says the account has none of the type", () => {
    renderWithProviders(
      <SupportProfilesList
        type={ProfileTypes.reboot}
        profiles={[]}
        isPending={false}
      />,
    );

    expect(
      screen.getByText("This account has no reboot profiles."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("keeps the search when it matches nothing", async () => {
    renderWithProviders(
      <SupportProfilesList
        type={ProfileTypes.reboot}
        profiles={[someInstances, allInstances]}
        isPending={false}
      />,
      undefined,
      "/?search=no-such-profile",
    );

    expect(
      await screen.findByText(
        "No reboot profiles found according to your search parameters.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("no-such-profile");
  });

  it("filters by title, ignoring case", async () => {
    renderWithProviders(
      <SupportProfilesList
        type={ProfileTypes.reboot}
        profiles={[someInstances, allInstances, noInstances]}
        isPending={false}
      />,
      undefined,
      `/?search=${encodeURIComponent(allInstances.title.toUpperCase())}`,
    );

    const table = within(await screen.findByRole("table"));

    expect(
      table.getByRole("button", {
        name: `Open "${allInstances.title}" profile details`,
      }),
    ).toBeInTheDocument();
    expect(
      table.queryByRole("button", {
        name: `Open "${someInstances.title}" profile details`,
      }),
    ).not.toBeInTheDocument();
  });
});
