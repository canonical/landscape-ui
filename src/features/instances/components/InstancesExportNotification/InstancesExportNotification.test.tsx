import server from "@/tests/server";
import { renderWithProviders } from "@/tests/render";
import { API_URL } from "@/constants";
import {
  completedExportJob,
  processingExportJob,
} from "@/tests/mocks/instancesExport";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import InstancesExportNotification from "./InstancesExportNotification";

describe("InstancesExportNotification", () => {
  it("does not render when there are no exports", async () => {
    renderWithProviders(<InstancesExportNotification />);

    // Wait for the initial fetch to settle, then assert nothing rendered.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(
      screen.queryByRole("heading", { name: /tsv exports/i }),
    ).not.toBeInTheDocument();
  });

  it("renders an in-progress message for active exports", async () => {
    server.use(
      http.get(`${API_URL}computers/exports`, () =>
        HttpResponse.json({ count: 1, results: [processingExportJob] }),
      ),
    );

    renderWithProviders(<InstancesExportNotification />);

    expect(
      await screen.findByRole("heading", { name: /tsv exports/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/your tsv export is being generated/i),
    ).toBeInTheDocument();
  });

  it("opens the export details side panel", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${API_URL}computers/exports`, () =>
        HttpResponse.json({
          count: 2,
          results: [processingExportJob, completedExportJob],
        }),
      ),
    );

    renderWithProviders(<InstancesExportNotification />);

    await user.click(
      await screen.findByRole("button", { name: /view export details/i }),
    );

    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: /tsv exports/i,
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/once you download a tsv, it is discarded/i),
    ).toBeInTheDocument();
  });
});
