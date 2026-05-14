import { renderWithProviders } from "@/tests/render";
import { describe, expect } from "vitest";
import MirrorDetails from "./MirrorDetails";
import { mirrors } from "@/tests/mocks/mirrors";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { expectLoadingState } from "@/tests/helpers";
import { screen } from "@testing-library/react";

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
      screen.getByRole("heading", { name: mirrors[0].displayName }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Source type")).toBeInTheDocument();
    expect(screen.getByText("Source URL")).toBeInTheDocument();
    expect(screen.getByText("Last update")).toBeInTheDocument();
    expect(screen.getAllByText("Packages")).toHaveLength(2);

    expect(
      screen.getByRole("heading", { name: "Contents" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Distribution")).toBeInTheDocument();
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Architectures")).toBeInTheDocument();
    expect(
      screen.getByText("Preserve upstream signing key"),
    ).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
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
      screen.getByRole("heading", { name: "Authentication" }),
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

    const label = screen.getByText("Preserve upstream signing key");
    expect(label).toBeInTheDocument();
    expect(label.closest("div")?.nextSibling?.textContent).toBe("Yes");
  });
});
