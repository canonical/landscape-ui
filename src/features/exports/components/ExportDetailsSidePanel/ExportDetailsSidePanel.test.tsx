import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";
import { completedExportJob, processingExportJob } from "@/tests/mocks/exports";
import ExportDetailsSidePanel from "./ExportDetailsSidePanel";

const SIDE_PANEL_URL = "?sidePath=view&name=job-completed";
const PROCESSING_URL = "?sidePath=view&name=job-processing";
const LOADING_URL = "?sidePath=view&name=unknown";

describe("ExportDetailsSidePanel", () => {
  const user = userEvent.setup();

  it("renders loading state while fetching", () => {
    renderWithProviders(
      <ExportDetailsSidePanel />,
      undefined,
      LOADING_URL,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the job name and details for a completed export", async () => {
    setEndpointStatus({
      status: "variant",
      path: "exports/:jobId",
      response: completedExportJob,
    });

    renderWithProviders(
      <ExportDetailsSidePanel />,
      undefined,
      SIDE_PANEL_URL,
    );

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: completedExportJob.name }),
    ).toBeInTheDocument();

    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("shows download and discard buttons for completed jobs", async () => {
    setEndpointStatus({
      status: "variant",
      path: "exports/:jobId",
      response: completedExportJob,
    });

    renderWithProviders(
      <ExportDetailsSidePanel />,
      undefined,
      SIDE_PANEL_URL,
    );

    await expectLoadingState();

    expect(
      screen.getByRole("button", { name: /download/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /discard/i }),
    ).toBeInTheDocument();
  });

  it("shows cancel button for processing jobs", async () => {
    setEndpointStatus({
      status: "variant",
      path: "exports/:jobId",
      response: processingExportJob,
    });

    renderWithProviders(
      <ExportDetailsSidePanel />,
      undefined,
      PROCESSING_URL,
    );

    await expectLoadingState();

    expect(
      screen.getByRole("button", { name: /cancel/i }),
    ).toBeInTheDocument();
  });

  it("opens cancel confirmation modal for processing jobs", async () => {
    setEndpointStatus({
      status: "variant",
      path: "exports/:jobId",
      response: processingExportJob,
    });

    renderWithProviders(
      <ExportDetailsSidePanel />,
      undefined,
      PROCESSING_URL,
    );

    await expectLoadingState();

    await user.click(
      screen.getByRole("button", { name: /cancel/i }),
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(/still being generated/i),
    ).toBeInTheDocument();
  });

  it("shows discard confirmation modal", async () => {
    setEndpointStatus({
      status: "variant",
      path: "exports/:jobId",
      response: completedExportJob,
    });

    renderWithProviders(
      <ExportDetailsSidePanel />,
      undefined,
      SIDE_PANEL_URL,
    );

    await expectLoadingState();

    await user.click(
      screen.getByRole("button", { name: /discard/i }),
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/permanently deleted/i)).toBeInTheDocument();
  });

  it("shows the filter when the job has a query", async () => {
    const jobWithQuery = { ...completedExportJob, query: "tag:production" };
    setEndpointStatus({
      status: "variant",
      path: "exports/:jobId",
      response: jobWithQuery,
    });

    renderWithProviders(
      <ExportDetailsSidePanel />,
      undefined,
      SIDE_PANEL_URL,
    );

    await expectLoadingState();

    expect(screen.getByText("tag:production")).toBeInTheDocument();
  });
});
