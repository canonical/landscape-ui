import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesList from "./AutoinstallFilesList";

describe("AutoinstallFilesList", () => {
  it("should render", async () => {
    renderWithProviders(
      <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />,
    );
  });
});
