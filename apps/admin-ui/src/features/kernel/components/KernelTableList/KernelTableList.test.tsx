import { renderWithProviders } from "@/tests/render";
import KernelTableList from "./KernelTableList";
import { patches } from "@/tests/mocks/kernel";

describe("KernelTableList", () => {
  it("renders table columns", async () => {
    const { container } = renderWithProviders(
      <KernelTableList kernelData={patches} />,
    );

    const columns = ["CVE", "Status", "Description", "Bug"];
    expect(container).toHaveTexts(columns);
  });
});
