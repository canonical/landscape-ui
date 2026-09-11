import { renderWithProviders } from "@/tests/render";
import AdministratorsPanel from "./AdministratorsPanel";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ADMINISTRATORS_DOCUMENTATION_URL } from "@/constants";

describe("AdministratorsPanel", () => {
  const user = userEvent.setup();

  it("renders without crashing", () => {
    renderWithProviders(
      <AdministratorsPanel administrators={[]} handleInvite={vi.fn()} />,
    );

    expect(
      screen.getByText(
        /there are no administrators in your landscape organization./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders an empty state", () => {
    renderWithProviders(
      <AdministratorsPanel administrators={[]} handleInvite={vi.fn()} />,
    );

    const emptyState = screen.getByText(
      /there are no administrators in your landscape organization./i,
    );
    expect(emptyState).toBeInTheDocument();
  });

  it("renders docs link with expected href in empty state", () => {
    renderWithProviders(
      <AdministratorsPanel administrators={[]} handleInvite={vi.fn()} />,
    );

    const docsLink = screen.getByRole("link", {
      name: /how to manage administrators in landscape/i,
    });

    expect(docsLink).toHaveAttribute("href", ADMINISTRATORS_DOCUMENTATION_URL);
  });

  it("calls handleInvite when clicking invite administrator on empty state", async () => {
    const handleInvite = vi.fn();
    renderWithProviders(
      <AdministratorsPanel administrators={[]} handleInvite={handleInvite} />,
    );

    const emptyState = screen.getByText(
      /there are no administrators in your landscape organization./i,
    );
    expect(emptyState).toBeInTheDocument();

    const inviteButton = screen.getByRole("button", {
      name: /invite administrator/i,
    });
    expect(inviteButton).toBeInTheDocument();

    await user.click(inviteButton);

    expect(handleInvite).toHaveBeenCalledTimes(1);
  });
});
