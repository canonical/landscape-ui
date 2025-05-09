import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ScriptsContainer from "./ScriptsContainer";

describe("Scripts Empty State", () => {
  it("should empty state when there are no scripts", async () => {
    setEndpointStatus("empty");

    renderWithProviders(<ScriptsContainer />);

    await expectLoadingState();

    const emptyStateTitle = screen.getByText(/No scripts found/i);
    expect(emptyStateTitle).toBeInTheDocument();
  });

  it("should show scripts when there are scripts", async () => {
    setEndpointStatus("default");

    renderWithProviders(<ScriptsContainer />);

    await expectLoadingState();

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("should show scripts when there are scripts with search", async () => {
    const searchText = scripts[0].title;

    renderWithProviders(
      <ScriptsContainer />,
      undefined,
      `/scripts?search=${searchText}`,
    );

    scripts
      .filter(({ title }) => !title.includes(searchText))
      .forEach((script) => {
        expect(screen.queryByText(script.title)).not.toBeInTheDocument();
      });
  });
});
