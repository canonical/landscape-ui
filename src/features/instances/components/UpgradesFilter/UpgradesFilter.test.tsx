import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UpgradesFilter from "./UpgradesFilter";

const securityOption = {
  label: "Security upgrades available",
  value: "security-upgrades",
};
const regularOption = {
  label: "Regular upgrades available",
  value: "package-upgrades",
};
const upToDateOption = { label: "Up to date", value: "up-to-date" };
const options = [securityOption, regularOption, upToDateOption];

const label = "Upgrades";

const props: ComponentProps<typeof UpgradesFilter> = {
  options,
  label,
  inline: false,
  onChange: vi.fn(),
};

describe("UpgradesFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the filter label and options", async () => {
    renderWithProviders(<UpgradesFilter {...props} />);

    const toggle = screen.getByRole("button", { name: label });
    expect(toggle).toBeInTheDocument();

    await userEvent.click(toggle);

    expect(screen.getAllByRole("listitem")).toHaveLength(options.length);
  });

  it("selects multiple upgrade filters", async () => {
    renderWithProviders(<UpgradesFilter {...props} />);
    await userEvent.click(screen.getByRole("button", { name: label }));

    const security = screen.getByRole("checkbox", {
      name: securityOption.label,
    });
    const regular = screen.getByRole("checkbox", { name: regularOption.label });

    await userEvent.click(security);
    await userEvent.click(regular);

    expect(security).toBeChecked();
    expect(regular).toBeChecked();
    expect(props.onChange).toHaveBeenCalledTimes(2);
  });

  it("supports the inline prop", () => {
    renderWithProviders(<UpgradesFilter {...props} inline />);

    expect(screen.getAllByRole("listitem")).toHaveLength(options.length);
  });
});
