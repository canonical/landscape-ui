import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SecurityProfileDetailsSidePanel from "./SecurityProfileDetailsSidePanel";

describe("SecurityProfileDetailsSidePanel", () => {
  it("should render without data", async () => {
    renderWithProviders(
      <SecurityProfileDetailsSidePanel />,
      undefined,
      "/?securityProfile=7",
    );

    expect((await screen.findAllByText("---"))[0]).toBeInTheDocument();
    expect(screen.getByText("As soon as possible")).toBeInTheDocument();
  });

  it("should render with data", async () => {
    renderWithProviders(
      <SecurityProfileDetailsSidePanel />,
      undefined,
      "/?securityProfile=8",
    );

    expect(
      await screen.findByText(
        "Delayed by 1 hour, randomize delivery over 2 minutes",
      ),
    ).toBeInTheDocument();

    expect(screen.queryByText("As soon as possible")).not.toBeInTheDocument();
  });
});
