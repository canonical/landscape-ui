import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import ImportRepositoryPackagesSidePanel from "./ImportRepositoryPackagesSidePanel";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { repositories } from "@/tests/mocks/localRepositories";
import { expectLoadingState } from "@/tests/helpers";

const ROUTE_PATH = `/?name=${repositories[0].localId}`;

const renderComponent = () =>
  renderWithProviders(
    <ImportRepositoryPackagesSidePanel />,
    undefined,
    ROUTE_PATH,
  );

describe("ImportRepositoryPackagesSidePanel", () => {
  const user = userEvent.setup();

  it("renders loading state while repository is unresolved", () => {
    renderWithProviders(<ImportRepositoryPackagesSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the header, input, and buttons", async () => {
    renderComponent();

    await expectLoadingState();

    expect(
      await screen.findByText(
        `Import packages to ${repositories[0].displayName}`,
      ),
    ).toBeInTheDocument();

    expect(await screen.findByLabelText(/source url/i)).toBeInTheDocument();

    const fetchButton = await screen.findByRole("button", {
      name: /fetch packages/i,
    });
    expect(fetchButton).toHaveAttribute("aria-disabled", "true");

    const importButton = await screen.findByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).toHaveAttribute("aria-disabled", "true");
  });

  it("enables Fetch packages button when source URL is provided", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/packages");

    const button = screen.getByRole("button", { name: /fetch packages/i });
    expect(button).toBeEnabled();
  });

  it("shows validation result with packages after successful fetch", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "succeeded");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText(/packages to import/i)).toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import 2 packages/i,
    });
    expect(importButton).toBeEnabled();
  });

  it("shows caution notification when validation times out", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "timeout");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(
        screen.getByText(/fetching packages timed out/i),
      ).toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).toBeEnabled();
  });

  it("shows error notification when validation fails", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "failed");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(
        screen.getByText(/the operation failed unexpectedly/i),
      ).toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).toHaveAttribute("aria-disabled", "true");
  });

  it("shows negative notification when no packages are available", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "empty");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(
        screen.getByText(/no packages available from the url provided/i),
      ).toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).toHaveAttribute("aria-disabled", "true");
  });

  it("submits the form and shows success notification", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "succeeded");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText(/packages to import/i)).toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import 2 packages/i,
    });
    await user.click(importButton);

    await waitFor(() => {
      expect(
        screen.getByText(/you have marked .* to import packages/i),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error when source URL is touched and left empty", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });
  });
});
