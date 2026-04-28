import { setEndpointStatus } from "@/tests/controllers/controller";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import RepositoryProfileDetails from "./RepositoryProfileDetails";
import type { RepositoryProfile } from "../../types";

const [profileWithSources, profileWithoutSources] = repositoryProfiles;

const renderDetails = (profile: RepositoryProfile) =>
  renderWithProviders(
    <Suspense fallback={null}>
      <RepositoryProfileDetails />
    </Suspense>,
    undefined,
    `/?sidePath=view&name=${profile.name}`,
  );

describe("RepositoryProfileDetails", () => {
  const user = userEvent.setup();

  it("renders apt sources table with source names", async () => {
    renderDetails(profileWithSources);

    for (const source of profileWithSources.apt_sources) {
      expect(await screen.findByText(source.name)).toBeInTheDocument();
    }
  });

  it("renders empty sources message when profile has no apt sources", async () => {
    renderDetails(profileWithoutSources);

    expect(
      await screen.findByText("No sources have been added yet."),
    ).toBeInTheDocument();
  });

  it("sets sidePath=view,edit in URL on edit button click", async () => {
    renderDetails(profileWithSources);

    await user.click(await screen.findByRole("button", { name: "Edit" }));

    expect(
      screen.queryByRole("heading", {
        name: `Edit "${profileWithSources.title}" profile`,
      }),
    ).not.toBeInTheDocument();
  });

  it("opens remove confirmation modal on remove button click", async () => {
    renderDetails(profileWithSources);

    await user.click(
      await screen.findByRole("button", {
        name: `Remove ${profileWithSources.title}`,
      }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/This will remove/)).toBeInTheDocument();
  });

  it("closes the confirmation modal after successful profile removal", async () => {
    renderDetails(profileWithSources);

    await user.click(
      await screen.findByRole("button", {
        name: `Remove ${profileWithSources.title}`,
      }),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox"),
      `remove ${profileWithSources.title}`,
    );
    await user.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("shows error notification when profile removal fails", async () => {
    renderDetails(profileWithSources);

    setEndpointStatus({ status: "error", path: "RemoveRepositoryProfile" });

    await user.click(
      await screen.findByRole("button", {
        name: `Remove ${profileWithSources.title}`,
      }),
    );

    await user.type(
      screen.getByRole("textbox"),
      `remove ${profileWithSources.title}`,
    );
    await user.click(screen.getByRole("button", { name: "Remove" }));

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
