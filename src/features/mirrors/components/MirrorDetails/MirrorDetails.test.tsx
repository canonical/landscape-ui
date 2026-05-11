import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MirrorDetails from "./MirrorDetails";
import { mirrors } from "@/tests/mocks/mirrors";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { expectLoadingState } from "@/tests/helpers";

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

    const label = screen.getByText("Preserve signatures");
    expect(label).toBeInTheDocument();
    expect(label.closest("div")?.nextSibling?.textContent).toBe("Yes");
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

    const label = screen.getByText("Preserve signatures");
    expect(label).toBeInTheDocument();
    expect(label.closest("div")?.nextSibling?.textContent).toBe("Yes");
  });
});
