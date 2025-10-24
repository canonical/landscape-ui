import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import NoAccess from "./NoAccess";

describe("NoAccess", () => {
  it("should render the no access message", () => {
    renderWithProviders(<NoAccess />);

    expect(
      screen.getByText(
        "Contact an administrator to get invited to this organization.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });
});
