import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackagesInstallButton from "./PackagesInstallButton";

describe("PackagesInstallButton", () => {
  const user = userEvent.setup();

  it("renders install button with positive appearance", () => {
    renderWithProviders(<PackagesInstallButton />);

    const button = screen.getByRole("button", { name: "Install" });
    expect(button).toBeInTheDocument();
  });

  it("opens install packages form when button is clicked", async () => {
    renderWithProviders(<PackagesInstallButton />);

    await user.click(screen.getByRole("button", { name: "Install" }));

    expect(
      await screen.findByRole("heading", { name: "Install packages" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });
});
