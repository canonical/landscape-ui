import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoriesListActions from "./LocalRepositoriesListActions";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OperationProvider } from "@/features/operations";
import { useLocation } from "react-router";

const [repository, repositoryImporting] = repositories;

const ComponentWithLocation = () => {
  const location = useLocation();
  return (
    <>
      <LocalRepositoriesListActions repository={repository} />
      <div data-testid="location">{location.search}</div>
    </>
  );
};

describe("LocalRepositoriesListActions", () => {
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

  it("disables import button while importing packages", async () => {
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
      screen.queryByRole("menuitem", { name: "Import packages" }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", { name: "Importing packages" }),
    ).toHaveAttribute("aria-disabled", "true");
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
    renderWithProviders(<ComponentWithLocation />);

    await user.click(
      await screen.findByRole("button", {
        name: `${repository.displayName} actions`,
      }),
    );

    await user.click(await screen.findByRole("menuitem", { name: "Publish" }));

    const location = await screen.findByTestId("location");
    expect(location).toHaveTextContent("sidePath=publish");
    expect(location).toHaveTextContent(`name=${repository.localId}`);
  });
});
