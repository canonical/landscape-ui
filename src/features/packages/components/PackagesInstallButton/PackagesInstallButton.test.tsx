import { renderWithProviders } from "@/tests/render";
import LocationDisplay from "@/tests/LocationDisplay";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackagesInstallButton from "./PackagesInstallButton";

describe("PackagesInstallButton", () => {
  const user = userEvent.setup();

  it("renders install button with positive appearance", () => {
    renderWithProviders(<PackagesInstallButton />);

    expect(
      screen.getByRole("button", { name: /install/i }),
    ).toBeInTheDocument();
  });

  it("opens install packages form when button is clicked", async () => {
    renderWithProviders(
      <>
        <PackagesInstallButton />
        <LocationDisplay />
      </>
    );

    await user.click(screen.getByRole("button", { name: "Install" }));

    expect(await screen.findByTestId("location")).toHaveTextContent(
      "sidePath=install"
    );
  });
});
