import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackagesInstallButton from "./PackagesInstallButton";

describe("PackagesInstallButton", () => {
  it("opens a form", async () => {
    const user = userEvent.setup();

    renderWithProviders(<PackagesInstallButton />);

    await user.click(screen.getByRole("button", { name: "Install" }));
    expect(
      await screen.findByRole("heading", { name: "Install packages" }),
    ).toBeInTheDocument();
  });
});
