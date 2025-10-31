import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import UbuntuProNotification from "./UbuntuProNotification";

const props: ComponentProps<typeof UbuntuProNotification> = {
  onDismiss: vi.fn(),
};

describe("UbuntuProNotification", () => {
  it("renders the notification message", () => {
    renderWithProviders(<UbuntuProNotification {...props} />);

    expect(
      screen.getByText(/Your current Ubuntu package upgrades are limited/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Learn more" }),
    ).toBeInTheDocument();
  });
});
