import { renderWithProviders } from "@/tests/render";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/ApiError";
import type { EditPackageProfileParams } from "../../hooks";
import { usePackageProfiles } from "../../hooks";
import type { PackageProfile } from "../../types";
import type { Mock } from "vitest";
import PackageProfileEditForm from "./PackageProfileEditForm";
import { getTestErrorParams } from "@/tests/mocks/error";

describe("PackageProfileEditForm", () => {
  vi.mock("../../api");

  const { testError, testErrorMessage } = getTestErrorParams();

  const editPackageProfile = vi.fn(({ title }: { title: string }) => {
    if (title === "error") {
      throw testError;
    }
  });

  beforeEach(() => {
    vi.mocked(usePackageProfiles, { partial: true }).mockReturnValue({
      editPackageProfileQuery: {
        mutateAsync: editPackageProfile,
      } as UseMutationResult<
        AxiosResponse<PackageProfile>,
        AxiosError<ApiError>,
        EditPackageProfileParams
      > & { mutateAsync: Mock },
    });

    renderWithProviders(
      <PackageProfileEditForm profile={packageProfiles[0]} />,
    );
  });

  it("should render all form's fields", async () => {
    expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue(
      packageProfiles[0].title,
    );
    expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue(
      packageProfiles[0].description,
    );
    expect(
      screen.queryByRole("combobox", { name: /access group/i }),
    ).not.toBeInTheDocument();
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
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const submitButton = screen.getByRole("button", { name: /save changes/i });

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    await userEvent.clear(nameInput);
    await userEvent.click(submitButton);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    await userEvent.type(nameInput, packageProfiles[0].title);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it("should edit package profile with the correct values", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(editPackageProfile).toHaveBeenCalledWith({
      all_computers: packageProfiles[0].all_computers,
      description: packageProfiles[0].description,
      tags: packageProfiles[0].tags,
      title: packageProfiles[0].title,
      name: packageProfiles[0].name,
    });
  });

  it("should show error notification if editPackageProfile throws an error", async () => {
    expect(screen.queryByText(testErrorMessage)).not.toBeInTheDocument();

    const nameInput = screen.getByRole("textbox", { name: /name/i });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "error");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(screen.getByText(testErrorMessage)).toBeInTheDocument();
  });
});
