import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import ViewRepositoryActionsBlock from "./ViewRepositoryActionsBlock";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setScreenSize } from "@/tests/helpers";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { resetLroProgress } from "@/tests/server/handlers/operations";
import type { Local } from "@canonical/landscape-openapi";

const repository = (repositories as Local[]).find(
  ({ lastOperation }) => lastOperation === "operations/pppp-gggg-ssss",
);
assert(repository, "Need local repository mock with ongoing operation");

describe("ViewRepositoryActionsBlock", () => {
  beforeEach(() => {
    setScreenSize("lg");
    setEndpointStatus("default");
    resetLroProgress();
  });

  it("shows action items when actions menu is opened in small screens", async () => {
    const user = userEvent.setup();
    setScreenSize("xs");

    renderWithProviders(
      <ViewRepositoryActionsBlock
        repository={repository}
        isImporting={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: /actions/i }));

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Import packages" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("clicking import button opens modal when import is ongoing", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ViewRepositoryActionsBlock repository={repository} isImporting={true} />,
    );

    await user.click(
      await screen.findByRole("button", { name: "Import packages" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: `${repository.displayName} is already importing packages`,
      }),
    ).toBeInTheDocument();
  });

  it("disables import button while importing if canceling LROs is disabled", async () => {
    setEndpointStatus({ status: "empty", path: "debarchive/features" });
    const user = userEvent.setup();

    renderWithProviders(
      <ViewRepositoryActionsBlock repository={repository} isImporting={true} />,
    );

    const importingButton = screen.getByRole("button", {
      name: "Importing packages",
    });
    expect(importingButton).toHaveAttribute("aria-disabled", "true");

    expect(
      screen.queryByRole("button", { name: "Import packages" }),
    ).not.toBeInTheDocument();

    await user.hover(importingButton);

    expect(
      await screen.findByRole("tooltip", {
        name: "You must wait for this action to be completed to import more packages.",
      }),
    ).toBeInTheDocument();
  });
});
