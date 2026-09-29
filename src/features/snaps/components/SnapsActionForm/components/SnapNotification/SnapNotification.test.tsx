import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
      screen.getByText("Instances of multiple architectures selected"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/will only be installed on compatible instances/i),
    ).toBeInTheDocument();
  });

  it("dismisses the install notification", async () => {
    renderWithProviders(<SnapNotification action="install" />);

    const dismissButton = screen.getByRole("button", {
      name: /Close notification/i,
    });
    await userEvent.click(dismissButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Instances of multiple architectures selected"),
      ).not.toBeInTheDocument();
    });
  });
});
