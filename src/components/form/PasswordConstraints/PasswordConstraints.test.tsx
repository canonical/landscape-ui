import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import PasswordConstraints from "./PasswordConstraints";

describe("PasswordConstraints", () => {
  it("renders all four constraint labels", () => {
    renderWithProviders(
      <PasswordConstraints password="" touched={false} hasError={false} />,
    );

    expect(screen.getByText("8-50 characters")).toBeInTheDocument();
    expect(screen.getByText("Lower case letters (a-z)")).toBeInTheDocument();
    expect(screen.getByText("Upper case letters (A-Z)")).toBeInTheDocument();
    expect(screen.getByText("Numbers (0-9)")).toBeInTheDocument();
  });

  it("shows the heading text", () => {
    renderWithProviders(
      <PasswordConstraints password="" touched={false} hasError={false} />,
    );

    expect(screen.getByText("Password must contain")).toBeInTheDocument();
  });

  it("marks length constraint as passed when password length is valid", () => {
    renderWithProviders(
      <PasswordConstraints
        password="abcdefgh"
        touched={true}
        hasError={false}
      />,
    );

    const lengthConstraint = screen
      .getByText("8-50 characters")
      .closest("span");
    expect(lengthConstraint).toHaveClass("passed");
  });

  it("marks lowercase constraint as passed when password has lowercase", () => {
    renderWithProviders(
      <PasswordConstraints password="a" touched={true} hasError={false} />,
    );

    const constraint = screen
      .getByText("Lower case letters (a-z)")
      .closest("span");
    expect(constraint).toHaveClass("passed");
  });

  it("marks uppercase constraint as passed when password has uppercase", () => {
    renderWithProviders(
      <PasswordConstraints password="A" touched={true} hasError={false} />,
    );

    const constraint = screen
      .getByText("Upper case letters (A-Z)")
      .closest("span");
    expect(constraint).toHaveClass("passed");
  });

  it("marks numbers constraint as passed when password has a number", () => {
    renderWithProviders(
      <PasswordConstraints password="1" touched={true} hasError={false} />,
    );

    const constraint = screen.getByText("Numbers (0-9)").closest("span");
    expect(constraint).toHaveClass("passed");
  });

  it("marks constraints as failed when hasError and touched", () => {
    renderWithProviders(
      <PasswordConstraints password="" touched={true} hasError={true} />,
    );

    const lengthConstraint = screen
      .getByText("8-50 characters")
      .closest("span");
    expect(lengthConstraint).toHaveClass("failed");
  });

  it("does not mark as failed when not touched", () => {
    renderWithProviders(
      <PasswordConstraints password="" touched={false} hasError={true} />,
    );

    const lengthConstraint = screen
      .getByText("8-50 characters")
      .closest("span");
    expect(lengthConstraint).not.toHaveClass("failed");
  });
});
