import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import EditLocalRepositorySidePanel from "./EditLocalRepositorySidePanel";
import { screen } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";

describe("EditLocalRepositorySidePanel", () => {
  it("renders header with repository name", async () => {
    renderWithProviders(
      <EditLocalRepositorySidePanel />,
      undefined,
      "?sidePath=edit&name=aaaa-bbbb-cccc",
    );

    expect(await screen.findByText(/edit repo 1/i)).toBeInTheDocument();
  });

  it("renders form with repository data", async () => {
    renderWithProviders(
      <EditLocalRepositorySidePanel />,
      undefined,
      "?sidePath=edit&name=aaaa-bbbb-cccc",
    );

    await expectLoadingState();

    expect(screen.getByLabelText(/name/i)).toHaveValue("repo 1");
  });

  it("renders save changes button", async () => {
    renderWithProviders(
      <EditLocalRepositorySidePanel />,
      undefined,
      "?sidePath=edit&name=aaaa-bbbb-cccc",
    );

    await expectLoadingState();
    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });
});
