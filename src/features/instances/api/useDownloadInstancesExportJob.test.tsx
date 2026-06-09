import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import server from "@/tests/server";
import { renderHookWithProviders } from "@/tests/render";
import { API_URL } from "@/constants";
import type { InstancesExportJob } from "../types/InstancesExportJob";
import { useDownloadInstancesExportJob } from "./useDownloadInstancesExportJob";
import { http, HttpResponse } from "msw";
import { setEndpointStatus } from "@/tests/controllers/controller";

const job = {
  id: "42",
  filename: "instances-export-2026-06-08-120000.tsv",
  name: "My export",
  status: "completed",
  progress: 100,
  downloadReady: true,
} as unknown as InstancesExportJob;

const removeSaveFilePicker = () => {
  delete (window as unknown as Record<string, unknown>).showSaveFilePicker;
};

const renderDownloadHook = () =>
  renderHook(() => useDownloadInstancesExportJob(), {
    wrapper: renderHookWithProviders(),
  }).result;

describe("useDownloadInstancesExportJob", () => {
  beforeEach(() => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    vi.spyOn(URL, "revokeObjectURL").mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    removeSaveFilePicker();
  });

  it("saves to file via showSaveFilePicker when the File System Access API is available", async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    const close = vi.fn().mockResolvedValue(undefined);
    const createWritable = vi.fn().mockResolvedValue({ write, close });
    const showSaveFilePicker = vi.fn().mockResolvedValue({ createWritable });
    (window as unknown as Record<string, unknown>).showSaveFilePicker =
      showSaveFilePicker;

    const result = renderDownloadHook();
    await result.current.downloadInstancesExportJob(job);

    expect(showSaveFilePicker).toHaveBeenCalledWith({
      suggestedName: job.filename,
    });
    expect(write).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it("falls back to a blob download when the File System Access API is unavailable", async () => {
    removeSaveFilePicker();

    const result = renderDownloadHook();
    await result.current.downloadInstancesExportJob(job);

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("rejects without downloading when the save dialog is cancelled", async () => {
    const showSaveFilePicker = vi
      .fn()
      .mockRejectedValue(new DOMException("The user aborted", "AbortError"));
    (window as unknown as Record<string, unknown>).showSaveFilePicker =
      showSaveFilePicker;

    const result = renderDownloadHook();

    await expect(
      result.current.downloadInstancesExportJob(job),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it("throws when the server request fails", async () => {
    setEndpointStatus({
      status: "error",
      path: "computers/exports/:jobId/download",
    });

    const result = renderDownloadHook();

    await expect(
      result.current.downloadInstancesExportJob(job),
    ).rejects.toThrow();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it("uses the job filename as the suggested save name", async () => {
    const showSaveFilePicker = vi.fn().mockResolvedValue({
      createWritable: vi.fn().mockResolvedValue({
        write: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined),
      }),
    });
    (window as unknown as Record<string, unknown>).showSaveFilePicker =
      showSaveFilePicker;

    server.use(
      http.get(`${API_URL}computers/exports/:jobId/download`, () =>
        new HttpResponse("data", {
          headers: {
            "Content-Disposition": `attachment; filename="${job.filename}"`,
            "Content-Type": "text/tab-separated-values",
          },
        }),
      ),
    );

    const result = renderDownloadHook();
    await result.current.downloadInstancesExportJob(job);

    expect(showSaveFilePicker).toHaveBeenCalledWith({
      suggestedName: job.filename,
    });
  });
});
