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
      `Redact ${scriptWithNoProfiles.title}`,
    );
    expect(screen.getByTestId("label")).toHaveTextContent("Redact");
  });

  it("returns alternative button label when script has profiles", () => {
    renderWithProviders(<DeleteModalConsumer script={scriptWithProfiles} />);

    expect(screen.getByTestId("title")).toHaveTextContent(
      `Redact ${scriptWithProfiles.title}`,
    );
    expect(screen.getByTestId("label")).toHaveTextContent(
      "Redact script and archive profiles",
    );
  });

  it("renders body with irreversible message for script with no profiles", () => {
    renderWithProviders(<DeleteModalConsumer script={scriptWithNoProfiles} />);

    expect(screen.getByTestId("body")).toHaveTextContent(
      /permanently remove its contents from Landscape/i,
    );
    expect(screen.getByTestId("body")).toHaveTextContent(
      /record of the script/i,
    );
    expect(screen.getByTestId("body")).toHaveTextContent(/irreversible/i);
  });

  it("renders body with profile names for script with profiles", () => {
    renderWithProviders(<DeleteModalConsumer script={scriptWithProfiles} />);

    for (const profile of scriptWithProfiles.script_profiles) {
      expect(screen.getByTestId("body")).toHaveTextContent(profile.title);
    }

    expect(screen.getByTestId("body")).toHaveTextContent(
      /Redacting the script will archive its associated profiles, making their names unavailable for reuse\. Neither the script nor its profiles will be able to run again\./i,
    );
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

  it("shows success notification after redaction", async () => {
    renderWithProviders(<DeleteModalConsumer script={scriptWithNoProfiles} />);

    await user.click(screen.getByRole("button", { name: /confirm delete/i }));

    expect(
      await screen.findByText(/script.*redacted successfully/i),
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
