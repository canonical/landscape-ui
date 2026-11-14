import { activityTypes } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import ActivityTypeFilter from "./ActivityTypeFilter";

const options = activityTypes.map((type) => ({
  label: type,
  value: type,
}));

const props: ComponentProps<typeof ActivityTypeFilter> = {
  options,
  label: "Type",
  type: "",
  onItemSelect: vi.fn(),
};

describe("ActivityTypeFilter", () => {
  const user = userEvent.setup();

  it("renders filter label and options", async () => {
    renderWithProviders(<ActivityTypeFilter {...props} />);

    const toggle = screen.getByRole("button", { name: "Type" });
    expect(toggle).toBeInTheDocument();

    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: activityTypes[0] }),
    ).toBeInTheDocument();
  });

  it("notifies the caller when a type is selected", async () => {
    const onItemSelect = vi.fn();
    renderWithProviders(
      <ActivityTypeFilter {...props} onItemSelect={onItemSelect} />,
    );
    await user.click(screen.getByRole("button", { name: "Type" }));
    await user.click(screen.getByRole("button", { name: activityTypes[0] }));
    expect(onItemSelect).toHaveBeenCalledWith(activityTypes[0]);
    expect(onItemSelect).toHaveBeenCalledOnce();
  });

  it("handles case-insensitive search", async () => {
    renderWithProviders(<ActivityTypeFilter {...props} />);
    await user.click(screen.getByRole("button", { name: "Type" }));

    const searchbox = screen.getByRole("searchbox");
    await user.type(searchbox, activityTypes[2].toLowerCase());
    await user.type(searchbox, "{enter}");

    const filteredItems = screen.getAllByRole("listitem");
    expect(filteredItems).toHaveLength(1);

    expect(
      screen.getByRole("button", { name: activityTypes[2] }),
    ).toBeInTheDocument();
  });
});
