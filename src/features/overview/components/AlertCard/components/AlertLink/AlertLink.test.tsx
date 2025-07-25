import { describe } from "vitest";
import AlertLink from "./AlertLink";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";

describe("AlertLink", () => {
  it("should render correct count", () => {
    renderWithProviders(<AlertLink count={2} to="/test" />);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("instances")).toBeInTheDocument();
  });

  it("should render link when 'to' prop provided", () => {
    renderWithProviders(<AlertLink count={2} to="/test" />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/test");
  });

  it("should render button when 'onClick' prop provided", async () => {
    const onClick = vi.fn();

    renderWithProviders(<AlertLink count={2} onClick={onClick} />);

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
