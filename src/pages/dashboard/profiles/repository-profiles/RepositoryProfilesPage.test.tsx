import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RepositoryProfilesPage from "./RepositoryProfilesPage";
import { expectLoadingState } from "@/tests/helpers";
import userEvent from "@testing-library/user-event";

describe("RepositoryProfilesPage", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<RepositoryProfilesPage />);
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: "Add repository profile" }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));

    expect(
      screen.queryByRole("heading", { name: "Add repository profile" }),
    ).not.toBeInTheDocument();
  });

  it("renders a side panel to edit", async () => {
    renderWithProviders(
      <RepositoryProfilesPage />,
      undefined,
      `/?sidePath=edit&profile=${repositoryProfiles[0].name}`,
    );

    expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${repositoryProfiles[0].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <RepositoryProfilesPage />,
      undefined,
      `/?sidePath=view&profile=${repositoryProfiles[0].name}`,
    );

    expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: repositoryProfiles[0].title,
      }),
    ).toBeInTheDocument();
  });
});
