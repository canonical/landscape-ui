import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ViewRemovalProfileDetailsBlock from "./ViewRemovalProfileDetailsBlock";
import { profiles } from "@/tests/mocks/profiles";

const [profile] = profiles;

describe("ViewRemovalProfileDetailsBlock", () => {
  it("renders formatted removal timeframe", () => {
    render(
      <ViewRemovalProfileDetailsBlock
        profile={{
          ...profile,
          days_without_exchange: 14,
          cascade_to_children: false,
          computers: { num_associated_computers: 7 },
        }}
      />,
    );

    expect(screen.getByText("Removal Timeframe")).toBeInTheDocument();
    expect(screen.getByText("14 days")).toBeInTheDocument();
  });
});
