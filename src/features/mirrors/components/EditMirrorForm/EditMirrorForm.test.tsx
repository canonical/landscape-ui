import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { expectLoadingState } from "@/tests/helpers";
import { beforeEach, expect, vi } from "vitest";
import { EditMirrorForm } from "../..";
import { mirrors } from "@/tests/mocks/mirrors";
import {
  UBUNTU_ARCHIVE_HOST,
  UBUNTU_PRO_HOST,
  UBUNTU_SNAPSHOTS_HOST,
} from "../../constants";
import usePageParams from "@/hooks/usePageParams";

const TestComponent = () => {
  const { lastSidePathSegment } = usePageParams();

  if (lastSidePathSegment === "edit") {
    return <EditMirrorForm />;
  }
};

const mockUpdateMirror = vi.fn();

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");

  return {
    ...actual,
    useUpdateMirror: () => ({
      mutateAsync: mockUpdateMirror,
    }),
  };
});

describe("EditMirrorForm", () => {
  const user = userEvent.setup();

  beforeEach(async () => {
    mockUpdateMirror.mockReset();
  });

  it("edits an ubuntu archive mirror", async () => {
    const mirror = mirrors.find(
      ({ archiveRoot }) => new URL(archiveRoot).host === UBUNTU_ARCHIVE_HOST,
    );

    assert(mirror);

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <TestComponent />
      </Suspense>,
      undefined,
      `?sidePath=edit&name=${encodeURIComponent(mirror.name)}`,
    );

    await expectLoadingState();
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(mockUpdateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({}),
    );
  });

  it("edits a third party mirror", async () => {
    const mirror = mirrors.find(
      ({ archiveRoot }) =>
        ![UBUNTU_ARCHIVE_HOST, UBUNTU_SNAPSHOTS_HOST, UBUNTU_PRO_HOST].includes(
          new URL(archiveRoot).host,
        ),
    );

    assert(mirror);

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <TestComponent />
      </Suspense>,
      undefined,
      `?sidePath=edit&name=${encodeURIComponent(mirror.name)}`,
    );

    await expectLoadingState();

    const params = {
      gpgKey: { armor: "ABCDEF" },
    };

    await user.type(
      screen.getByLabelText("Verification GPG key"),
      params.gpgKey.armor,
    );

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(mockUpdateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining(params),
    );
  });

  it("toggles preserve signatures", async () => {
    const mirror = mirrors.find(({ preserveSignatures }) => preserveSignatures);

    assert(mirror);

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <TestComponent />
      </Suspense>,
      undefined,
      `?sidePath=edit&name=${encodeURIComponent(mirror.name)}`,
    );

    await expectLoadingState();

    const checkbox = screen.getByLabelText("Preserve signatures");
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(mockUpdateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        preserveSignatures: false,
      }),
    );
  });
});
