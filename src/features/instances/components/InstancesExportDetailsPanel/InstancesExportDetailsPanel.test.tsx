import server from "@/tests/server";
import { renderWithProviders } from "@/tests/render";
import { API_URL } from "@/constants";
import {
  completedExportJob,
  failedExportJob,
  processingExportJob,
} from "@/tests/mocks/instancesExport";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import InstancesExportDetailsPanel from "./InstancesExportDetailsPanel";

describe("InstancesExportDetailsPanel", () => {
  it("renders an empty state when there are no export jobs", async () => {
    renderWithProviders(<InstancesExportDetailsPanel />);

    expect(
      await screen.findByText(/no tsv exports in progress/i),
    ).toBeInTheDocument();
  });

  it("renders tracked processing and completed exports", async () => {
    server.use(
      http.get(`${API_URL}computers/exports`, () =>
        HttpResponse.json({
          count: 2,
          results: [processingExportJob, completedExportJob],
        }),
      ),
    );

    renderWithProviders(<InstancesExportDetailsPanel />);

    expect(
      await screen.findByText(processingExportJob.name),
    ).toBeInTheDocument();
    expect(screen.getByText(completedExportJob.name)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("35%")).toBeInTheDocument();
    expect(screen.getByText("Estimating...")).toBeInTheDocument();
    expect(screen.getByText(/^ready$/i)).toBeInTheDocument();
  });

  it("renders failed exports and hides canceled exports", async () => {
    server.use(
      http.get(`${API_URL}computers/exports`, () =>
        HttpResponse.json({ count: 1, results: [failedExportJob] }),
      ),
    );

    renderWithProviders(<InstancesExportDetailsPanel />);

    expect(await screen.findByText(failedExportJob.name)).toBeInTheDocument();
    expect(screen.getByText(/^failed$/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/generating \(100%\)/i),
    ).not.toBeInTheDocument();
  });

  it("discards a failed export and shows a confirmation notification", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${API_URL}computers/exports`, () =>
        HttpResponse.json({ count: 1, results: [failedExportJob] }),
      ),
    );

    renderWithProviders(<InstancesExportDetailsPanel />);

    await user.click(
      await screen.findByRole("button", {
        name: new RegExp(`actions for ${failedExportJob.name}`, "i"),
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: /discard/i }));

    expect(
      await screen.findByText(/tsv discarded/i),
    ).toBeInTheDocument();
  });

  it("cancels an in-progress export and shows a confirmation notification", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${API_URL}computers/exports`, () =>
        HttpResponse.json({ count: 1, results: [processingExportJob] }),
      ),
    );

    renderWithProviders(<InstancesExportDetailsPanel />);

    await user.click(
      await screen.findByRole("button", {
        name: new RegExp(`actions for ${processingExportJob.name}`, "i"),
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: /cancel/i }));

    expect(
      await screen.findByText(/tsv generation cancelled/i),
    ).toBeInTheDocument();
  });

  it("downloads a completed export and shows a confirmation notification", async () => {
    const user = userEvent.setup();
    const write = vi.fn().mockResolvedValue(undefined);
    const close = vi.fn().mockResolvedValue(undefined);
    const showSaveFilePicker = vi
      .fn()
      .mockResolvedValue({ createWritable: vi.fn().mockResolvedValue({ write, close }) });
    (window as unknown as Record<string, unknown>).showSaveFilePicker =
      showSaveFilePicker;

    server.use(
      http.get(`${API_URL}computers/exports`, () =>
        HttpResponse.json({ count: 1, results: [completedExportJob] }),
      ),
    );

    renderWithProviders(<InstancesExportDetailsPanel />);

    await user.click(
      await screen.findByRole("button", {
        name: new RegExp(`actions for ${completedExportJob.name}`, "i"),
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: /download/i }));

    await waitFor(() => {
      expect(write).toHaveBeenCalledTimes(1);
    });
    expect(
      await screen.findByText(/tsv download started/i),
    ).toBeInTheDocument();

    delete (window as unknown as Record<string, unknown>).showSaveFilePicker;
  });

  it("discards a completed export without downloading it", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${API_URL}computers/exports`, () =>
        HttpResponse.json({ count: 1, results: [completedExportJob] }),
      ),
    );

    renderWithProviders(<InstancesExportDetailsPanel />);

    await user.click(
      await screen.findByRole("button", {
        name: new RegExp(`actions for ${completedExportJob.name}`, "i"),
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: /discard/i }));

    expect(
      await screen.findByText(/tsv discarded/i),
    ).toBeInTheDocument();
  });
});
