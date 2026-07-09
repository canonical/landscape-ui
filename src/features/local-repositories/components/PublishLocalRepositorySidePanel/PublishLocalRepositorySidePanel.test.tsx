import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { Suspense } from "react";
import SidePanel from "@/components/layout/SidePanel";
import PublishLocalRepositorySidePanel from "./PublishLocalRepositorySidePanel";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { repositories } from "@/tests/mocks/localRepositories";

const [repository] = repositories;

const renderWithRoute = (localId: string = repository.localId) =>
  renderWithProviders(
    <Suspense fallback={<SidePanel.LoadingState />}>
      <PublishLocalRepositorySidePanel />
    </Suspense>,
    undefined,
    `/?name=${localId}`,
  );

describe("PublishLocalRepositorySidePanel", () => {
  it("renders header with repository name", async () => {
    renderWithRoute();

    expect(
      await screen.findByText(`Publish ${repository.displayName}`),
    ).toBeInTheDocument();
  });

  it("does not render radio buttons when publications do not exist", async () => {
    renderWithRoute("eeee-ffff-gggg");

    expect(
      await screen.findByRole("textbox", { name: /publication name/i }),
    ).toBeInTheDocument();

    expect(screen.queryByLabelText(/new publication/i)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/existing publication/i),
    ).not.toBeInTheDocument();
  });

  it("defaults to new publication when publications exist", async () => {
    renderWithRoute();

    const newRadio = await screen.findByLabelText(/new publication/i);
    expect(newRadio).toBeChecked();

    const existingRadio = screen.getByLabelText(/existing publication/i);
    expect(existingRadio).not.toBeChecked();

    expect(
      screen.getByRole("textbox", { name: /publication name/i }),
    ).toBeInTheDocument();
  });

  it("switches to existing publication form", async () => {
    const user = userEvent.setup();
    renderWithRoute();

    const newRadio = await screen.findByLabelText(/new publication/i);
    const existingRadio = await screen.findByLabelText(/existing publication/i);
    await user.click(existingRadio);

    await waitFor(() => {
      expect(existingRadio).toBeChecked();
      expect(newRadio).not.toBeChecked();
    });

    expect(
      screen.getByRole("combobox", { name: /publication name/i }),
    ).toBeInTheDocument();
  });
});
