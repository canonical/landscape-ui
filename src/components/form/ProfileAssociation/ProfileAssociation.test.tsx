import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfileAssociation from "./ProfileAssociation";

describe("ProfileAssociation", () => {
  it("renders a message with association to all computers", () => {
    renderWithProviders(
      <ProfileAssociation profile={{ all_computers: true, tags: [] }} />,
    );

    expect(
      screen.getByText("This profile has been associated with all instances."),
    ).toBeInTheDocument();
  });

  it("renders a body with tags", () => {
    renderWithProviders(
      <ProfileAssociation profile={{ tags: [undefined] }}>
        Body
      </ProfileAssociation>,
    );

    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("renders an empty message", () => {
    renderWithProviders(<ProfileAssociation profile={{ tags: [] }} />);

    expect(
      screen.getByText(
        "This profile has not yet been associated with any instances.",
      ),
    ).toBeInTheDocument();
  });
});
