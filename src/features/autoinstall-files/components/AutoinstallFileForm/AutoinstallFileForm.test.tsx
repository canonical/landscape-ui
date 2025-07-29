import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe } from "vitest";
import AutoinstallFileForm from "./AutoinstallFileForm";
import { ADD_AUTOINSTALL_FILE_NOTIFICATION } from "@/pages/dashboard/settings/employees/tabs/autoinstall-files";

describe("AutoinstallFileForm", () => {
  const props: ComponentProps<typeof AutoinstallFileForm> = {
    buttonText: "Add",
    description: "Add an autoinstall file.",
    initialFile: {
      contents: "echo 'Hello, world!'",
      filename: "autoinstall.yaml",
      is_default: false,
    },
    notification: ADD_AUTOINSTALL_FILE_NOTIFICATION,
    onSubmit: vi.fn(),
  };

  it("should submit", async () => {
    renderWithProviders(<AutoinstallFileForm {...props} />);

    await userEvent.click(
      screen.getByRole("button", { name: props.buttonText }),
    );

    expect(
      screen.getByText(
        `The autoinstall file ${props.initialFile?.filename} ${props.notification.message}`,
      ),
    ).toBeInTheDocument();

    expect(props.onSubmit).toHaveBeenLastCalledWith({
      contents: props.initialFile?.contents,
      filename: props.initialFile?.filename,
      is_default: props.initialFile?.is_default,
    });
  });

  it("should handle errors", async () => {
    const message = "An error occurred.";

    const badQuery = async (): Promise<void> => {
      throw new Error(message, { cause: "test" });
    };

    renderWithProviders(<AutoinstallFileForm {...props} onSubmit={badQuery} />);

    await userEvent.click(
      screen.getByRole("button", { name: props.buttonText }),
    );

    expect(screen.queryByText(message)).toBeInTheDocument();
  });
});
