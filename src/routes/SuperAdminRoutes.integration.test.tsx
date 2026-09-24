import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { FC } from "react";
import { Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { API_URL } from "@/constants";
import { ROUTES } from "@/libs/routes";
import UserInfo from "@/templates/dashboard/UserInfo";
import { authResponse } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { SuperAdminRoutes } from "./SuperAdminRoutes";

// A stand-in for the normal layout: the sidebar footer with the Super admin
// entry, plus the current path so redirects and Back can be asserted.
const NormalView: FC = () => {
  const { pathname } = useLocation();

  return (
    <>
      <p>Normal view at {pathname}</p>
      <UserInfo />
    </>
  );
};

const serveMe = (globalRoles: string[]) => {
  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json({ ...authResponse, global_roles: globalRoles }),
    ),
  );
};

const renderAt = (path: string) =>
  renderWithProviders(
    <Routes>
      {SuperAdminRoutes}
      <Route path="*" element={<NormalView />} />
    </Routes>,
    undefined,
    path,
  );

const findSuperAdminNav = async () =>
  screen.findByRole("navigation", { name: "Super admin" });

describe("super admin routes (integration)", () => {
  beforeEach(() => {
    serveMe(["SupportProvider"]);
  });

  it("renders /super-admin in its own layout for Canonical staff", async () => {
    renderAt(ROUTES.superAdmin.root());

    expect(await findSuperAdminNav()).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Accounts" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Normal view at/)).not.toBeInTheDocument();
  });

  it("serves the account detail page", async () => {
    renderAt(ROUTES.superAdmin.account("acme"));

    expect(
      await screen.findByRole("heading", { name: "acme" }),
    ).toBeInTheDocument();
  });

  it("serves the people page", async () => {
    renderAt(ROUTES.superAdmin.people());

    expect(
      await screen.findByRole("heading", { name: "People" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "People" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("redirects everyone else to / on direct navigation", async () => {
    serveMe([]);

    renderAt(ROUTES.superAdmin.root());

    expect(await screen.findByText("Normal view at /")).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Super admin" }),
    ).not.toBeInTheDocument();
  });

  it("shows the Super admin entry in the normal view only when the gating holds", async () => {
    renderAt(ROUTES.overview.root());

    expect(
      await screen.findByRole("link", { name: "Super admin" }),
    ).toBeInTheDocument();
  });

  it("hides the Super admin entry from everyone else", async () => {
    serveMe([]);

    renderAt(ROUTES.overview.root());

    expect(await screen.findByText(/Normal view at/)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /sign out/i })).toBeVisible();
    });
    expect(
      screen.queryByRole("link", { name: "Super admin" }),
    ).not.toBeInTheDocument();
  });

  it("returns to the normal-view route the mode was entered from", async () => {
    renderAt(ROUTES.overview.root());

    await userEvent.click(
      await screen.findByRole("link", { name: "Super admin" }),
    );
    expect(await findSuperAdminNav()).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("link", { name: "Back to normal view" }),
    );

    expect(
      await screen.findByText("Normal view at /overview"),
    ).toBeInTheDocument();
  });

  it("returns to / after a direct visit", async () => {
    renderAt(ROUTES.superAdmin.root());

    await findSuperAdminNav();
    await userEvent.click(
      screen.getByRole("link", { name: "Back to normal view" }),
    );

    expect(await screen.findByText("Normal view at /")).toBeInTheDocument();
  });
});
