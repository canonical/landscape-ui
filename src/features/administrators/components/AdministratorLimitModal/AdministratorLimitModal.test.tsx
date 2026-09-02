import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdministratorLimitModal from "./AdministratorLimitModal";

describe("AdministratorLimitModal", () => {
  it("renders the administrator limit message", () => {
    renderWithProviders(<AdministratorLimitModal close={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Administrator limit reached" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/reached the maximum number of administrators/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/reach out to support/i)).toBeInTheDocument();
  });

  it("calls close when the modal is closed", async () => {
    const close = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<AdministratorLimitModal close={close} />);

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(close).toHaveBeenCalledTimes(1);
  });
});
