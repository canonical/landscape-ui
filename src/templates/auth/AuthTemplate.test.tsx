import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AuthTemplate from "./AuthTemplate";

describe("AuthTemplate", () => {
  it("renders the title as the page heading alongside its children", () => {
    render(
      <AuthTemplate title="Sign in">
        <button type="button">Continue</button>
      </AuthTemplate>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Sign in" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeInTheDocument();
  });

  it("links the logo back to the application root", () => {
    const { container } = render(
      <AuthTemplate title="Sign in">
        <span>Content</span>
      </AuthTemplate>,
    );

    expect(container.querySelector("a[href='/'] img")).toBeInTheDocument();
  });
});
