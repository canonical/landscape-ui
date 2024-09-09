import { describe } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import Upgrades from "./Upgrades";

describe("Upgrades", () => {
  it("should render tabs", async () => {
    renderWithProviders(<Upgrades selectedInstances={instances} />);

    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: /instances/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: /packages/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: /usns/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "tab-link-instances",
    );
    expect(
      await screen.findByText(/Showing \d of \d+ instances/i),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: /packages/i }));

    expect(screen.getByRole("tab", { name: /packages/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "tab-link-packages",
    );
    expect(
      await screen.findByText(/Showing \d of \d+ packages/i),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: /usns/i }));

    expect(screen.getByRole("tab", { name: /usns/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "tab-link-usns",
    );
    expect(
      await screen.findByText(/Showing \d of \d+ security issues/i),
    ).toBeInTheDocument();
  });
});
