import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FC } from "react";
import { describe, expect, it } from "vitest";
import TableFilterCustom from "./TableFilterCustom";

const testComponentText = "Custom component";

const TestComponent: FC = () => {
  return <>{testComponentText}</>;
};

describe("TableFilterCustom", () => {
  const user = userEvent.setup();

  it("renders inline", () => {
    renderWithProviders(
      <TableFilterCustom
        customComponent={TestComponent}
        label
        type="custom"
        inline
      />,
    );

    expect(screen.getByText(testComponentText)).toBeInTheDocument();
  });

  it("renders a dropdown", async () => {
    const label = "Label";

    renderWithProviders(
      <TableFilterCustom
        customComponent={TestComponent}
        label={label}
        type="custom"
      />,
    );

    await user.click(screen.getByRole("button", { name: label }));
    expect(screen.getByText(testComponentText)).toBeInTheDocument();
  });
});
