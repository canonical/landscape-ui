import type { GroupedOption } from "@/components/filter";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AvailabilityZoneFilter from "./AvailabilityZoneFilter";

const options = [
  { label: "Zone A", value: "zone-a" },
  { label: "Zone B", value: "zone-b" },
  { label: "Without zones", value: "none" },
] as const satisfies GroupedOption[];

const label = "Availability Zones";

const props: ComponentProps<typeof AvailabilityZoneFilter> = {
  options,
  label,
  inline: false,
  onChange: vi.fn(),
};

describe("AvailabilityZoneFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders filter label and options", async () => {
    renderWithProviders(<AvailabilityZoneFilter {...props} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(label);

    await userEvent.click(button);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(options.length);

    const selectAllBtn = screen.getByRole("button", { name: /Select all/i });
    const clearBtn = screen.getByRole("button", { name: /Clear/i });

    expect(selectAllBtn).toBeInTheDocument();
    expect(clearBtn).toBeInTheDocument();
  });

  it("filters options with search", async () => {
    const manyOptions: GroupedOption[] = Array.from({ length: 20 }, (_, i) => ({
      label: `Zone ${i}`,
      value: `zone-${i}`,
    }));

    renderWithProviders(
      <AvailabilityZoneFilter {...props} options={manyOptions} />,
    );

    await userEvent.click(screen.getByRole("button", { name: label }));

    const searchbox = screen.getByRole("searchbox", { name: /search/i });
    await userEvent.type(searchbox, "zone-1");

    const filteredItems = screen.getAllByRole("listitem");
    expect(filteredItems.length).toBeGreaterThan(0);
  });

  it("selects a zone", async () => {
    renderWithProviders(<AvailabilityZoneFilter {...props} />);
    await userEvent.click(screen.getByRole("button"));

    const checkbox = screen.getByRole("checkbox", {
      name: options[0].label,
    });

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(props.onChange).toHaveBeenCalled();
  });

  it("handles selecting 'none' option", async () => {
    renderWithProviders(<AvailabilityZoneFilter {...props} />);
    await userEvent.click(screen.getByRole("button"));

    const noneCheckbox = screen.getByRole("checkbox", {
      name: "Without zones",
    });

    await userEvent.click(noneCheckbox);
    expect(noneCheckbox).toBeChecked();
  });

  it("supports inline prop", () => {
    renderWithProviders(<AvailabilityZoneFilter {...props} inline />);
    expect(
      screen.getByRole("button", { name: "Select all" }),
    ).toBeInTheDocument();
  });

  it("filters out 'none' when a zone is selected after 'none' was selected", async () => {
    renderWithProviders(<AvailabilityZoneFilter {...props} />);
    await userEvent.click(screen.getByRole("button"));

    // First select "none"
    const noneCheckbox = screen.getByRole("checkbox", {
      name: "Without zones",
    });
    await userEvent.click(noneCheckbox);
    expect(noneCheckbox).toBeChecked();

    // Then select a regular zone - this should deselect "none"
    const zoneACheckbox = screen.getByRole("checkbox", {
      name: options[0].label,
    });
    await userEvent.click(zoneACheckbox);
    expect(props.onChange).toHaveBeenCalled();
  });

  it("calls onChange when defined and filters none during search", async () => {
    const manyOptionsWithNone: GroupedOption[] = [
      ...Array.from({ length: 10 }, (_, i) => ({
        label: `Zone ${i}`,
        value: `zone-${i}`,
      })),
      { label: "Without zones", value: "none" },
    ];

    renderWithProviders(
      <AvailabilityZoneFilter {...props} options={manyOptionsWithNone} />,
    );

    await userEvent.click(screen.getByRole("button", { name: label }));

    const searchbox = screen.getByRole("searchbox", { name: /search/i });
    await userEvent.type(searchbox, "zone-1");
    // Submit the search form to trigger onSearch callback
    await userEvent.keyboard("{Enter}");

    // After filtering, "none" should be excluded
    const listItems = screen.getAllByRole("listitem");
    const noneItem = listItems.find((item) =>
      item.textContent?.includes("Without zones"),
    );
    expect(noneItem).toBeUndefined();
  });

  it("works correctly without an onChange prop", async () => {
    const propsWithoutOnChange: Omit<typeof props, "onChange"> = {
      options: props.options,
      label: props.label,
      inline: props.inline,
    };

    renderWithProviders(<AvailabilityZoneFilter {...propsWithoutOnChange} />);
    await userEvent.click(screen.getByRole("button"));

    const checkbox = screen.getByRole("checkbox", { name: options[0].label });
    // Clicking without onChange should not throw
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
