import { renderWithProviders } from "@/tests/render";
import { describe, expect } from "vitest";
import MirrorDetails from "./MirrorDetails";
import { mirrors } from "@/tests/mocks/mirrors";
import { Suspense } from "react";
import userEvent from "@testing-library/user-event";
import LoadingState from "@/components/layout/LoadingState";
import { expectLoadingState } from "@/tests/helpers";
import { screen, waitFor, within } from "@testing-library/react";
import type { Mirror } from "@canonical/landscape-openapi";

const mirrorWithFilter = (mirrors as Mirror[]).find((mirror) => mirror.filter);
assert(mirrorWithFilter, "Test data should include a mirror with a filter");

describe("MirrorDetails", () => {
  it("renders", async () => {
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
    expect(screen.queryByText("Include dependencies in filter")).not.toBeInTheDocument();
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
    const { container } = renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrorWithFilter.name}`,
    );

    await expectLoadingState();

    await waitFor(() =>
      expect(container).toHaveInfoItem("Include dependencies in filter", "Yes")
    );
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

    const packagesTab = within(screen.getByRole("navigation")).getByText("Packages");
    await user.click(packagesTab);

    expect(
      screen.queryByRole("heading", { name: "Details" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Package name/i }),
    ).toBeInTheDocument();
  });
});
