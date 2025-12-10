import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { OTP_LENGTH } from "../../constants";
import OTPInput from "./OTPInput";

describe("OTPInput", () => {
  const props: ComponentProps<typeof OTPInput> = {
    value: new Array(OTP_LENGTH).fill(""),
    onChange: vi.fn(),
    onComplete: vi.fn(),
    error: undefined,
  };

  it("should render the correct number of inputs", () => {
    render(<OTPInput {...props} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(OTP_LENGTH);
  });

  it("should focus the first input on initial render", () => {
    render(<OTPInput {...props} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveFocus();
  });

  it("should display an error message when the error prop is provided", () => {
    const errorMessage = "Invalid OTP, please try again.";
    render(<OTPInput {...props} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should not display an error message when the error prop is absent", () => {
    const errorMessage = "Invalid OTP, please try again.";
    render(<OTPInput {...props} />);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it("should handle single character input and move focus to the next input", async () => {
    const { rerender } = render(<OTPInput {...props} />);
    const inputs = screen.getAllByRole("textbox");

    assert(inputs[0]);
    await userEvent.type(inputs[0], "1");

    const newValue = ["1", "", "", "", "", ""];
    rerender(<OTPInput {...props} value={newValue} />);

    await waitFor(() => {
      expect(inputs[1]).toHaveFocus();
    });
    expect(props.onChange).toHaveBeenCalledWith(newValue);
  });

  it("should call onComplete when all inputs are filled", async () => {
    render(<OTPInput {...props} value={["1", "2", "3", "4", "5", ""]} />);
    const inputs = screen.getAllByRole("textbox");

    expect(props.onComplete).not.toHaveBeenCalled();

    assert(inputs[5]);
    await userEvent.type(inputs[5], "6");

    expect(props.onComplete).toHaveBeenCalled();
  });

  it("should handle backspace by clearing the input and moving focus to the previous one", async () => {
    render(<OTPInput {...props} value={["1", "2", "", "", "", ""]} />);
    const inputs = screen.getAllByRole("textbox");

    assert(inputs[2]);
    inputs[2].focus();
    expect(inputs[2]).toHaveFocus();

    await userEvent.keyboard("{backspace}");
    expect(inputs[1]).toHaveFocus();

    await userEvent.keyboard("{backspace}");
    expect(props.onChange).toHaveBeenCalledWith(["1", "", "", "", "", ""]);
  });

  it("should handle pasting a valid OTP value", () => {
    const pastedValue = "123456";
    render(<OTPInput {...props} />);
    const [firstInput] = screen.getAllByRole("textbox");

    assert(firstInput);
    fireEvent.paste(firstInput, {
      clipboardData: { getData: () => pastedValue },
    });

    expect(props.onChange).toHaveBeenCalledWith(pastedValue.split(""));
    expect(props.onComplete).toHaveBeenCalled();
  });

  it("should handle pasting a value shorter than the OTP length", async () => {
    const pastedValue = "123";
    const newValue = ["1", "2", "3", "", "", ""];
    const { rerender } = render(<OTPInput {...props} />);
    const inputs = screen.getAllByRole("textbox");
    const [firstInput] = inputs;

    assert(firstInput);
    fireEvent.paste(firstInput, {
      clipboardData: { getData: () => pastedValue },
    });

    rerender(<OTPInput {...props} value={newValue} />);

    await waitFor(() => {
      expect(inputs[3]).toHaveFocus();
    });
    expect(props.onChange).toHaveBeenCalledWith(newValue);
  });

  it("should truncate a pasted value that is too long", () => {
    const pastedValue = "123456789";
    render(<OTPInput {...props} />);
    const [firstInput] = screen.getAllByRole("textbox");

    assert(firstInput);
    fireEvent.paste(firstInput, {
      clipboardData: { getData: () => pastedValue },
    });

    const expectedValue = pastedValue.slice(0, OTP_LENGTH).split("");
    expect(props.onChange).toHaveBeenCalledWith(expectedValue);
    expect(props.onComplete).toHaveBeenCalled();
  });

  it("should filter out non-alphanumeric characters on paste", () => {
    const pastedValue = "1a-2b 3c";
    render(<OTPInput {...props} />);
    const [firstInput] = screen.getAllByRole("textbox");

    assert(firstInput);
    fireEvent.paste(firstInput, {
      clipboardData: { getData: () => pastedValue },
    });

    const expectedValue = "1a2b3c".split("");
    expect(props.onChange).toHaveBeenCalledWith(expectedValue);
    expect(props.onComplete).toHaveBeenCalled();
  });
});
