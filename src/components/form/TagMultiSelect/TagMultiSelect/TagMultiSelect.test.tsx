import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi } from "vitest";
import TagMultiSelect from "./TagMultiSelect";

describe("TagMultiSelect", () => {
  it("renders with custom label and required state", () => {
    renderWithProviders(
      <TagMultiSelect
        tags={[]}
        onTagsChange={vi.fn()}
        label="Instance tags"
        required
      />,
    );

    expect(screen.getByText("Instance tags")).toHaveClass("is-required");
    expect(screen.getByPlaceholderText("Add tags")).toBeInTheDocument();
  });

  it("adds an existing tag when selecting from the dropdown", async () => {
    const user = userEvent.setup();
    const onTagsChange = vi.fn();

    renderWithProviders(
      <TagMultiSelect tags={["appservers"]} onTagsChange={onTagsChange} />,
    );

    await user.click(screen.getByPlaceholderText("Add tags"));
    await user.click(await screen.findByRole("button", { name: "asd" }));

    expect(onTagsChange).toHaveBeenCalledWith(["appservers", "asd"]);
  });

  it("shows validation error for invalid new tag", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TagMultiSelect tags={[]} onTagsChange={vi.fn()} />);

    const input = screen.getByPlaceholderText("Add tags");
    await user.click(input);
    await user.type(input, "1-invalid{enter}");

    expect(
      screen.getByText("Tag must starts with a letter"),
    ).toBeInTheDocument();
  });

  it("creates a new valid tag on Enter", async () => {
    const user = userEvent.setup();
    const onTagsChange = vi.fn();

    renderWithProviders(
      <TagMultiSelect tags={[]} onTagsChange={onTagsChange} />,
    );

    const input = screen.getByPlaceholderText("Add tags");
    await user.click(input);
    await user.type(input, "new_tag{enter}");

    expect(onTagsChange).toHaveBeenCalledWith(["new_tag"]);
  });
});
