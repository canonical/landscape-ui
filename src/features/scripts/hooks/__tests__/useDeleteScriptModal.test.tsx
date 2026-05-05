import { setEndpointStatus } from "@/tests/controllers/controller";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteScriptModal } from "../useDeleteScriptModal";

const [, scriptWithProfiles, scriptWithNoProfiles] = scripts;

const DeleteModalConsumer = ({
  script,
  afterSuccess,
}: {
  readonly script: (typeof scripts)[number] | null;
  readonly afterSuccess?: () => void;
}) => {
  const modal = useDeleteScriptModal({
    script,
    afterSuccess: afterSuccess ?? (() => undefined),
  });

  return (
    <div>
      <span data-testid="title">{modal.deleteModalTitle}</span>
      <span data-testid="label">{modal.deleteModalButtonLabel}</span>
      <span data-testid="pending">
        {modal.isRemoving ? "removing" : "idle"}
      </span>
      <button onClick={modal.onConfirmDelete}>Confirm Delete</button>
      <div data-testid="body">{modal.deleteModalBody}</div>
    </div>
  );
};

describe("useDeleteScriptModal", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("returns empty values when script is null", () => {
    renderWithProviders(<DeleteModalConsumer script={null} />);

    expect(screen.getByTestId("title")).toHaveTextContent("");
    expect(screen.getByTestId("label")).toHaveTextContent("");
    expect(screen.getByTestId("pending")).toHaveTextContent("idle");
  });

  it("returns correct title and label when script has no profiles", () => {
    renderWithProviders(<DeleteModalConsumer script={scriptWithNoProfiles} />);

    expect(screen.getByTestId("title")).toHaveTextContent(
      `Delete ${scriptWithNoProfiles.title}`,
    );
    expect(screen.getByTestId("label")).toHaveTextContent("Delete");
  });

  it("returns alternative button label when script has profiles", () => {
    renderWithProviders(<DeleteModalConsumer script={scriptWithProfiles} />);

    expect(screen.getByTestId("title")).toHaveTextContent(
      `Delete ${scriptWithProfiles.title}`,
    );
    expect(screen.getByTestId("label")).toHaveTextContent(
      "Delete both script and profiles",
    );
  });

  it("renders body with irreversible message for script with no profiles", () => {
    renderWithProviders(<DeleteModalConsumer script={scriptWithNoProfiles} />);

    expect(screen.getByTestId("body")).toHaveTextContent(/irreversible/i);
  });

  it("renders body with profile names for script with profiles", () => {
    renderWithProviders(<DeleteModalConsumer script={scriptWithProfiles} />);

    for (const profile of scriptWithProfiles.script_profiles) {
      expect(screen.getByTestId("body")).toHaveTextContent(profile.title);
    }
  });

  it("calls afterSuccess when onConfirmDelete completes", async () => {
    const afterSuccess = vi.fn();

    renderWithProviders(
      <DeleteModalConsumer
        script={scriptWithNoProfiles}
        afterSuccess={afterSuccess}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm delete/i }));

    expect(afterSuccess).toHaveBeenCalled();
  });

  it("shows success notification after delete", async () => {
    renderWithProviders(<DeleteModalConsumer script={scriptWithNoProfiles} />);

    await user.click(screen.getByRole("button", { name: /confirm delete/i }));

    expect(
      await screen.findByText(/script removed successfully/i),
    ).toBeInTheDocument();
  });

  it("invokes onConfirmDelete no-op when script is null", async () => {
    renderWithProviders(<DeleteModalConsumer script={null} />);

    await user.click(screen.getByRole("button", { name: /confirm delete/i }));

    expect(screen.getByTestId("pending")).toHaveTextContent("idle");
  });

  it("handles delete API error gracefully", async () => {
    setEndpointStatus({ status: "error", path: "redact" });
    const afterSuccess = vi.fn();

    renderWithProviders(
      <DeleteModalConsumer
        script={scriptWithNoProfiles}
        afterSuccess={afterSuccess}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm delete/i }));

    expect(afterSuccess).toHaveBeenCalled();
  });
});
