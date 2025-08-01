import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import OTPInputContainer from "./OTPInputContainer";

describe("OTPInputContainer", () => {
  const user = userEvent.setup();

  it("should render the component with the correct title", () => {
    renderWithProviders(<OTPInputContainer />);
    expect(
      screen.getByRole("heading", { name: /enter code to connect/i }),
    ).toBeInTheDocument();

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
  });

  it("should show a validation error if the code is not complete", async () => {
    renderWithProviders(<OTPInputContainer />);

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");

    const submitButton = screen.getByRole("button", { name: /next/i });
    await user.click(submitButton);

    const errorMessage = screen.getByText("Code must be 6 characters long");
    expect(errorMessage).toBeInTheDocument();
  });
});
