import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import DesktopHeader from "./DesktopHeader";

describe("DesktopHeader", () => {
  const user = userEvent.setup();

  const renderComponent = (closeMenu = vi.fn(), logoPath?: string) =>
    render(
      <MemoryRouter>
        <DesktopHeader closeMenu={closeMenu} logoPath={logoPath} />
      </MemoryRouter>,
    );

  it("renders the logo image", () => {
    renderComponent();
    const logoImages = screen.getAllByAltText(/landscape/i);
    expect(logoImages.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the close navigation button", () => {
    renderComponent();
    expect(
      screen.getByRole("button", { name: /close navigation/i }),
    ).toBeInTheDocument();
  });

  it("calls closeMenu when the close navigation button is clicked", async () => {
    const closeMenu = vi.fn();
    renderComponent(closeMenu);

    await user.click(screen.getByRole("button", { name: /close navigation/i }));
    expect(closeMenu).toHaveBeenCalledOnce();
  });

  it("renders a link to the root route", () => {
    renderComponent();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });

  it("links the logo to the given path", () => {
    renderComponent(vi.fn(), "/super-admin/accounts/acme/session");
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/super-admin/accounts/acme/session",
    );
  });
});
