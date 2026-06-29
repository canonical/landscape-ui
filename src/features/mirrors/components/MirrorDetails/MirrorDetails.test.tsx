import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { assert, describe, expect, it } from "vitest";
import MirrorDetails from "./MirrorDetails";
import { mirrors } from "@/tests/mocks/mirrors";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { expectLoadingState } from "@/tests/helpers";
import { API_URL_DEB_ARCHIVE } from "@/constants";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";

describe("MirrorDetails", () => {
  it("renders the mirror display name once loaded", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    expect(
      await screen.findByRole("heading", { name: mirrors[0].displayName }),
    ).toBeInTheDocument();
  });

  it("renders GPG key fingerprint", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrors[2].name}`,
    );

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Authentication" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Verification GPG Key")).toBeInTheDocument();
    expect(
      screen.getByText(mirrors[2].gpgKey?.fingerprint),
    ).toBeInTheDocument();
  });

  it("shows authentication for legacy mirrors that have a GPG key but no mirrorType", async () => {
    const legacyMirror = { ...mirrors[2], mirrorType: undefined };

    server.use(
      http.get(`${API_URL_DEB_ARCHIVE}mirrors/:mirrorId`, () =>
        HttpResponse.json(legacyMirror),
      ),
    );

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrors[2].name}`,
    );

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Authentication" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mirrors[2].gpgKey?.fingerprint),
    ).toBeInTheDocument();
  });

  it("displays preserve signatures status", async () => {
    const mirrorWithPreserveSignatures = mirrors.find(
      ({ preserveSignatures }) => preserveSignatures,
    );

    assert(mirrorWithPreserveSignatures);

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrorWithPreserveSignatures.name}`,
    );

    await expectLoadingState();

    const label = screen.getByText("Preserve upstream signing key");
    expect(label).toBeInTheDocument();
    expect(label.closest("div")?.nextSibling?.textContent).toBe("Yes");
  });

  it("renders mirror details for a mirror with preserve signatures disabled", async () => {
    const mirrorWithoutPreserveSignatures = mirrors.find(
      ({ preserveSignatures }) => !preserveSignatures,
    );

    assert(mirrorWithoutPreserveSignatures);

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrorWithoutPreserveSignatures.name}`,
    );

    await expectLoadingState();

    const label = screen.getByText("Preserve upstream signing key");
    expect(label).toBeInTheDocument();
    expect(label.closest("div")?.nextSibling?.textContent).toBe("No");
  });
});
