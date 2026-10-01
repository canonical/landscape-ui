import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SnapNotification from "./SnapNotification";

describe("SnapNotification", () => {
  it("renders the hold notification", () => {
    renderWithProviders(<SnapNotification action="hold" />);

    expect(
      screen.getByText("Landscape holds snaps indefinitely"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /held indefinitely from the moment the client executes/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the install notification", () => {
    renderWithProviders(<SnapNotification action="install" />);

    expect(
      screen.getByText(/revision doesn't change the tracked channel/i),
    ).toBeInTheDocument();
  });
});
