import { renderWithProviders } from "@/tests/render";
import { describe, expect, it } from "vitest";
import AddLocalRepositoryButton from "./AddLocalRepositoryButton";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

describe("AddLocalRepositoryButton", () => {
  it("renders the button with correct label and styling", () => {
    renderWithProviders(<AddLocalRepositoryButton />);

    const button = screen.getByRole("button", {
      name: /add local repository/i,
    });
    expect(button).toHaveClass("p-button--positive");
    expect(button).toHaveIcon("plus");
  });

  it("opens add form when clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <AddLocalRepositoryButton />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /add local repository/i,
      }),
    );

    expect(screen.getByTestId("location")).toHaveTextContent("sidePath=add");
  });
});
