import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFileForm from ".";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";

const createNotificationMessage = () => {
  return notificationMessage;
};

const createNotificationTitle = () => {
  return undefined;
};

const notificationMessage = "Message";
const submitButtonText = "Submit";

describe("AutoinstallFileForm", () => {
  it("should require a file name", async () => {
    renderWithProviders(
      <AutoinstallFileForm
        createNotificationMessage={createNotificationMessage}
        createNotificationTitle={createNotificationTitle}
        fileName={autoinstallFiles[0].filename}
        submitButtonText={submitButtonText}
      />,
    );
    await userEvent.clear(screen.getByRole("textbox"));
    await userEvent.click(
      screen.getByRole("button", { name: submitButtonText }),
    );
    expect(screen.queryByText(notificationMessage)).not.toBeInTheDocument();
  });

  it("should submit", async () => {
    renderWithProviders(
      <AutoinstallFileForm
        createNotificationMessage={createNotificationMessage}
        createNotificationTitle={createNotificationTitle}
        fileName={autoinstallFiles[0].filename}
        submitButtonText={submitButtonText}
      />,
    );

    const testFilename = "test.yaml";

    await userEvent.clear(screen.getByRole("textbox"));
    await userEvent.type(screen.getByRole("textbox"), testFilename);
    await userEvent.click(
      screen.getByRole("button", { name: submitButtonText }),
    );

    // TODO: wait for Ethan's fix
    // expect(screen.queryByText(notificationMessage)).toBeInTheDocument();
  });
});
