import type { ComponentProps } from "react";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectAllButton from "./SelectAllButton";

const count = 20;
const itemName = {
  plural: "packages",
  singular: "package",
};
const onClick = vi.fn();
const totalCount = 100;

const props: ComponentProps<typeof SelectAllButton> = {
  count,
  itemName,
  onClick,
  totalCount,
};

describe("SelectAllButton", () => {
  it("should render correctly", async () => {
    render(<SelectAllButton {...props} />);

    expect(
      screen.getByText(`Selected ${count} ${itemName.plural} currently.`),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByText(`Select all ${totalCount} ${itemName.plural}.`),
    );

    expect(onClick).toHaveBeenCalled();
  });
});
