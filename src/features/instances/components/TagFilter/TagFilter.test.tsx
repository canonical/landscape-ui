import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TagFilter from "./TagFilter";
import { tags } from "@/tests/mocks/tag";

const options = tags.map((tag) => ({
  label: tag,
  value: tag,
}));

const label = "Tags";

const props: ComponentProps<typeof TagFilter> = {
  options,
  label,
  inline: false,
};

describe("TagFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders filter label and options", async () => {
    renderWithProviders(<TagFilter {...props} />);

    const toggle = screen.getByRole("button", { name: label });
    expect(toggle).toBeInTheDocument();

    await userEvent.click(toggle);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(options.length);
  });

  it("filters options via search", async () => {
    renderWithProviders(<TagFilter {...props} />);
    await userEvent.click(screen.getByRole("button", { name: label }));

    const searchbox = screen.getByRole("searchbox");
    await userEvent.type(searchbox, options[1].label);
    await userEvent.keyboard("{enter}");

    const filteredItems = screen.getAllByRole("listitem");
    expect(filteredItems).toHaveLength(1);

    expect(
      screen.getByRole("checkbox", { name: options[1].label }),
    ).toBeInTheDocument();
  });

  it("selects multiple tags", async () => {
    renderWithProviders(<TagFilter {...props} />);
    await userEvent.click(screen.getByRole("button", { name: label }));

    const tag1 = screen.getByRole("checkbox", { name: options[0].label });
    const tag2 = screen.getByRole("checkbox", { name: options[1].label });

    await userEvent.click(tag1);
    await userEvent.click(tag2);

    expect(tag1).toBeChecked();
    expect(tag2).toBeChecked();
  });

  it("supports inline prop", () => {
    renderWithProviders(<TagFilter {...props} inline />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(options.length);
  });
});
