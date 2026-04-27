import { renderWithProviders } from "@/tests/render";
import AddMirrorForm from "./AddMirrorForm";
import userEvent from "@testing-library/user-event";
import { fireEvent, screen } from "@testing-library/react";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { expectLoadingState } from "@/tests/helpers";
import { beforeEach, expect, vi } from "vitest";
import { UBUNTU_SNAPSHOTS_HOST } from "../../constants";
import type { CreateMirrorData } from "@canonical/landscape-openapi";

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

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <AddMirrorForm />
      </Suspense>,
    );

    await expectLoadingState();
    await user.type(screen.getByLabelText("Name"), "Name");
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
