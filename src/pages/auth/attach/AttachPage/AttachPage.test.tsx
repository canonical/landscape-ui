import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AttachPage from "./AttachPage";

const mockUseLocation = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  };
});

describe("AttachPage", () => {
  it("shows OTPInputContainer by default", async () => {
    mockUseLocation.mockReturnValue({ state: null, pathname: "/attach" });

    renderWithProviders(<AttachPage />);

    expect(
      await screen.findByText(/Enter code to connect to the Ubuntu installer/),
    ).toBeInTheDocument();
  });

  it("shows SuccessfulAttachPage when location.state.success is true", async () => {
    mockUseLocation.mockReturnValue({
      state: { success: true },
      pathname: "/attach",
    });

    renderWithProviders(<AttachPage />);

    expect(await screen.findByText("Sign in successful")).toBeInTheDocument();
  });
});
