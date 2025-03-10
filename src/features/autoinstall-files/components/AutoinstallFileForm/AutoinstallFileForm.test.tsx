import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe } from "vitest";
import AutoinstallFileForm from "./AutoinstallFileForm";

describe("AutoinstallFileForm", () => {
  const props: ComponentProps<typeof AutoinstallFileForm> = {
    buttonText: "Add",
    description: "Add an autoinstall file.",
    initialFile: {
      contents: "echo 'Hello, world!'",
      filename: "autoinstall.yaml",
    },
    notification: { message: "has been added.", title: "You have added" },
    onSubmit: vi.fn(),
  };

  it("should require a file name", async () => {
    renderWithProviders(
      <AutoinstallFileForm {...props} initialFile={undefined} />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: props.buttonText }),
    );

    expect(
      screen.queryByText(` ${props.notification.message}`),
    ).not.toBeInTheDocument();

    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("should submit", async () => {
    renderWithProviders(<AutoinstallFileForm {...props} />);

    await userEvent.click(
      screen.getByRole("button", { name: props.buttonText }),
    );

    expect(
      screen.queryByText(
        `${props.initialFile?.filename} ${props.notification.message}`,
      ),
    ).toBeInTheDocument();

    expect(props.onSubmit).toHaveBeenLastCalledWith({
      contents: props.initialFile?.contents,
      filename: props.initialFile?.filename,
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
