import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import {
  completedExportJob,
  processingExportJob,
  failedExportJob,
  newComplianceExportJob,
} from "@/tests/mocks/exports";
import ExportsList from "./ExportsList";

const exportJobs = [completedExportJob, processingExportJob, failedExportJob];

describe("ExportsList", () => {
  it("renders all export jobs", () => {
    renderWithProviders(<ExportsList exportJobs={exportJobs} />);

    expect(screen.getByText(completedExportJob.name)).toBeInTheDocument();
    expect(screen.getByText(processingExportJob.name)).toBeInTheDocument();
    expect(screen.getByText(failedExportJob.name)).toBeInTheDocument();
  });

  it("renders the type labels", () => {
    renderWithProviders(<ExportsList exportJobs={exportJobs} />);

    const typeCells = screen.getAllByText("Instances");
    expect(typeCells.length).toBe(3);
  });

  it('renders "Instances in report" as the type label for report exports', () => {
    renderWithProviders(<ExportsList exportJobs={[newComplianceExportJob]} />);

    expect(screen.getByText("Instances in report")).toBeInTheDocument();
  });

  it("renders the status labels", () => {
    renderWithProviders(<ExportsList exportJobs={exportJobs} />);

    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("renders a progress bar for processing jobs", () => {
    renderWithProviders(<ExportsList exportJobs={exportJobs} />);

    expect(screen.getByText("35%")).toBeInTheDocument();
  });

  it("renders sortable header columns", () => {
    renderWithProviders(<ExportsList exportJobs={exportJobs} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Expires")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("shows empty message when no export jobs", () => {
    renderWithProviders(<ExportsList exportJobs={[]} />);

    expect(
      screen.getByText("No exports found according to your search parameters."),
    ).toBeInTheDocument();
  });

  it("renders actions menu for each job", async () => {
    renderWithProviders(<ExportsList exportJobs={exportJobs} />);

    const actionButtons = screen.getAllByRole("button", {
      name: /actions for/i,
    });
    expect(actionButtons.length).toBe(3);
  });
});
