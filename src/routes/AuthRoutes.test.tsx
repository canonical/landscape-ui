import {
  Children,
  Suspense,
  isValidElement,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";
import { Outlet, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthContext, type AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { HOMEPAGE_PATH } from "@/constants";
import { GuestGuard } from "@/components/guards/GuestGuard";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { FeatureGuard } from "@/components/guards/FeatureGuard";
import { PATHS } from "@/libs/routes";
import { AuthRoutes } from "./AuthRoutes";
import { invitationState } from "@/tests/server/handlers/invitations";
import { redirectToExternalUrl } from "@/features/auth";

vi.mock("@/features/auth", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  redirectToExternalUrl: vi.fn(),
}));

vi.mock("@/context/sidePanel", () => ({
  default: ({ children }: { readonly children: ReactNode }) => children,
}));

interface RouteLikeProps {
  children?: ReactNode;
  element?: ReactElement;
  path?: string;
}

const isRouteElement = (
  value: unknown,
): value is ReactElement<RouteLikeProps> =>
  isValidElement<RouteLikeProps>(value);

const getRouteChildren = (element: ReactElement<RouteLikeProps>) => {
  return Children.toArray(element.props.children).filter(isRouteElement);
};

const getGuestRoutes = () => {
  const guardedRoute = getRouteChildren(AuthRoutes).find(
    (route) => !route.props.path,
  );
  assert(guardedRoute);
  return guardedRoute;
};

describe("AuthRoutes", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });
  it("wraps auth routes with guest guard and outlet", () => {
    const wrapper = getGuestRoutes().props.element;
    assert(wrapper);
    const guardWrapper = wrapper as ReactElement<{ children: ReactElement }>;
    expect(guardWrapper.type).toBe(GuestGuard);

    const wrappedChild = guardWrapper.props.children;
    expect(wrappedChild.type).toBe(Outlet);
  });

  it("defines expected auth paths", () => {
    const childRoutes = [
      ...getRouteChildren(AuthRoutes),
      ...getRouteChildren(getGuestRoutes()),
    ];
    const paths = childRoutes.map((route) => route.props.path);

    expect(paths).toContain(PATHS.auth.login);
    expect(paths).toContain(PATHS.auth.invitation);
    expect(paths).toContain(PATHS.auth.createAccount);
    expect(paths).toContain(PATHS.auth.noAccess);
    expect(paths).toContain(PATHS.auth.handleOidc);
    expect(paths).toContain(PATHS.auth.handleUbuntuOne);
    expect(paths).toContain(PATHS.auth.attach);
    expect(paths).toContain(PATHS.auth.supportLogin);
  });

  it("uses feature guard for attach and support login routes", () => {
    const childRoutes = getRouteChildren(getGuestRoutes());

    const attachRoute = childRoutes.find(
      (route) => route.props.path === PATHS.auth.attach,
    );
    const supportLoginRoute = childRoutes.find(
      (route) => route.props.path === PATHS.auth.supportLogin,
    );

    assert(attachRoute?.props.element);
    assert(supportLoginRoute?.props.element);

    expect(attachRoute.props.element.type).toBe(FeatureGuard);
    expect(supportLoginRoute.props.element.type).toBe(FeatureGuard);
  });

  it("keeps invitations outside the guest guard", () => {
    expect(
      getRouteChildren(AuthRoutes).some(
        (route) => route.props.path === PATHS.auth.invitation,
      ),
    ).toBe(true);
    expect(
      getRouteChildren(getGuestRoutes()).some(
        (route) => route.props.path === PATHS.auth.invitation,
      ),
    ).toBe(false);
  });
});

describe("invitation routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setEndpointStatus("default");
    invitationState.accepted = false;
  });

  const renderInvitation = (
    authorized = true,
    hasAccounts = true,
    routePath = "/accept-invitation/1",
  ) => {
    const authState: AuthContextProps = {
      authorized,
      hasAccounts,
      authLoading: false,
      isSuperAdmin: false,
      canManageAccounts: false,
      user: authorized ? authUser : null,
      setUser: vi.fn(),
      logout: vi.fn(),
      safeRedirect: vi.fn(),
      redirectToExternalUrl: vi.fn(),
      isFeatureEnabled: () => false,
    };
    const AuthOverride = ({ children }: { readonly children: ReactNode }) => {
      const { safeRedirect } = useContext(AuthContext);
      return (
        <AuthContext.Provider value={{ ...authState, safeRedirect }}>
          {children}
        </AuthContext.Provider>
      );
    };
    return renderWithProviders(
      <AuthOverride>
        <Suspense fallback={<div>Loading route</div>}>
          <Routes>
            {AuthRoutes}
            <Route
              path={HOMEPAGE_PATH}
              element={<div>Organization dashboard</div>}
            />
            <Route
              path="/invitation-destination"
              element={<div>Invitation destination</div>}
            />
          </Routes>
        </Suspense>
      </AuthOverride>,
      {},
      routePath,
    );
  };

  it("allows a signed-out invitee to register or sign in", async () => {
    renderInvitation(false, false);
    expect(
      await screen.findByRole("button", {
        name: "Already have an account? Sign in here",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Organization dashboard"),
    ).not.toBeInTheDocument();
  });

  it.each([false, true])(
    "allows a signed-in invitee to accept or reject (existing accounts: %s)",
    async (hasAccounts) => {
      renderInvitation(true, hasAccounts);
      expect(
        await screen.findByRole("button", { name: "Accept" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Reject" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Organization dashboard"),
      ).not.toBeInTheDocument();
    },
  );

  it("navigates to the dashboard after successful acceptance", async () => {
    renderInvitation();
    await userEvent.click(
      await screen.findByRole("button", { name: "Accept" }),
    );
    expect(
      await screen.findByText("Organization dashboard"),
    ).toBeInTheDocument();
  });

  it("honors an internal redirect target after acceptance", async () => {
    renderInvitation(
      true,
      true,
      "/accept-invitation/1?redirect-to=%2Finvitation-destination",
    );
    await userEvent.click(
      await screen.findByRole("button", { name: "Accept" }),
    );

    expect(
      await screen.findByText("Invitation destination"),
    ).toBeInTheDocument();
    expect(redirectToExternalUrl).not.toHaveBeenCalled();
  });

  it("honors the external flag for a safe redirect target after acceptance", async () => {
    renderInvitation(
      true,
      true,
      "/accept-invitation/1?redirect-to=%2Finvitation-destination&external",
    );
    await userEvent.click(
      await screen.findByRole("button", { name: "Accept" }),
    );

    await screen.findByText("Redirecting...");
    expect(redirectToExternalUrl).toHaveBeenCalledWith(
      new URL("/invitation-destination", window.location.origin).toString(),
      { replace: true },
    );
  });

  it("falls back to the homepage for an unsafe redirect target", async () => {
    renderInvitation(
      true,
      true,
      "/accept-invitation/1?redirect-to=https%3A%2F%2Fexample.com%2Fother&external",
    );
    await userEvent.click(
      await screen.findByRole("button", { name: "Accept" }),
    );

    expect(
      await screen.findByText("Organization dashboard"),
    ).toBeInTheDocument();
    expect(redirectToExternalUrl).not.toHaveBeenCalled();
  });

  it("navigates to the dashboard after registering through an invitation", async () => {
    renderInvitation(false, false);
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("Full name"), "Invited User");
    await user.type(
      screen.getByLabelText("Email address"),
      "invited@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "Password1234");
    await user.click(screen.getByRole("button", { name: "Create user" }));
    expect(
      await screen.findByText("Organization dashboard"),
    ).toBeInTheDocument();
  });

  it("loads the registered user before entering the guarded homepage", async () => {
    renderWithProviders(
      <Suspense fallback={<div>Loading route</div>}>
        <Routes>
          {AuthRoutes}
          <Route
            path={HOMEPAGE_PATH}
            element={<AuthGuard>Organization dashboard</AuthGuard>}
          />
        </Routes>
      </Suspense>,
      {},
      "/accept-invitation/1",
    );

    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("Full name"), "Invited User");
    await user.type(
      screen.getByLabelText("Email address"),
      "invited@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "Password1234");
    await user.click(screen.getByRole("button", { name: "Create user" }));

    expect(
      await screen.findByText("Organization dashboard"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Redirecting...")).not.toBeInTheDocument();
  });

  it("stays on the invitation after failed acceptance", async () => {
    setEndpointStatus({ status: "error", path: "accept-invitation" });
    renderInvitation();
    await userEvent.click(
      await screen.findByRole("button", { name: "Accept" }),
    );
    expect(await screen.findByText("Accept failed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
    expect(
      screen.queryByText("Organization dashboard"),
    ).not.toBeInTheDocument();
  });

  it("shows the rejection confirmation for an existing member", async () => {
    renderInvitation();
    await userEvent.click(
      await screen.findByRole("button", { name: "Reject" }),
    );
    expect(
      await screen.findByRole("heading", {
        name: "You have rejected the invitation",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Organization dashboard"),
    ).not.toBeInTheDocument();
  });
});
