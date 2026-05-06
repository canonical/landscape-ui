import { setEndpointStatus } from "@/tests/controllers/controller";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { expectLoadingState } from "@/tests/helpers";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RepositoryProfilesPage from "./RepositoryProfilesPage";
import userEvent from "@testing-library/user-event";

const [profile] = repositoryProfiles;

describe("RepositoryProfilesPage", () => {
  it("renders repository profile list with table and pagination", async () => {
    renderWithProviders(<RepositoryProfilesPage />);

    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Repository profiles" }),
    ).toBeInTheDocument();
    expect(screen.getByText(repositoryProfiles[0].title)).toBeInTheDocument();
  });

  it("renders empty state when no profiles exist", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<RepositoryProfilesPage />);

    expect(
      await screen.findByText("No repository profiles found"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "How to manage repositories in Landscape",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add repository profile/i }),
    ).toBeInTheDocument();
  });

  it("renders add profile button in header when profiles exist", async () => {
    renderWithProviders(<RepositoryProfilesPage />);

    expect(
      await screen.findByRole("button", { name: /Add repository profile/i }),
    ).toBeInTheDocument();
  });

  it("opens profile details panel when sidePath=view and name are set in URL", async () => {
    renderWithProviders(
      <RepositoryProfilesPage />,
      undefined,
      `/?sidePath=view&name=${profile.name}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: profile.title,
      }),
    ).toBeInTheDocument();
  });

  it("renders the add form side panel when add button is clicked", async () => {
    renderWithProviders(<RepositoryProfilesPage />);

    await expectLoadingState();
    await userEvent.click(
      screen.getByRole("button", { name: "Add repository profile" }),
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /add a new repository profile/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the edit form side panel when sidePath=edit is in the URL", async () => {
    renderWithProviders(
      <RepositoryProfilesPage />,
      undefined,
      `/?sidePath=edit&name=${profile.name}`,
    );

    await expectLoadingState();

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /save changes/i,
      }),
    ).toBeInTheDocument();
  });
});
