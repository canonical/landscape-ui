import { describe } from "vitest";
import { renderWithProviders } from "@/tests/render";
import ProvidersEmptyState from "./ProvidersEmptyState";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ProvidersEmptyState", () => {
  it("should render correctly", async () => {
    renderWithProviders(<ProvidersEmptyState />);

    expect(
      screen.getByText("You haven’t added any identity providers yet."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "How to manage computers in Landscape",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Add identity provider" }),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Add identity provider" }),
    );

    expect(
      screen.getByRole("heading", { name: "Choose an identity provider" }),
    ).toBeInTheDocument();
  });
});
