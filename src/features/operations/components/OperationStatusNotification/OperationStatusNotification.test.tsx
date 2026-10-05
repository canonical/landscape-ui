import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import OperationStatusNotification from "./OperationStatusNotification";
import { failedOperation, inProgressOperation } from "@/tests/mocks/operations";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import type { ComponentProps } from "react";
import { resetLroProgress } from "@/tests/server/handlers/operations";

type OperationType = ComponentProps<typeof OperationStatusNotification>["type"];

describe("OperationStatusNotification", () => {
  beforeEach(() => {
    setEndpointStatus("default");
    resetLroProgress();
  });

  it.each<{ type: OperationType; title: RegExp; message: RegExp }>([
    {
      type: "import",
      title: /Package import failed/i,
      message: /Your last package import was not completed successfully/i,
    },
    {
      type: "update",
      title: /Update failed/i,
      message: /Your last mirror update was not completed successfully/i,
    },
    {
      type: "publishing",
      title: /Publishing failed/i,
      message: /Your last publication was not completed successfully/i,
    },
  ])(
    "renders the error notification when $type operation failed",
    ({ type, title, message }) => {
      renderWithProviders(
        <OperationStatusNotification type={type} operation={failedOperation} />,
      );

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(message)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /view logs/i }),
      ).toBeInTheDocument();
    },
  );

  it.each<{ type: OperationType; text: string }>([
    {
      type: "import",
      text: "This local repository is currently importing packages",
    },
    {
      type: "update",
      text: "This mirror is currently being updated",
    },
    {
      type: "publishing",
      text: "This publication is currently being published",
    },
  ])(
    "renders the in progress notification when $type operation is ongoing",
    async ({ type, text }) => {
      renderWithProviders(
        <OperationStatusNotification
          type={type}
          operation={inProgressOperation}
        />,
      );

      expect(screen.getByText(text)).toBeInTheDocument();

      expect(
        await screen.findByRole("button", { name: `Cancel ${type}` }),
      ).toBeInTheDocument();
    },
  );

  it("does not render the cancel button when persistent LROs are disabled", () => {
    setEndpointStatus({ status: "empty", path: "debarchive/features" });

    renderWithProviders(
      <OperationStatusNotification
        type="import"
        operation={inProgressOperation}
      />,
    );

    expect(
      screen.getByText(/currently importing packages/i),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("does not render the notification when there's no operation", () => {
    renderWithProviders(<OperationStatusNotification type={"import"} />);

    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /view logs/i }),
    ).not.toBeInTheDocument();
  });

  it("shows an error notification when canceling the operation fails", async () => {
    setEndpointStatus({ status: "error", path: "operations/cancel" });
    const user = userEvent.setup();

    renderWithProviders(
      <OperationStatusNotification
        type="import"
        operation={inProgressOperation}
      />,
    );

    await user.click(
      await screen.findByRole("button", { name: "Cancel import" }),
    );

    expect(
      screen.getByRole("button", { name: "Canceling..." }),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
