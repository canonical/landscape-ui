import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import ViewRepositoryActionsBlock from "./ViewRepositoryActionsBlock";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setScreenSize } from "@/tests/helpers";

describe("ViewRepositoryActionsBlock", () => {
  beforeEach(() => {
    setScreenSize("lg");
  });

  it("shows action items when actions menu is opened in small screens", async () => {
    const user = userEvent.setup();
    setScreenSize("xs");

    renderWithProviders(
      <ViewRepositoryActionsBlock
        repository={repositories[0]}
        isImporting={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: /actions/i }));

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Import packages")).toBeInTheDocument();
    expect(screen.getByText("Publish")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("disables import button when packages are being imported", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ViewRepositoryActionsBlock
        repository={repositories[0]}
        isImporting={true}
      />,
    );

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.queryByText("Import packages")).not.toBeInTheDocument();
    expect(screen.getByText("Importing packages")).toBeInTheDocument();
    expect(screen.getByText("Publish")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();

    user.hover(screen.getByText("Importing packages"));

    expect(
      await screen.findByRole("tooltip", {
        name: "You must wait for this action to be completed to import more packages.",
      }),
    ).toBeInTheDocument();
  });
});
