import { expectLoadingState } from "@/tests/helpers";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PackageProfileEditSidePanel from "./PackageProfileEditSidePanel";

describe("PackageProfileEditSidePanel", () => {
  beforeEach(async () => {
    renderWithProviders(
      <PackageProfileEditSidePanel />,
      undefined,
      `/?profile=${packageProfiles[0].name}`,
    );

    await expectLoadingState();
  });

  it("should render all form's fields", async () => {
    expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue(
      packageProfiles[0].title,
    );
    expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue(
      packageProfiles[0].description,
    );
    expect(screen.getByLabelText(/access group/i)).toBeDisabled();
    expect(screen.getByText("Association")).toBeInTheDocument();

    if (packageProfiles[0].all_computers) {
      expect(
        screen.getByRole("checkbox", { name: /all instances/i }),
      ).toBeChecked();
    } else {
      expect(
        screen.getByRole("checkbox", { name: /all instances/i }),
      ).not.toBeChecked();
    }

    expect(screen.getByRole("combobox", { name: /tags/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("should show error message if trying to submit an empty required field", async () => {
    const errorMessage = "This field is required";
    const nameInput = screen.getByRole("textbox", { name: /title/i });
    const submitButton = screen.getByRole("button", { name: /save changes/i });

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    await userEvent.clear(nameInput);
    await userEvent.click(submitButton);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    await userEvent.type(nameInput, packageProfiles[0].title);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it("should show error notification if editPackageProfile throws an error", async () => {
    expect(screen.queryByText("Network Error")).not.toBeInTheDocument();

    const nameInput = screen.getByRole("textbox", { name: /title/i });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "error");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(screen.getByText("Network Error")).toBeInTheDocument();
  });
});
