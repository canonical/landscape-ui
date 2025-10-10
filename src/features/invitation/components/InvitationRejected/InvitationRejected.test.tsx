import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import InvitationRejected from "./InvitationRejected";

describe("InvitationRejected", () => {
  it("should render the rejection message", () => {
    renderWithProviders(<InvitationRejected />);

    expect(
      screen.getByText("You have rejected the invitation"),
    ).toBeInTheDocument();
  });
});
