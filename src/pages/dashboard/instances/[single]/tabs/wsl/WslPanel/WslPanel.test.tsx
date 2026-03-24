import { screen } from "@testing-library/react";
import { describe, expect, it, assert } from "vitest";
import { windowsInstance } from "@/tests/mocks/instance";
import { instanceChildren } from "@/tests/mocks/wsl";
import { renderWithProviders } from "@/tests/render";
import WslPanel from "./WslPanel";
import { expectLoadingState } from "@/tests/helpers";

describe("WslPanel", () => {
  it("shows loading state initially", async () => {
    renderWithProviders(<WslPanel instance={windowsInstance} />);

    await expectLoadingState();
  });

  it("shows WSL instances list after loading", async () => {
    const [firstChild] = instanceChildren;
    assert(firstChild);

    renderWithProviders(<WslPanel instance={windowsInstance} />);

    expect(await screen.findByText(firstChild.name)).toBeInTheDocument();
  });
});
