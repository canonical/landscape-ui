import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WslFilter from "./WslFilter";
import { FILTERS } from "../../constants";

const options = FILTERS.wsl.type === "multi-select" ? FILTERS.wsl.options : [];

const label = "WSL";

const props: ComponentProps<typeof WslFilter> = {
  options,
  label,
  inline: false,
};

describe("WslFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders filter label and options", async () => {
    renderWithProviders(<WslFilter {...props} />);

    const toggle = screen.getByRole("button", { name: label });
    expect(toggle).toBeInTheDocument();

    await userEvent.click(toggle);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(options.length);
  });

  it("selects multiple options", async () => {
    renderWithProviders(<WslFilter {...props} />);
    await userEvent.click(screen.getByRole("button", { name: label }));

    const firstCheckbox = screen.getByRole("checkbox", {
      name: options[0].label,
    });
    const secondCheckbox = screen.getByRole("checkbox", {
      name: options[1].label,
    });

    await userEvent.click(firstCheckbox);
    await userEvent.click(secondCheckbox);

    expect(firstCheckbox).toBeChecked();
    expect(secondCheckbox).toBeChecked();
  });

  it("supports inline prop", () => {
    renderWithProviders(<WslFilter {...props} inline />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(options.length);
  });
});
