import usePageParams from "@/hooks/usePageParams";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import AutoinstallFilesList from "./AutoinstallFilesList";

vi.mock("@/hooks/usePageParams");

describe("AutoinstallFilesList", () => {
  const [autoinstallFile1, autoinstallFile2] = autoinstallFiles;

  it("should open a side panel", async () => {
    vi.mocked(usePageParams).mockReturnValue({
      accessGroups: [""],
      availabilityZones: [""],
      currentPage: 0,
      days: "7",
      disabledColumns: [""],
      employeeGroups: [],
      fromDate: "",
      groupBy: "",
      os: "",
      pageSize: 20,
      search: "",
      setPageParams: () => undefined,
      status: "",
      tab: "",
      tags: [""],
      toDate: "",
      type: "",
      sort: null,
      sortBy: "",
      query: "",
    });

    renderWithProviders(
      <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: `${autoinstallFile1.filename}, v${autoinstallFile1.version}`,
      }),
    );
  });

  it("should use search params", async () => {
    vi.mocked(usePageParams).mockReturnValue({
      accessGroups: [""],
      availabilityZones: [""],
      currentPage: 0,
      days: "7",
      disabledColumns: [""],
      employeeGroups: [],
      fromDate: "",
      groupBy: "",
      os: "",
      pageSize: 0,
      search: "def",
      setPageParams: () => undefined,
      status: "",
      tab: "",
      tags: [""],
      toDate: "",
      type: "",
      sort: null,
      sortBy: "",
      query: "",
    });

    renderWithProviders(
      <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />,
    );

    expect(
      screen.getByText(
        `${autoinstallFile1.filename}, v${autoinstallFile1.version}`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        `${autoinstallFile2.filename}, v${autoinstallFile2.version}`,
      ),
    ).not.toBeInTheDocument();
  });
});
