import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import PublishLocalRepositorySidePanel from "./PublishLocalRepositorySidePanel";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const ROUTE_PATH = "/?name=aaaa-bbbb-cccc";

const renderWithRoute = () =>
  renderWithProviders(
    <PublishLocalRepositorySidePanel />,
    undefined,
    ROUTE_PATH,
  );

describe("PublishLocalRepositorySidePanel", () => {
  it("renders loading state when fetching repository", () => {
    renderWithProviders(<PublishLocalRepositorySidePanel />);
  });

  it("renders header with repository name", async () => {
    renderWithRoute();

    expect(await screen.findByText(/publish repo 1/i)).toBeInTheDocument();
  });

  it("does not render radio buttons when publications do not exist", async () => {
    renderWithProviders(
      <PublishLocalRepositorySidePanel />,
      undefined,
      ROUTE_PATH,
    );

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
