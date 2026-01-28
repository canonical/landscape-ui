import { renderWithProviders } from "@/tests/render";
import PermissionBlock from "./PermissionBlock";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { getPermissionOptions } from "../helpers";
import { permissions } from "@/tests/mocks/roles";
import userEvent from "@testing-library/user-event";
import { isOptionDisabled } from "./helpers";

const permissionOptions = getPermissionOptions(permissions);
const onPermissionChange = vi.fn();
const props: ComponentProps<typeof PermissionBlock> = {
  title: "Global permissions",
  description: "Manage user permissions",
  onPermissionChange,
  options: permissionOptions.filter(({ global }) => !global),
  permissions: [],
};

describe("PermissionBlock", () => {
  const user = userEvent.setup();

  it("renders PermissionBlock", () => {
    renderWithProviders(<PermissionBlock {...props} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /property/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /view/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /manage/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(props.description)).toBeInTheDocument();
    expect(screen.getByText(props.title)).toBeInTheDocument();
  });

  it("calls onPermissionChange when a permission is toggled", async () => {
    renderWithProviders(<PermissionBlock {...props} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(props.options.length * 2);

    const availableCheckbox = checkboxes.find(
      (checkbox) => !checkbox.hasAttribute("disabled"),
    );

    assert(availableCheckbox);

    await user.click(availableCheckbox);
    expect(onPermissionChange).toHaveBeenCalled();
  });

  it("renders disabled checkboxes", () => {
    renderWithProviders(<PermissionBlock {...props} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(props.options.length * 2);

    const disabledCheckboxes = checkboxes.filter((checkbox) =>
      checkbox.hasAttribute("disabled"),
    );

    const actualDisabledCheckboxes = props.options.filter((option) =>
      isOptionDisabled({ option, permissions: props.permissions }),
    );

    expect(disabledCheckboxes).toHaveLength(actualDisabledCheckboxes.length);
  });
});
