import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesList from ".";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePageParams } from "@/hooks/usePageParams";

vi.mock("@/hooks/usePageParams");

describe("AutoinstallFilesList", () => {
  it("should open a side panel", async () => {
    vi.mocked(usePageParams).mockReturnValue({
      accessGroups: [""],
      availabilityZones: [""],
      currentPage: 0,
      days: 0,
      disabledColumns: [""],
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
    });

    renderWithProviders(
      <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "default.yaml" }));
  });

  it("should use search params", async () => {
    vi.mocked(usePageParams).mockReturnValue({
      accessGroups: [""],
      availabilityZones: [""],
      currentPage: 0,
      days: 0,
      disabledColumns: [""],
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
    });

    renderWithProviders(
      <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />,
    );

    expect(screen.getByText("default.yaml")).toBeInTheDocument();
    expect(screen.queryByText("medium.yaml")).not.toBeInTheDocument();
  });
});
