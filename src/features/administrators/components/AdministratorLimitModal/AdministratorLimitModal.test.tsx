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

  it("renders error message when the limit is undetermined", () => {
    renderWithProviders(
      <AdministratorLimitModal close={vi.fn()} isAdminInfoError />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Remaining invitations cannot be determined",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/new invitations are temporarily disabled/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/try again later or contact our support team/i),
    ).toBeInTheDocument();
  });

  it("calls close when the footer close button is clicked", async () => {
    const close = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<AdministratorLimitModal close={close} />);

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(close).toHaveBeenCalledTimes(1);
  });

  it("calls close when the modal header close button is clicked", async () => {
    const close = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<AdministratorLimitModal close={close} />);

    await user.click(
      screen.getByRole("button", { name: "Close active modal" }),
    );

    expect(close).toHaveBeenCalledTimes(1);
  });
});
