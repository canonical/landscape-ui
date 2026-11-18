import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import {
  buildLivepatchInfo,
  kernelManagementInfo,
  unsortedPatches,
} from "@/tests/mocks/kernel";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError } from "axios";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import KernelDetails from "./KernelDetails";

const props: ComponentProps<typeof KernelDetails> = {
  kernelStatuses: kernelManagementInfo,
  livepatchInfo: buildLivepatchInfo(),
  livepatchInfoError: null,
  renderHeader: () => <h2>Test header</h2>,
};

const cveOrder = () =>
  screen
    .getAllByRole("link", { name: /^cve-/ })
    .map((link) => link.textContent);

describe("KernelDetails", () => {
  it("renders the header, overview and fixes", () => {
    const renderHeader = vi.fn(() => <h2>Test header</h2>);

    const { container } = renderWithProviders(
      <KernelDetails {...props} renderHeader={renderHeader} />,
    );

    expect(
      screen.getByRole("heading", { name: "Test header" }),
    ).toBeInTheDocument();
    expect(renderHeader).toHaveBeenCalledWith(true);
    expect(container).toHaveInfoItem(
      "current kernel version",
      "5.4.0-100-generic",
    );
    expect(screen.getByText("Kernel upgrade available")).toBeInTheDocument();
    expect(cveOrder()).toHaveLength(unsortedPatches.length);
  });

  it("falls back to the installed kernel version without Livepatch data", () => {
    const renderHeader = vi.fn(() => null);

    const { container } = renderWithProviders(
      <KernelDetails
        {...props}
        livepatchInfo={undefined}
        renderHeader={renderHeader}
      />,
    );

    expect(renderHeader).toHaveBeenCalledWith(false);
    expect(container).toHaveInfoItem("current kernel version", "5.4.0-100");
    expect(
      screen.getByText("No outstanding kernel patches"),
    ).toBeInTheDocument();
  });

  it("sorts the fixes by CVE", () => {
    renderWithProviders(<KernelDetails {...props} />);

    expect(cveOrder()).toEqual([
      "cve-2013-1700",
      "cve-2013-1800",
      "cve-2013-1900",
    ]);
  });

  it("sorts across pages before slicing", () => {
    const cveNames = Array.from(
      { length: DEFAULT_PAGE_SIZE + 5 },
      (_, index) => `cve-2013-${String(1000 + index)}`,
    );

    renderWithProviders(
      <KernelDetails
        {...props}
        livepatchInfo={buildLivepatchInfo(
          cveNames.toReversed().map((Name) => ({
            Name,
            Patched: false,
            Bug: "",
            Description: "",
          })),
        )}
      />,
      undefined,
      "/?currentPage=2",
    );

    expect(cveOrder()).toEqual(cveNames.slice(DEFAULT_PAGE_SIZE));
  });

  it("sorts descending across pages when the CVE header is used", async () => {
    const user = userEvent.setup();
    const cveNames = Array.from(
      { length: DEFAULT_PAGE_SIZE + 5 },
      (_, index) => `cve-2013-${String(1000 + index)}`,
    );

    renderWithProviders(
      <KernelDetails
        {...props}
        livepatchInfo={buildLivepatchInfo(
          cveNames.map((Name) => ({
            Name,
            Patched: false,
            Bug: "",
            Description: "",
          })),
        )}
      />,
    );

    await user.click(screen.getByRole("button", { name: /CVE/i }));

    expect(cveOrder()).toEqual(
      cveNames.toReversed().slice(0, DEFAULT_PAGE_SIZE),
    );
  });

  it("shows an empty state instead of the details when no kernel is installed", () => {
    const renderHeader = vi.fn(() => <h2>Test header</h2>);

    renderWithProviders(
      <KernelDetails
        {...props}
        kernelStatuses={{
          ...kernelManagementInfo,
          installed: null,
          message: "Kernel information is not available for this instance.",
        }}
        renderHeader={renderHeader}
      />,
    );

    expect(
      screen.getByText(
        "Kernel information is not available for this instance.",
      ),
    ).toBeInTheDocument();
    expect(renderHeader).not.toHaveBeenCalled();
  });

  it("uses a default message when no kernel is installed and none is given", () => {
    renderWithProviders(
      <KernelDetails
        {...props}
        kernelStatuses={{ ...kernelManagementInfo, installed: null }}
      />,
    );

    expect(
      screen.getByText("No kernel information available"),
    ).toBeInTheDocument();
  });

  it("shows an error in place of the fixes when Livepatch info fails", () => {
    const { container } = renderWithProviders(
      <KernelDetails
        {...props}
        livepatchInfo={undefined}
        livepatchInfoError={new AxiosError("Livepatch request failed")}
      />,
    );

    expect(
      screen.getByText("Error loading kernel patches"),
    ).toBeInTheDocument();
    expect(screen.getByText("Livepatch request failed")).toBeInTheDocument();
    expect(container).toHaveInfoItem("current kernel version", "5.4.0-100");
    expect(
      screen.queryByText("No outstanding kernel patches"),
    ).not.toBeInTheDocument();
  });

  it("uses the default message when the Livepatch error has none", () => {
    renderWithProviders(
      <KernelDetails
        {...props}
        livepatchInfo={undefined}
        livepatchInfoError={new AxiosError("")}
      />,
    );

    expect(
      screen.getByText(
        "There was an issue loading pending kernel security patches.",
      ),
    ).toBeInTheDocument();
  });
});
