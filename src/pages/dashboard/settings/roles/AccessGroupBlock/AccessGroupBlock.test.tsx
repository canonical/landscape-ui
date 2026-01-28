import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import type { ComponentProps } from "react";
import { getAccessGroupOptions, getSortedOptions } from "../helpers";
import type { AccessGroupOption } from "../types";
import AccessGroupBlock from "./AccessGroupBlock";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { INDENTATION } from "./constants";

const accessGroupOptions: AccessGroupOption[] = getSortedOptions(
  getAccessGroupOptions(accessGroups),
);

const onAccessGroupChange = vi.fn();

const props: ComponentProps<typeof AccessGroupBlock> = {
  accessGroupOptions,
  accessGroups: [],
  onAccessGroupChange,
};

const [selectedAccessGroup] = accessGroupOptions;

assert(selectedAccessGroup);

describe("AccessGroupBlock", () => {
  const user = userEvent.setup();

  it("renders correctly", () => {
    renderWithProviders(<AccessGroupBlock {...props} />);

    expect(screen.getByText(/access groups/i)).toBeInTheDocument();
  });

  it("correctly handles indeterminate state when a checkbox has children checked", async () => {
    renderWithProviders(<AccessGroupBlock {...props} />);

    const [childCheckboxValue] = selectedAccessGroup.children;

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

    const parentCheckbox = screen.getByLabelText(selectedAccessGroup.label);
    await user.click(parentCheckbox);

    expect(onAccessGroupChange).toHaveBeenCalledWith(
      expect.arrayContaining(selectedAccessGroup.children),
    );
  });

  it("styles the checkbox labels in a hierarchy", () => {
    renderWithProviders(<AccessGroupBlock {...props} />);

    const parentCheckboxInput = screen.getByRole("checkbox", {
      name: selectedAccessGroup.label,
    });

    const parentCheckboxContainer = parentCheckboxInput.closest("div");
    expect(parentCheckboxContainer).toHaveStyle({
      marginLeft: `${INDENTATION * selectedAccessGroup.depth}rem`,
    });

    const groupMap = new Map(
      accessGroupOptions.map((group) => [group.value, group]),
    );

    for (const childValue of selectedAccessGroup.children) {
      const childGroup = groupMap.get(childValue);

      assert(childGroup, `Child group with value "${childValue}" not found.`);

      const childCheckboxInput = screen.getByRole("checkbox", {
        name: childGroup.label,
      });
      const childCheckboxContainer = childCheckboxInput.closest("div");

      expect(childCheckboxContainer).toHaveStyle({
        marginLeft: `${INDENTATION * childGroup.depth}rem`,
      });
    }
  });
});
