import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfileAssociationInfo from "./ProfileAssociationInfo";

describe("ProfileAssociationInfo", () => {
  it("renders a message with association to all computers", () => {
    renderWithProviders(
      <ProfileAssociationInfo profile={{ all_computers: true, tags: [] }} />,
    );

    expect(
      screen.getByText("This profile has been associated with all instances."),
    ).toBeInTheDocument();
  });

  it("renders a body with tags", () => {
    renderWithProviders(
      <ProfileAssociationInfo profile={{ tags: [undefined] }}>
        Body
      </ProfileAssociationInfo>,
    );

    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("renders an empty message", () => {
    renderWithProviders(<ProfileAssociationInfo profile={{ tags: [] }} />);

    expect(
      screen.getByText(
        "This profile has not yet been associated with any instances.",
      ),
    ).toBeInTheDocument();
  });
});
