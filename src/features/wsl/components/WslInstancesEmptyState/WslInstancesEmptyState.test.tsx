import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import WslInstancesEmptyState from "./WslInstancesEmptyState";
import LocationDisplay from "@/tests/LocationDisplay";

describe("WslInstancesEmptyState", () => {
  it("should allow you to install a new instance", async () => {
    renderWithProviders(
      <>
        <WslInstancesEmptyState />
        <LocationDisplay />
      </>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Create new WSL instance" }),
    );

    expect(screen.getByTestId("location")).toHaveTextContent("?sidePath=install-wsl");
  });
});
