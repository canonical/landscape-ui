import { describe } from "vitest";
import { screen } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import UsnsPanel from "./UsnsPanel";

describe("UsnsPanel", () => {
  it("should render USN panel after loading", async () => {
    renderWithProviders(
      <UsnsPanel
        instances={instances.filter(({ upgrades }) => upgrades?.security)}
      />,
    );

    await expectLoadingState();

    expect(
      screen.getByText(/showing \d of \d+ security issues/i),
    ).toBeInTheDocument();
  });
});
