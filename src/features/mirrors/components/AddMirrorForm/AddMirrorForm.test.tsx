import { renderWithProviders } from "@/tests/render";
import AddMirrorForm from "./AddMirrorForm";
import userEvent from "@testing-library/user-event";
import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UBUNTU_ARCHIVE_HOST, UBUNTU_SNAPSHOTS_HOST } from "../../constants";
import type { CreateMirrorData } from "@canonical/landscape-openapi";

const PULLING_NOTE = /pulling and parsing repository data/i;

const mockCreateMirror = vi.fn();

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");

  return {
    ...actual,
    useCreateMirror: () => ({
      mutateAsync: mockCreateMirror,
    }),
  };
});

describe("AddMirrorForm", () => {
  const user = userEvent.setup();

  beforeEach(async () => {
    mockCreateMirror.mockClear();

    renderWithProviders(<AddMirrorForm />);

    // The form renders immediately; wait for the "pulling…" note in the
    // Mirror contents block to disappear so the data-dependent dropdowns are
    // populated before the test interacts with them.
    await waitForElementToBeRemoved(() => screen.queryByText(PULLING_NOTE), {
      timeout: 2000,
    });
    await user.type(screen.getByLabelText("Name"), "Name");
  });

  it("submits an ubuntu archive mirror with the default https URL", async () => {
    // Default sourceType is "Ubuntu archive"; the Source URL field is
    // editable and prefilled with the canonical archive URL over HTTPS.
    expect(screen.getByLabelText("Source URL")).toHaveValue(
      `https://${UBUNTU_ARCHIVE_HOST}/ubuntu/`,
    );

    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        archiveRoot: `https://${UBUNTU_ARCHIVE_HOST}/ubuntu/`,
      }),
    );
  });

  it("submits an ubuntu archive mirror pointed at a custom CDN", async () => {
    const cdnUrl = "https://eu.archive.ubuntu.com/ubuntu/";

    const sourceUrlField = screen.getByLabelText("Source URL");
    await user.clear(sourceUrlField);
    await user.type(sourceUrlField, cdnUrl);

    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        archiveRoot: cdnUrl,
      }),
    );
  });

  it("rejects an http source URL with an HTTPS validation error", async () => {
    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Third party",
    );

    const sourceUrlField = screen.getByLabelText("Source URL");
    await user.type(sourceUrlField, "http://insecure.example.com/");
    // validateOnBlur is true on the form; tab out to trigger validation.
    await user.tab();

    expect(
      await screen.findByText(/source url must use https/i),
    ).toBeInTheDocument();
  });

  it("submits an ubuntu snapshot mirror", async () => {
    const date = "2026-04-15";

    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Ubuntu snapshots",
    );

    fireEvent.change(screen.getByLabelText("Snapshot date"), {
      target: { value: date },
    });

    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        archiveRoot: `https://${UBUNTU_SNAPSHOTS_HOST}/ubuntu/${date}`,
      }),
    );
  });

  it("submits an ubuntu pro mirror", async () => {
    const token = "ABCDEFG";

    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Ubuntu Pro",
    );

    await user.type(screen.getByLabelText("Token"), token);
    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({}),
    );
  });

  it("submits a mirror with preserve signatures enabled", async () => {
    await user.click(screen.getByLabelText("Preserve signatures"));
    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        preserveSignatures: true,
      }),
    );
  });

  it("submits a third-party mirror", async () => {
    const params = {
      archiveRoot: "https://archive.ubuntu.com/",
      distribution: "focal",
      components: ["main", "universe"],
      architectures: ["amd64", "arm64"],
      gpgKey: { armor: "ABCDEFG" },
    } satisfies Partial<CreateMirrorData["body"]>;

    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Third party",
    );

    await user.type(screen.getByLabelText("Source URL"), params.archiveRoot);

    await user.type(screen.getByLabelText("Distribution"), params.distribution);
    await user.type(
      screen.getByLabelText("Components"),
      params.components.join(", "),
    );
    await user.type(
      screen.getByLabelText("Architectures"),
      params.architectures.join(", "),
    );
    await user.type(
      screen.getByLabelText("Verification GPG key"),
      params.gpgKey.armor,
    );
    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining(params),
    );
  });
});

describe("AddMirrorForm loading state", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockCreateMirror.mockClear();
  });

  it("renders the form immediately with a muted 'pulling' note while archive info is fetched", async () => {
    renderWithProviders(<AddMirrorForm />);

    // The note appears straight away under the "Mirror contents" heading.
    expect(screen.getByText(PULLING_NOTE)).toBeInTheDocument();

    // The note disappears once the queries resolve.
    await waitForElementToBeRemoved(() => screen.queryByText(PULLING_NOTE), {
      timeout: 2000,
    });
    expect(screen.queryByText(PULLING_NOTE)).not.toBeInTheDocument();
  });

  it("lets users fill the Name field while archive info is still loading and preserves the value after hydration", async () => {
    renderWithProviders(<AddMirrorForm />);

    // Sanity: still loading.
    expect(screen.getByText(PULLING_NOTE)).toBeInTheDocument();

    // Name and Source type are interactable while loading.
    const nameField = screen.getByLabelText("Name");
    expect(nameField).toBeEnabled();
    expect(screen.getByLabelText("Source type")).toBeEnabled();

    await user.type(nameField, "early-mirror");
    expect(nameField).toHaveValue("early-mirror");
    // The user's typed Name survives hydration.
    expect(screen.getByLabelText("Name")).toHaveValue("early-mirror");
  });

  it("disables the Distribution dropdown while archive info is loading and re-enables it once data arrives", async () => {
    renderWithProviders(<AddMirrorForm />);

    // While loading, the Distribution select is rendered but disabled.
    const distributionField = screen.getByLabelText("Distribution");
    expect(distributionField).toBeDisabled();

    await waitForElementToBeRemoved(() => screen.queryByText(PULLING_NOTE), {
      timeout: 2000,
    });

    // After hydration, the Distribution dropdown is interactive again.
    await waitFor(() => {
      expect(screen.getByLabelText("Distribution")).not.toBeDisabled();
    });
  });

  it("hides the 'pulling' note when the user picks the third-party source type during loading", async () => {
    renderWithProviders(<AddMirrorForm />);
    expect(screen.getByText(PULLING_NOTE)).toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Third party",
    );

    // Third-party doesn't depend on the archive/ESM info, so the loading
    // affordance shouldn't appear under the Mirror contents heading.
    expect(screen.queryByText(PULLING_NOTE)).not.toBeInTheDocument();
  });
});
