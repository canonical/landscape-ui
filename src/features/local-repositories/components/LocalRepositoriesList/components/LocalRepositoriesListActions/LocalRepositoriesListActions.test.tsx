import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoriesListActions from "./LocalRepositoriesListActions";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OperationProvider } from "@/features/operations";
import { setEndpointStatus } from "@/tests/controllers/controller";

const [repository, repositoryImporting] = repositories;

describe("LocalRepositoriesListActions", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("opens menu with repository actions", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LocalRepositoriesListActions repository={repository} />,
    );

    await user.click(
      await screen.findByRole("button", {
        name: `${repository.displayName} actions`,
      }),
    );

    expect(
      screen.getByRole("menuitem", { name: "View details" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Import packages" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Publish" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Remove" }),
    ).toBeInTheDocument();
  });

  it("disables import button while importing packages if canceling LROs is disabled", async () => {
    setEndpointStatus({ status: "empty", path: "debarchive/features" });
    const user = userEvent.setup();

    renderWithProviders(
      <OperationProvider operationNames={["operations/pppp-gggg-ssss"]}>
        <LocalRepositoriesListActions repository={repositoryImporting} />
      </OperationProvider>,
    );

    await user.click(
      await screen.findByRole("button", {
        name: `${repositoryImporting.displayName} actions`,
      }),
    );

    expect(
      screen.getByRole("menuitem", { name: "Importing packages" }),
    ).toHaveAttribute("aria-disabled", "true");

    expect(
      screen.queryByRole("menuitem", { name: "Import packages" }),
    ).not.toBeInTheDocument();
  });

  it("opens cancel modal when clicking import button while importing packages", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OperationProvider operationNames={["operations/pppp-gggg-ssss"]}>
        <LocalRepositoriesListActions repository={repositoryImporting} />
      </OperationProvider>,
    );

    await user.click(
      await screen.findByRole("button", {
        name: `${repositoryImporting.displayName} actions`,
      }),
    );

    await user.click(screen.getByRole("menuitem", { name: "Import packages" }));

    expect(
      await screen.findByRole("heading", {
        name: `${repositoryImporting.displayName} is already importing packages`,
      }),
    ).toBeInTheDocument();
  });

  it("opens removal modal when remove is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LocalRepositoriesListActions repository={repository} />,
    );

    await user.click(
      await screen.findByRole("button", {
        name: `${repository.displayName} actions`,
      }),
    );

    await user.click(await screen.findByRole("menuitem", { name: "Remove" }));

    expect(
      await screen.findByRole("heading", {
        name: `Remove ${repository.displayName}`,
      }),
    ).toBeInTheDocument();
  });

  it("opens publish side panel when publish is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <LocalRepositoriesListActions repository={repository} />
        <LocationDisplay />
      </>,
    );

    await user.click(
      await screen.findByRole("button", {
        name: `${repository.displayName} actions`,
      }),
    );

    await user.click(await screen.findByRole("menuitem", { name: "Publish" }));

    const location = getLocationDisplay();
    expect(location).toHaveTextContent("sidePath=publish");
    expect(location).toHaveTextContent(`name=${repository.localId}`);
  });
});
