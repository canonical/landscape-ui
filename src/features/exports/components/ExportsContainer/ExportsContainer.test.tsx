import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import {
  completedExportJob,
  processingExportJob,
  failedExportJob,
  completedActivitiesExportJob,
} from "@/tests/mocks/exports";
import ExportsContainer from "./ExportsContainer";

const exportJobs = [
  completedExportJob,
  processingExportJob,
  failedExportJob,
  completedActivitiesExportJob,
];

describe("ExportsContainer", () => {
  it("renders empty state when there are no exports", async () => {
    setEndpointStatus({ status: "empty", path: "exports" });

    renderWithProviders(<ExportsContainer />);

    await expectLoadingState();

    expect(screen.getByText("No exports found")).toBeInTheDocument();
  });

  it("renders the export list with data", async () => {
    setEndpointStatus({
      status: "variant",
      path: "exports",
      response: exportJobs,
    });

    renderWithProviders(<ExportsContainer />);

    await expectLoadingState();

    expect(screen.getByText(completedExportJob.name)).toBeInTheDocument();
    expect(screen.getByText(processingExportJob.name)).toBeInTheDocument();
    expect(
      screen.getByText(completedActivitiesExportJob.name),
    ).toBeInTheDocument();
  });

  it("renders the type filter", async () => {
    setEndpointStatus({
      status: "variant",
      path: "exports",
      response: exportJobs,
    });

    renderWithProviders(<ExportsContainer />);

    await expectLoadingState();

    expect(screen.getByRole("button", { name: /type/i })).toBeInTheDocument();
  });
});
