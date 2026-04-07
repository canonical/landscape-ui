import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
