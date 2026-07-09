import { renderWithProviders } from "@/tests/render";
import { describe, expect } from "vitest";
import PublishMirrorForm from "./PublishMirrorForm";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";

const ROUTE_PATH = "/?name=mirrors/ubuntu-archive-mirror";
const NO_PUBLICATIONS_ROUTE_PATH = "/?name=mirrors/ubuntu-security-mirror";

const renderWithRoute = (routePath: string = ROUTE_PATH) =>
  renderWithProviders(
    <Suspense fallback={<LoadingState />}>
      <PublishMirrorForm />
    </Suspense>,
    undefined,
    routePath,
  );

describe("PublishMirrorNewForm", () => {
  it("does not render radio buttons when publications do not exist", async () => {
    renderWithRoute(NO_PUBLICATIONS_ROUTE_PATH);

    // Wait for the form to finish loading - the form only renders after both queries resolve
    await screen.findByRole("button", { name: /publish mirror/i });

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
