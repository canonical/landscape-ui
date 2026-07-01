import { API_URL_OLD } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import server from "@/tests/server";
import { isAction } from "@/tests/server/handlers/_helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import ReportForm from "./ReportForm";

describe("ReportForm", () => {
  it("renders report controls", () => {
    renderWithProviders(<ReportForm instanceIds={[1, 2]} />);

    expect(screen.getByLabelText("Report by CVE")).toBeInTheDocument();
    expect(screen.getByLabelText("Range")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Download" }),
    ).toBeInTheDocument();
  });

  it("downloads CSV when submitting the form", async () => {
    const user = userEvent.setup();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    const createObjectUrl = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:report");

    renderWithProviders(<ReportForm instanceIds={[3]} />);

    await user.click(screen.getByRole("button", { name: "Download" }));

    expect(createObjectUrl).toHaveBeenCalledTimes(1);

    const [csvBlob] = createObjectUrl.mock.calls[0] ?? [];
    expect(csvBlob).toBeInstanceOf(Blob);
    expect(await (csvBlob as Blob).text()).toContain("name,status");

    expect(clickSpy).toHaveBeenCalledTimes(1);

    clickSpy.mockRestore();
    createObjectUrl.mockRestore();
  });

  it("sends the selected range and grouping to the server", async () => {
    const user = userEvent.setup();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      () => undefined,
    );
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:report");

    let requestUrl: URL | null = null;
    server.use(
      http.get(API_URL_OLD, ({ request }) => {
        if (!isAction(request, "GetCSVComplianceData")) {
          return;
        }
        requestUrl = new URL(request.url);
        return HttpResponse.json("name,status\ninstance-1,ok");
      }),
    );

    renderWithProviders(<ReportForm instanceIds={[3]} />);

    const rangeInput = screen.getByLabelText("Range");
    await user.clear(rangeInput);
    await user.type(rangeInput, "7");
    await user.click(screen.getByLabelText("Report by CVE")); // default true -> false

    await user.click(screen.getByRole("button", { name: "Download" }));

    const params = (requestUrl as unknown as URL).searchParams;
    expect(params.get("query")).toBe("id:3");
    expect(params.get("max_days")).toBe("7");
    expect(params.get("by_cve")).toBe("false");

    vi.restoreAllMocks();
  });

  it("downloads empty CSV when endpoint is empty", async () => {
    const user = userEvent.setup();
    const createObjectUrl = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:report");
    setEndpointStatus({ status: "empty", path: "reports" });

    renderWithProviders(<ReportForm instanceIds={[3]} />);

    await user.click(screen.getByRole("button", { name: "Download" }));

    const [csvBlob] = createObjectUrl.mock.calls[0] ?? [];
    expect(csvBlob).toBeInstanceOf(Blob);
    expect(await (csvBlob as Blob).text()).toBe("");

    createObjectUrl.mockRestore();
  });
});
