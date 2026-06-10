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

    expect(
      await screen.findByText(
        `You have successfully edited ${mirror.displayName}`,
      ),
    ).toBeInTheDocument();
  });

  it("edits a third party mirror", async () => {
    const mirror = mirrors.find(
      (m) =>
        ![UBUNTU_ARCHIVE_HOST, UBUNTU_SNAPSHOTS_HOST, UBUNTU_PRO_HOST].includes(
          new URL(m.archiveRoot).host,
        ) && "gpgKey" in m,
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

    await user.click(screen.getByLabelText("Keep current GPG key"));
    await user.clear(screen.getByLabelText("Verification GPG key"));
    await user.type(screen.getByLabelText("Verification GPG key"), "ABCDEF");

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(mockUpdateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        gpgKey: { armor: "ABCDEF" },
      }),
    );

    expect(
      await screen.findByText(
        `You have successfully edited ${mirror.displayName}`,
      ),
    ).toBeInTheDocument();
  });

  it("preserves existing GPG key when checkbox is checked", async () => {
    const mirror = mirrors.find(
      (m) =>
        ![UBUNTU_ARCHIVE_HOST, UBUNTU_SNAPSHOTS_HOST, UBUNTU_PRO_HOST].includes(
          new URL(m.archiveRoot).host,
        ) && "gpgKey" in m,
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

    expect(screen.getByLabelText("Keep current GPG key")).toBeChecked();
    expect(
      screen.queryByLabelText("Verification GPG key"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(mockUpdateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.not.objectContaining({ gpgKey: expect.anything() }),
    );

    expect(
      await screen.findByText(
        `You have successfully edited ${mirror.displayName}`,
      ),
    ).toBeInTheDocument();
  });

  it("shows preserve signatures as disabled", async () => {
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

    const checkbox = screen.getByLabelText(/Preserve upstream signing key/);
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });

  it("submits without filtering dependencies", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <TestComponent />
      </Suspense>,
      undefined,
      `?sidePath=edit&name=${encodeURIComponent(mirrors[0].name)}`,
    );

    await expectLoadingState();

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(mockUpdateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        filterWithDeps: undefined,
      }),
    );
  });

  it("submits with filtering dependencies", async () => {
    const mirror = mirrors.find(
      ({ preserveSignatures }) => !preserveSignatures,
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

    await user.type(screen.getByRole("textbox", { name: "Filter" }), "abc");
    await user.click(screen.getByLabelText(/Include dependencies in filter/));

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(mockUpdateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        filterWithDeps: true,
      }),
    );
  });
});
