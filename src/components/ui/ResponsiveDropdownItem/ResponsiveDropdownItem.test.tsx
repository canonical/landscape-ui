import { PageParamFilter } from "@/components/filter";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ResponsiveDropdownItem from "./ResponsiveDropdownItem";

describe("ResponsiveDropdownItem", () => {
  const user = userEvent.setup();

  it("renders an element", async () => {
    renderWithProviders(
      <ResponsiveDropdownItem
        el={
          <PageParamFilter
            pageParamKey="status"
            label="Status"
            options={[{ label: "Option 1", value: "option-1" }]}
          />
        }
      />,
    );

    await user.click(screen.getByRole("button", { name: "Status" }));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });
});
