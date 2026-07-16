import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { PATHS } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { completedExportJob, processingExportJob } from "@/tests/mocks/exports";
import ExportsPage from "./ExportsPage";

describe("ExportsPage", () => {
  afterEach(() => {
    setEndpointStatus("default");
  });

  it("renders the 'Exports' page title", () => {
    setEndpointStatus({ path: PATHS.exports.root, status: "empty" });

    renderWithProviders(<ExportsPage />);

    expect(
      screen.getByRole("heading", { name: "Exports" }),
    ).toBeInTheDocument();
  });

  it("shows 'No exports found' when the list is empty", async () => {
    setEndpointStatus({ path: PATHS.exports.root, status: "empty" });

    renderWithProviders(<ExportsPage />);

    await waitFor(() => {
      expect(screen.getByText("No exports found")).toBeInTheDocument();
    });
  });

  it("shows the loading spinner while data is being fetched", () => {
    setEndpointStatus({ path: PATHS.exports.root, status: "loading" });

    renderWithProviders(<ExportsPage />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveTextContent("Loading...");
  });

  it("renders job names when data is present", async () => {
    setEndpointStatus({
      path: PATHS.exports.root,
      status: "variant",
      response: [completedExportJob, processingExportJob],
    });

    renderWithProviders(<ExportsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: completedExportJob.name }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: processingExportJob.name }),
    ).toBeInTheDocument();
  });

  it("does not show 'No exports found.' when jobs are present", async () => {
    setEndpointStatus({
      path: PATHS.exports.root,
      status: "variant",
      response: [completedExportJob],
    });

    renderWithProviders(<ExportsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: completedExportJob.name }),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("No exports found")).not.toBeInTheDocument();
  });

  it("renders the search input when exports are present", async () => {
    setEndpointStatus({
      path: PATHS.exports.root,
      status: "variant",
      response: [completedExportJob],
    });

    renderWithProviders(<ExportsPage />);

    await waitFor(() => {
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });
  });
});
