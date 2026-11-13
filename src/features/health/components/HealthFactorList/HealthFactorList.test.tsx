import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { HealthFactor } from "../../types";
import HealthFactorList from "./HealthFactorList";

const factor = (overrides: Partial<HealthFactor>): HealthFactor =>
  ({
    rule_id: 1,
    rule_key: "reboot_required",
    description: "Reboot required",
    points: 20,
    ...overrides,
  }) as HealthFactor;

describe("HealthFactorList", () => {
  it("lists each factor with the points it costs", () => {
    render(
      <HealthFactorList
        factors={[
          factor({ rule_id: 1, description: "Critical USN", points: 100 }),
          factor({ rule_id: 2 }),
        ]}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Critical USN")).toBeInTheDocument();
    expect(screen.getByText("Sets score to 0")).toBeInTheDocument();
    expect(screen.getByText("Reboot required")).toBeInTheDocument();
    expect(screen.getByText("−20")).toBeInTheDocument();
  });

  it("says so when nothing lowers the score", () => {
    render(<HealthFactorList factors={[]} />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(
      screen.getByText("Nothing is lowering this instance's score right now."),
    ).toBeInTheDocument();
  });
});
