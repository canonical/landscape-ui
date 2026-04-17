import { setEndpointStatus } from "@/tests/controllers/controller";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RepositoryProfileDetails from "./RepositoryProfileDetails";

const [profileWithSources, profileWithoutSources] = repositoryProfiles;

describe("RepositoryProfileDetails", () => {
  const user = userEvent.setup();

  it("renders profile fields", async () => {
    renderWithProviders(
      <RepositoryProfileDetails profile={profileWithSources} />,
    );

    expect(
      screen.getByRole("heading", { name: "General" }),
    ).toBeInTheDocument();
    expect(screen.getByText(profileWithSources.title)).toBeInTheDocument();
    expect(
      screen.getByText(profileWithSources.description),
    ).toBeInTheDocument();
    expect(
      screen.getByText(profileWithSources.access_group),
    ).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("renders all_computers as Yes when true", () => {
    renderWithProviders(
      <RepositoryProfileDetails profile={profileWithoutSources} />,
    );

    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("renders apt sources table with source names", () => {
    renderWithProviders(
      <RepositoryProfileDetails profile={profileWithSources} />,
    );

    for (const source of profileWithSources.apt_sources) {
      expect(screen.getByText(source.name)).toBeInTheDocument();
    }
  });

  it("renders empty sources message when profile has no apt sources", () => {
    renderWithProviders(
      <RepositoryProfileDetails profile={profileWithoutSources} />,
    );

    expect(
      screen.getByText("No sources have been added yet."),
    ).toBeInTheDocument();
  });

  it("opens edit form side panel on edit button click", async () => {
    renderWithProviders(
      <RepositoryProfileDetails profile={profileWithSources} />,
    );

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(
      await screen.findByRole("heading", {
        name: `Edit "${profileWithSources.title}" profile`,
      }),
    ).toBeInTheDocument();
  });

  it("opens remove confirmation modal on remove button click", async () => {
    renderWithProviders(
      <RepositoryProfileDetails profile={profileWithSources} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: `Remove ${profileWithSources.title}`,
      }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(/This will remove/),
    ).toBeInTheDocument();
  });

  it("closes the confirmation modal after successful profile removal", async () => {
    renderWithProviders(
      <RepositoryProfileDetails profile={profileWithSources} />,
    );

    await user.click(
      screen.getByRole("button", {
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
    renderWithProviders(
      <RepositoryProfileDetails profile={profileWithSources} />,
    );

    setEndpointStatus({ status: "error", path: "RemoveRepositoryProfile" });

    await user.click(
      screen.getByRole("button", {
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
