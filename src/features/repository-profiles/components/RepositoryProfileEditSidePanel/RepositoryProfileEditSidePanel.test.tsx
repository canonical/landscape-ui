import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RepositoryProfileEditSidePanel from "./RepositoryProfileEditSidePanel";
import { renderWithProviders } from "@/tests/render";
import { expectLoadingState } from "@/tests/helpers";

describe("RepositoryProfileManageSidePanel", () => {
  it("renders title and form after loading", async () => {
    renderWithProviders(
      <RepositoryProfileEditSidePanel />,
      undefined,
      "?sidePath=edit&profile=repo-profile-1",
    );

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Edit Repository profile 1" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "APT sources" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Pockets" })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Edit repository profile" }),
    ).toBeInTheDocument();
  });
});
