import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OperationErrorNotification from "./OperationErrorNotification";

describe("OperationErrorNotification", () => {
  const props = {
    title: "Update failed",
    message: "Your last update was not completed successfully.",
  };

  it("renders the notification with title and message when visible", () => {
    renderWithProviders(<OperationErrorNotification isVisible {...props} />);

    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.message)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /view logs/i }),
    ).toBeInTheDocument();
  });

  it("does not render the notification when not visible", () => {
    renderWithProviders(
      <OperationErrorNotification isVisible={false} {...props} />,
    );

    expect(screen.queryByText(props.title)).not.toBeInTheDocument();
    expect(screen.queryByText(props.message)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /view logs/i }),
    ).not.toBeInTheDocument();
  });
});
