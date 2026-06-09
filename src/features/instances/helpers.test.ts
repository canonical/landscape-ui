import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadInstancesCsv } from "./helpers";

describe("downloadInstancesCsv", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the provided filename and appends the tsv extension", () => {
    const link = {
      click: vi.fn(),
      download: "",
      href: "",
      remove: vi.fn(),
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, "createElement").mockReturnValue(link);
    vi.spyOn(document.body, "appendChild").mockReturnValue(link);
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:instances");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);

    downloadInstancesCsv({
      blob: new Blob(["csv"]),
      filename: "selected-apps-export",
    });

    expect(link.download).toBe("selected-apps-export.tsv");
    expect(link.href).toBe("blob:instances");
    expect(link.click).toHaveBeenCalledTimes(1);
    expect(link.remove).toHaveBeenCalledTimes(1);
  });
});
