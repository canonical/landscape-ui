import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesHeader from "./AutoinstallFilesHeader";

describe("AutoinstallFilesHeader", () => {
  it("should render", async () => {
    renderWithProviders(
      <AutoinstallFilesHeader
        employeeGroupOptions={[]}
        handleEmployeeGroupSelect={vi.fn()}
        openAddForm={vi.fn()}
        selectedEmployeeGroup=""
      />,
    );
  });
});
