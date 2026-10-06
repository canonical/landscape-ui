import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import RestartImportModal from "./RestartImportModal";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

const [, repository] = repositories;
const props = {
  close: vi.fn(),
  isOpen: true,
  repository: repository,
};

describe("RestartImportModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setEndpointStatus("default");
  });

  it("does not render when closed", () => {
    renderWithProviders(<RestartImportModal {...props} isOpen={false} />);

    expect(
      screen.queryByRole("heading", {
        name: `${repository.displayName} is already importing packages`,
      }),
    ).not.toBeInTheDocument();
  });

  it("renders modal with title, warning text and buttons", () => {
    renderWithProviders(<RestartImportModal {...props} />);

    expect(
      screen.getByRole("heading", {
        name: `${repository.displayName} is already importing packages`,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /before starting a new package import, you must cancel the current one/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Cancel import and continue" }),
    ).toBeInTheDocument();
  });

  it("closes the modal when clicking the cancel button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RestartImportModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(props.close).toHaveBeenCalled();
  });

  it("cancels the ongoing import and closes the modal", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <RestartImportModal {...props} />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: "Cancel import and continue" }),
    );

    const location = getLocationDisplay();
    await waitFor(() => {
      expect(location).toHaveTextContent("sidePath=import-packages");
    });
    expect(location).toHaveTextContent(`name=${repository.localId}`);

    expect(props.close).toHaveBeenCalled();
  });

  it("shows an error and keeps the modal open when canceling the import fails", async () => {
    setEndpointStatus({ status: "error", path: "operations/cancel" });
    const close = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <RestartImportModal {...props} close={close} />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: "Cancel import and continue" }),
    );

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();

    expect(close).not.toHaveBeenCalled();
    expect(getLocationDisplay()).not.toHaveTextContent(
      "sidePath=import-packages",
    );
  });
});
