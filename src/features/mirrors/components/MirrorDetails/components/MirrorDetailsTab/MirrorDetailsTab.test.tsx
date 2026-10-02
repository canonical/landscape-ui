import { renderWithProviders } from "@/tests/render";
import { assert, beforeEach, describe, expect, it } from "vitest";
import MirrorDetailsTab from "./MirrorDetailsTab";
import { mirrors } from "@/tests/mocks/mirrors";
import { expectLoadingState } from "@/tests/helpers";
import { screen, waitFor } from "@testing-library/react";
import type { Mirror } from "@canonical/landscape-openapi";
import { API_URL_DEB_ARCHIVE } from "@/constants";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import { setEndpointStatus } from "@/tests/controllers/controller";

const typedMirrors = mirrors as Mirror[];

describe("MirrorDetails", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders the mirror display name once loaded", async () => {
    renderWithProviders(<MirrorDetailsTab mirror={mirrors[0]} />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Source type")).toBeInTheDocument();
    expect(screen.getByText("Source URL")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Last update")).toBeInTheDocument();
    expect(screen.getByText("Packages")).toBeInTheDocument();
    expect(
      screen.getByText("Preserve upstream signing key"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Contents" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Distribution")).toBeInTheDocument();
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Architectures")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
    expect(
      screen.queryByText("Include dependencies in filter"),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Download .udeb/i)).toBeInTheDocument();
    expect(screen.getByText("Download sources")).toBeInTheDocument();
    expect(screen.getByText(/Download installer files/i)).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Authentication" }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Used in" }),
    ).toBeInTheDocument();
  });

  it("renders without operation", async () => {
    const mirrorNoLro = typedMirrors.find(
      ({ lastOperation }) => !lastOperation,
    );
    assert(mirrorNoLro, "Missing mock mirror without lastOperation");

    renderWithProviders(<MirrorDetailsTab mirror={mirrorNoLro} />);

    await expectLoadingState();

    expect(await screen.findByText("Not yet updated")).toBeInTheDocument();
  });

  it("renders GPG key fingerprint", async () => {
    const mirrorWithGpgKey = typedMirrors.find(
      ({ gpgKey }) => !!gpgKey?.fingerprint,
    );
    assert(mirrorWithGpgKey, "Missing mock mirror with GPG key");
    const fingerprint = mirrorWithGpgKey.gpgKey?.fingerprint;
    assert(fingerprint, "Missing fingerprint in selected GPG key mirror");

    renderWithProviders(<MirrorDetailsTab mirror={mirrorWithGpgKey} />);

    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: "Authentication" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Verification GPG Key")).toBeInTheDocument();
    expect(screen.getByText(fingerprint)).toBeInTheDocument();
  });

  it("displays preserve signatures status", async () => {
    const mirrorWithPreserveSignatures = typedMirrors.find(
      ({ preserveSignatures }) => preserveSignatures,
    );

    assert(mirrorWithPreserveSignatures);

    renderWithProviders(
      <MirrorDetailsTab mirror={mirrorWithPreserveSignatures} />,
    );

    await expectLoadingState();

    const label = await screen.findByText("Preserve upstream signing key");
    expect(label).toBeInTheDocument();
    expect(label.closest("div")?.nextSibling?.textContent).toBe("Yes");
    expect(
      screen.getByText(/Signature-preserving mirrors/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/they sync during publication/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Close notification" }),
    ).not.toBeInTheDocument();
  });

  it("shows include dependencies in filter field only if mirror has filter", async () => {
    const mirrorWithFilter = typedMirrors.find(({ filter }) => filter);
    assert(mirrorWithFilter, "Test data should include a mirror with a filter");

    const { container } = renderWithProviders(
      <MirrorDetailsTab mirror={mirrorWithFilter} />,
    );

    await expectLoadingState();

    await waitFor(() => {
      expect(container).toHaveInfoItem("Include dependencies in filter", "Yes");
    });
  });

  it("shows authentication for legacy mirrors that have a GPG key but no mirrorType", async () => {
    const mirrorWithGpgKey = typedMirrors.find(
      ({ gpgKey }) => !!gpgKey?.fingerprint,
    );
    assert(mirrorWithGpgKey, "Missing mock mirror with GPG key");
    const fingerprint = mirrorWithGpgKey.gpgKey?.fingerprint;
    assert(fingerprint, "Missing fingerprint in selected GPG key mirror");

    const legacyMirror = { ...mirrorWithGpgKey, mirrorType: undefined };

    server.use(
      http.get(`${API_URL_DEB_ARCHIVE}mirrors/:mirrorId`, () =>
        HttpResponse.json(legacyMirror),
      ),
    );

    renderWithProviders(<MirrorDetailsTab mirror={legacyMirror} />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Authentication" }),
    ).toBeInTheDocument();
    expect(screen.getByText(fingerprint)).toBeInTheDocument();
  });

  it("renders mirror details for a mirror with preserve signatures disabled", async () => {
    const mirrorWithoutPreserveSignatures = typedMirrors.find(
      ({ preserveSignatures }) => !preserveSignatures,
    );

    assert(mirrorWithoutPreserveSignatures);

    renderWithProviders(
      <MirrorDetailsTab mirror={mirrorWithoutPreserveSignatures} />,
    );

    await expectLoadingState();

    const label = screen.getByText("Preserve upstream signing key");
    expect(label).toBeInTheDocument();
    expect(label.closest("div")?.nextSibling?.textContent).toBe("No");
    expect(
      screen.queryByText(/Signature-preserving mirrors/i),
    ).not.toBeInTheDocument();
  });
});
