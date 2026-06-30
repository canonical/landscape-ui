import { renderWithProviders } from "@/tests/render";
import { assert, describe, expect, it } from "vitest";
import MirrorDetails from "./MirrorDetails";
import { mirrors } from "@/tests/mocks/mirrors";
import { Suspense } from "react";
import userEvent from "@testing-library/user-event";
import LoadingState from "@/components/layout/LoadingState";
import { expectLoadingState } from "@/tests/helpers";
import { screen, waitFor, within } from "@testing-library/react";
import type { Mirror } from "@canonical/landscape-openapi";
import { API_URL_DEB_ARCHIVE } from "@/constants";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";

const typedMirrors = mirrors as Mirror[];

describe("MirrorDetails", () => {
  it("renders the mirror display name once loaded", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: mirrors[0].displayName }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Source type")).toBeInTheDocument();
    expect(screen.getByText("Source URL")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Last update")).toBeInTheDocument();
    expect(screen.getAllByText("Packages")).toHaveLength(2);
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

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrorNoLro.name}`,
    );

    await expectLoadingState();

    expect(await screen.findByText("Not yet updated")).toBeInTheDocument();
  });

  it("renders failed update notification", async () => {
    const failedMirror = typedMirrors.find(({ lastOperation }) =>
      lastOperation?.includes("ffff-llll-dddd"),
    );
    assert(failedMirror, "Missing mock mirror with a failed operation");

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${failedMirror.name}`,
    );

    expect(
      await screen.findByRole("heading", { name: "Update failed" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your last mirror update was not completed successfully.",
      ),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: "View logs" })).toHaveLength(
      2,
    );
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
      await screen.findByRole("heading", { name: "Authentication" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Verification GPG Key")).toBeInTheDocument();
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

    const label = await screen.findByText("Preserve upstream signing key");
    expect(label).toBeInTheDocument();
    expect(label.closest("div")?.nextSibling?.textContent).toBe("Yes");
  });

  it("shows include dependencies in filter field only if mirror has filter", async () => {
    const mirrorWithFilter = typedMirrors.find(({ filter }) => filter);
    assert(mirrorWithFilter, "Test data should include a mirror with a filter");

    const { container } = renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrorWithFilter.name}`,
    );

    await expectLoadingState();

    await waitFor(() => {
      expect(container).toHaveInfoItem("Include dependencies in filter", "Yes");
    });
  });

  it("renders packages tab when clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    await expectLoadingState();

    await screen.findByRole("heading", { name: mirrors[0].displayName });

    const packagesTab = within(screen.getByRole("navigation")).getByText(
      "Packages",
    );
    await user.click(packagesTab);

    expect(
      screen.queryByRole("heading", { name: "Details" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Package name/i }),
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
