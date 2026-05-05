import { setEndpointStatus } from "@/tests/controllers/controller";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useArchiveScriptModal } from "../useArchiveScriptModal";

const [, scriptWithProfiles, scriptWithNoProfiles] = scripts;

const ArchiveModalConsumer = ({
  script,
  afterSuccess,
}: {
  readonly script: (typeof scripts)[number] | null;
  readonly afterSuccess?: () => void;
}) => {
  const modal = useArchiveScriptModal({
    script,
    afterSuccess: afterSuccess ?? (() => undefined),
  });

  return (
    <div>
      <span data-testid="title">{modal.archiveModalTitle}</span>
      <span data-testid="label">{modal.archiveModalButtonLabel}</span>
      <span data-testid="pending">
        {modal.isArchivingScript ? "pending" : "idle"}
      </span>
      <button onClick={modal.onConfirmArchive}>Confirm Archive</button>
      <div data-testid="body">{modal.archiveModalBody}</div>
    </div>
  );
};

describe("useArchiveScriptModal", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("returns empty values when script is null", () => {
    renderWithProviders(<ArchiveModalConsumer script={null} />);

    expect(screen.getByTestId("title")).toHaveTextContent("");
    expect(screen.getByTestId("label")).toHaveTextContent("");
    expect(screen.getByTestId("pending")).toHaveTextContent("idle");
  });

  it("returns correct title and label when script has no profiles", () => {
    renderWithProviders(<ArchiveModalConsumer script={scriptWithNoProfiles} />);

    expect(screen.getByTestId("title")).toHaveTextContent(
      `Archive ${scriptWithNoProfiles.title}`,
    );
    expect(screen.getByTestId("label")).toHaveTextContent("Archive");
  });

  it("returns correct title and label when script has profiles", () => {
    renderWithProviders(<ArchiveModalConsumer script={scriptWithProfiles} />);

    expect(screen.getByTestId("title")).toHaveTextContent(
      `Archive ${scriptWithProfiles.title}`,
    );
    expect(screen.getByTestId("label")).toHaveTextContent(
      "Archive both script and profiles",
    );
  });

  it("renders body with irreversible message for script with no profiles", () => {
    renderWithProviders(<ArchiveModalConsumer script={scriptWithNoProfiles} />);

    expect(screen.getByTestId("body")).toHaveTextContent(/irreversible/i);
  });

  it("renders body with profile names for script with profiles", () => {
    renderWithProviders(<ArchiveModalConsumer script={scriptWithProfiles} />);

    for (const profile of scriptWithProfiles.script_profiles) {
      expect(screen.getByTestId("body")).toHaveTextContent(profile.title);
    }
  });

  it("calls afterSuccess when onConfirmArchive completes", async () => {
    const afterSuccess = vi.fn();

    renderWithProviders(
      <ArchiveModalConsumer
        script={scriptWithNoProfiles}
        afterSuccess={afterSuccess}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm archive/i }));

    expect(afterSuccess).toHaveBeenCalled();
  });

  it("shows success notification after archive", async () => {
    renderWithProviders(<ArchiveModalConsumer script={scriptWithNoProfiles} />);

    await user.click(screen.getByRole("button", { name: /confirm archive/i }));

    expect(
      await screen.findByText(/script archived successfully/i),
    ).toBeInTheDocument();
  });

  it("invokes onConfirmArchive no-op when script is null", async () => {
    renderWithProviders(<ArchiveModalConsumer script={null} />);

    await user.click(screen.getByRole("button", { name: /confirm archive/i }));

    expect(screen.getByTestId("pending")).toHaveTextContent("idle");
  });

  it("handles archive API error gracefully", async () => {
    setEndpointStatus({ status: "error", path: "archive" });
    const afterSuccess = vi.fn();

    renderWithProviders(
      <ArchiveModalConsumer
        script={scriptWithNoProfiles}
        afterSuccess={afterSuccess}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm archive/i }));

    expect(afterSuccess).toHaveBeenCalled();
  });
});
