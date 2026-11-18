import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("toggles the CVE sort direction when the column header is used", async () => {
    const user = userEvent.setup();

    renderWithProviders(<KernelTableList kernelData={patches} />);

    const header = screen.getByRole("columnheader", { name: /CVE/i });

    expect(header).toHaveAttribute("aria-sort", "ascending");

    await user.click(screen.getByRole("button", { name: /CVE/i }));

    expect(header).toHaveAttribute("aria-sort", "descending");
  });

  it("shows the patch status of each fix", () => {
    renderWithProviders(<KernelTableList kernelData={patches} />);

    const patchedCount = patches.filter(({ Patched }) => Patched).length;

    expect(screen.getAllByText("Patched by Livepatch")).toHaveLength(
      patchedCount,
    );
    expect(screen.getAllByText("Unpatched")).toHaveLength(
      patches.length - patchedCount,
    );
  });
});
