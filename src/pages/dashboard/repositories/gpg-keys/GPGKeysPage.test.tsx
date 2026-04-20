import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { PATHS, ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import GPGKeysPage from "./GPGKeysPage";
import { GPG_KEYS_DOCS_URL } from "./constants";

describe("GPGKeysPage", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders gpg keys list", async () => {
    renderWithProviders(<GPGKeysPage />);

    expect(
      screen.getByRole("heading", { name: "GPG keys" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("sign-key")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Import GPG key" }),
    ).toBeInTheDocument();
  });

  it("shows empty state when no gpg keys are returned", async () => {
    setEndpointStatus({ status: "empty", path: "gpgKey" });

    renderWithProviders(
      <GPGKeysPage />,
      undefined,
      ROUTES.repositories.gpgKeys(),
      `/${PATHS.repositories.root}/${PATHS.repositories.gpgKeys}`,
    );

    expect(await screen.findByText("No GPG keys found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "How to manage GPG keys in Landscape",
      }),
    ).toHaveAttribute("href", GPG_KEYS_DOCS_URL);
  });

  it("opens import gpg key side panel from page action", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <GPGKeysPage />,
      undefined,
      ROUTES.repositories.gpgKeys(),
      `/${PATHS.repositories.root}/${PATHS.repositories.gpgKeys}`,
    );

    await user.click(screen.getByRole("button", { name: "Import GPG key" }));

    expect(
      await screen.findByRole("heading", { name: "Import GPG key" }),
    ).toBeInTheDocument();
  });
});
