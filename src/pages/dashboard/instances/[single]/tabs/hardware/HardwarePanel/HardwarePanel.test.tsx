import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { instanceWithHardware, ubuntuInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import HardwarePanel from "./HardwarePanel";

describe("HardwarePanel", () => {
  it("shows 'Hardware information unavailable' when grouped_hardware is not set", () => {
    const instance = { ...ubuntuInstance, grouped_hardware: undefined };
    renderWithProviders(<HardwarePanel instance={instance} />);

    expect(
      screen.getByText(/hardware information unavailable/i),
    ).toBeInTheDocument();
  });

  it("shows hardware info when grouped_hardware is available", () => {
    renderWithProviders(<HardwarePanel instance={instanceWithHardware} />);

    expect(screen.getByRole("heading", { name: "System" })).toBeInTheDocument();
    expect(screen.getByText("ThinkPad X1")).toBeInTheDocument();
  });
});
