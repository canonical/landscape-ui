import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesHeader from "./AutoinstallFilesHeader";

describe("AutoinstallFilesHeader", () => {
  it("should render", async () => {
    renderWithProviders(<AutoinstallFilesHeader openAddForm={vi.fn()} />);
  });
});
