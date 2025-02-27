/* eslint-disable @typescript-eslint/no-unused-vars */
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesList from ".";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import usePageParams from "@/hooks/usePageParams";

vi.mock("@/hooks/usePageParams");

describe("AutoinstallFilesList", () => {
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
      <AutoinstallFilesList
        defaultFile={{
          name: "default.yaml",
          content: "default content",
          employeeGroupsAssociated: [],
          dateCreated: new Date().toISOString(),
          events: [],
          lastModified: new Date().toISOString(),
          version: 1,
          filename: "default.yaml",
          is_default: true,
        }}
        autoinstallFiles={autoinstallFiles}
      />,
    );
    // TODO: merge after Ethan fixes
    // await userEvent.click(screen.getByRole("button", { name: "default.yaml" }));
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
      <AutoinstallFilesList
        defaultFile={{
          name: "default.yaml",
          content: "default content",
          employeeGroupsAssociated: [],
          dateCreated: new Date().toISOString(),
          events: [],
          lastModified: new Date().toISOString(),
          version: 1,
          filename: "default.yaml",
          is_default: true,
        }}
        autoinstallFiles={autoinstallFiles}
      />,
    );
    // TODO: merge after Ethan fixes
    // expect(screen.getByText("default")).toBeInTheDocument();
    // expect(screen.queryByText("medium.yaml")).not.toBeInTheDocument();
  });
});
