import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import type { ComponentProps } from "react";
import { getAccessGroupOptions, getSortedOptions } from "../helpers";
import type { AccessGroupOption } from "../types";
import AccessGroupBlock from "./AccessGroupBlock";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const accessGroupOptions: AccessGroupOption[] = getSortedOptions(
  getAccessGroupOptions(accessGroups),
);

const onAccessGroupChange = vi.fn();

const props: ComponentProps<typeof AccessGroupBlock> = {
  accessGroupOptions,
  accessGroups: [],
  onAccessGroupChange,
};

describe("AccessGroupBlock", () => {
  const user = userEvent.setup();

  it("renders correctly", () => {
    renderWithProviders(<AccessGroupBlock {...props} />);

    expect(screen.getByText(/access groups/i)).toBeInTheDocument();
  });

  it("correctly handles indeterminate state when a checkbox has children checked", async () => {
    renderWithProviders(<AccessGroupBlock {...props} />);

    const [childCheckboxValue] = accessGroupOptions[0].children;

    const childCheckboxLabel = accessGroups.find(
      (group) => group.name === childCheckboxValue,
    )?.title;

    assert(childCheckboxLabel);

    const childCheckbox = screen.getByLabelText(childCheckboxLabel);
    await user.click(childCheckbox);

    expect(onAccessGroupChange).toHaveBeenCalledWith(
      expect.arrayContaining([childCheckboxValue]),
    );
  });

  it("selects children when selecting the parent", async () => {
    renderWithProviders(<AccessGroupBlock {...props} />);

    const parentCheckbox = screen.getByLabelText(accessGroupOptions[0].label);
    await user.click(parentCheckbox);

    expect(onAccessGroupChange).toHaveBeenCalledWith(
      expect.arrayContaining(accessGroupOptions[0].children),
    );
  });

  it("styles the checkbox labels in a hierarchy", () => {
    renderWithProviders(<AccessGroupBlock {...props} />);

    const [parentGroup] = accessGroupOptions;

    const parentCheckboxInput = screen.getByRole("checkbox", {
      name: parentGroup.label,
    });
    const parentCheckboxLabelElement = parentCheckboxInput.closest("label");
    expect(parentCheckboxLabelElement).toHaveClass(/depth-0/i);

    const groupMap = new Map(
      accessGroupOptions.map((group) => [group.value, group]),
    );

    for (const childValue of parentGroup.children) {
      const childGroup = groupMap.get(childValue);

      assert(childGroup, `Child group with value "${childValue}" not found.`);

      const childCheckboxInput = screen.getByRole("checkbox", {
        name: childGroup.label,
      });
      const childCheckboxLabelElement = childCheckboxInput.closest("label");

      expect(childCheckboxLabelElement).toHaveClass(
        new RegExp(`depth-${childGroup.depth}`),
      );
    }
  });
});
