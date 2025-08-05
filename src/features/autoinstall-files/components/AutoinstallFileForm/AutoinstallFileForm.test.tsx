import { ADD_AUTOINSTALL_FILE_NOTIFICATION } from "@/pages/dashboard/settings/employees/tabs/autoinstall-files";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe } from "vitest";
import AutoinstallFileForm from "./AutoinstallFileForm";
import { DEFAULT_FILE } from "./constants";

describe("AutoinstallFileForm", () => {
  const createAutoinstallFileProps: ComponentProps<typeof AutoinstallFileForm> =
    {
      buttonText: "Add",
      description: "Add an autoinstall file.",
      initialFile: DEFAULT_FILE,
      notification: ADD_AUTOINSTALL_FILE_NOTIFICATION,
      onSubmit: vi.fn(),
    };

  const editAutoinstallFileProps: ComponentProps<typeof AutoinstallFileForm> = {
    buttonText: "Save changes",
    description: `The duplicated file will be assigned to the same user groups in the identity provider as the original file.`,
    initialFile: {
      contents: "echo 'Hello, world!'",
      filename: "autoinstall.yaml",
      is_default: false,
    },
    notification: ADD_AUTOINSTALL_FILE_NOTIFICATION,
    onSubmit: vi.fn(),
  };

  it("should not render default checkbox when editing", () => {
    renderWithProviders(<AutoinstallFileForm {...editAutoinstallFileProps} />);
    expect(
      screen.queryByRole("checkbox", { name: "Default" }),
    ).not.toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Save changes",
    });

    expect(submitButton).toBeInTheDocument();
  });

  it("should show a disabled button when first creating a form", async () => {
    renderWithProviders(
      <AutoinstallFileForm {...createAutoinstallFileProps} />,
    );

    expect(
      screen.getByRole("checkbox", { name: "Default" }),
    ).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: createAutoinstallFileProps.buttonText,
    });

    expect(submitButton).toBeDisabled();
  });
});
