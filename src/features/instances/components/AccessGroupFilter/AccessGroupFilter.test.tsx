import { describe, it, vi, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccessGroupFilter from "./AccessGroupFilter";
import { accessGroups } from "@/tests/mocks/accessGroup";
import type { SelectOption } from "@/types/SelectOption";
import { renderWithProviders } from "@/tests/render";
import type { ComponentProps } from "react";

const options: SelectOption[] = accessGroups.map((group) => ({
  label: group.title,
  value: group.name,
}));
const label = "Access Groups";

const props: ComponentProps<typeof AccessGroupFilter> = {
  options,
  label,
  inline: false,
};

describe("AccessGroupFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders filter label and options", async () => {
    renderWithProviders(<AccessGroupFilter {...props} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(label);

    await userEvent.click(button);

    expect(screen.getAllByRole("listitem")).toHaveLength(options.length);
    expect(
      screen.getByRole("button", { name: /Select all/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear/i })).toBeInTheDocument();
  });

  it("selects an access group", async () => {
    renderWithProviders(<AccessGroupFilter {...props} />);
    await userEvent.click(screen.getByRole("button"));
    const firstCheckbox = screen.getByRole("checkbox", {
      name: options[0].label,
    });
    await userEvent.click(firstCheckbox);

    expect(firstCheckbox).toBeChecked();
  });

  it("supports inline prop", () => {
    renderWithProviders(<AccessGroupFilter {...props} inline />);
    expect(
      screen.getByRole("button", {
        name: "Select all",
      }),
    ).toBeInTheDocument();
  });
});
