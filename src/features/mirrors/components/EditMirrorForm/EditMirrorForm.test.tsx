import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { expectLoadingState } from "@/tests/helpers";
import { afterEach, assert, expect } from "vitest";
import { EditMirrorForm } from "../..";
import { mirrors } from "@/tests/mocks/mirrors";
import {
  UBUNTU_ARCHIVE_HOST,
  UBUNTU_PRO_HOST,
  UBUNTU_SNAPSHOTS_HOST,
} from "../../constants";
import usePageParams from "@/hooks/usePageParams";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import { API_URL_DEB_ARCHIVE } from "@/constants";
import type { MirrorWritable } from "@canonical/landscape-openapi";
import { setEndpointStatus } from "@/tests/controllers/controller";

const TestComponent = () => {
  const { lastSidePathSegment } = usePageParams();

  if (lastSidePathSegment === "edit") {
    return <EditMirrorForm />;
  }
};

describe("EditMirrorForm", () => {
  const user = userEvent.setup();

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("edits an ubuntu archive mirror", async () => {
    const mirror = mirrors.find(
      ({ mirrorType }) => mirrorType === "UBUNTU_ARCHIVE",
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
        `You have successfully edited ${mirror.displayName}.`,
      ),
    ).toBeInTheDocument();
  });

  it("edits a third party mirror", async () => {
    const mirror = mirrors.find(
      (m) => m.mirrorType === "THIRD_PARTY" && "gpgKey" in m,
    );

    assert(mirror);

    let capturedBody: Partial<MirrorWritable> | undefined;
    server.use(
      http.patch(
        `${API_URL_DEB_ARCHIVE}mirrors/:mirrorId`,
        async ({ request }) => {
          capturedBody = (await request.json()) as Partial<MirrorWritable>;
          return HttpResponse.json({});
        },
      ),
    );

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <TestComponent />
      </Suspense>,
      undefined,
      `?sidePath=edit&name=${encodeURIComponent(mirror.name)}`,
    );

    await expectLoadingState();

    // Mirror has existing GPG key, so checkbox is checked by default - uncheck to show textarea
    await user.click(screen.getByLabelText("Keep current GPG key"));
    await user.clear(screen.getByLabelText("Verification GPG key"));
    await user.type(screen.getByLabelText("Verification GPG key"), "ABCDEF");

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText(
        `You have successfully edited ${mirror.displayName}.`,
      ),
    ).toBeInTheDocument();
    expect(capturedBody).toMatchObject({ gpgKey: { armor: "ABCDEF" } });
  });

  it("preserves existing GPG key when checkbox is checked", async () => {
    const mirror = mirrors.find(
      (m) => m.mirrorType === "THIRD_PARTY" && "gpgKey" in m,
    );

    assert(mirror);

    let capturedBody: Partial<MirrorWritable> | undefined;
    server.use(
      http.patch(
        `${API_URL_DEB_ARCHIVE}mirrors/:mirrorId`,
        async ({ request }) => {
          capturedBody = (await request.json()) as Partial<MirrorWritable>;
          return HttpResponse.json({});
        },
      ),
    );

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

    expect(
      await screen.findByText(
        `You have successfully edited ${mirror.displayName}.`,
      ),
    ).toBeInTheDocument();
    expect(capturedBody).not.toHaveProperty("gpgKey");
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

  it("shows validation error when name is empty", async () => {
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

    await user.clear(screen.getByRole("textbox", { name: /name/i }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("This field is required."),
    ).toBeInTheDocument();
  });

  it("enables filter dependencies when a package filter is provided", async () => {
    const mirror = mirrors.find(
      ({ archiveRoot, preserveSignatures }) =>
        new URL(archiveRoot).host === UBUNTU_ARCHIVE_HOST &&
        !preserveSignatures,
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

    const dependenciesCheckbox = screen.getByLabelText(
      "Include dependencies in filter",
    );
    expect(dependenciesCheckbox).toBeDisabled();

    await user.type(screen.getByLabelText("Filter"), "main");
    expect(dependenciesCheckbox).toBeEnabled();

    await user.click(dependenciesCheckbox);
    expect(dependenciesCheckbox).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText(
        `You have successfully edited ${mirror.displayName}.`,
      ),
    ).toBeInTheDocument();
  });

  it("clears GPG key when checkbox is unchecked and field is empty", async () => {
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

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText(
        `You have successfully edited ${mirror.displayName}.`,
      ),
    ).toBeInTheDocument();
  });

  it("updates download options", async () => {
    const mirror = mirrors.find(
      ({ archiveRoot }) => new URL(archiveRoot).host === UBUNTU_ARCHIVE_HOST,
    );

    assert(mirror);

    let capturedBody: Partial<MirrorWritable> | undefined;
    server.use(
      http.patch(
        `${API_URL_DEB_ARCHIVE}mirrors/:mirrorId`,
        async ({ request }) => {
          capturedBody = (await request.json()) as Partial<MirrorWritable>;
          return HttpResponse.json({});
        },
      ),
    );

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <TestComponent />
      </Suspense>,
      undefined,
      `?sidePath=edit&name=${encodeURIComponent(mirror.name)}`,
    );

    await expectLoadingState();

    await user.click(screen.getByLabelText(/download .udeb packages/i));
    await user.click(screen.getByLabelText("Download sources"));
    await user.click(screen.getByLabelText("Download installer files"));

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText(
        `You have successfully edited ${mirror.displayName}.`,
      ),
    ).toBeInTheDocument();
    expect(capturedBody).toMatchObject({
      downloadUdebs: !mirror.downloadUdebs,
      downloadSources: !mirror.downloadSources,
      downloadInstaller: !mirror.downloadInstaller,
    });
  });
});
