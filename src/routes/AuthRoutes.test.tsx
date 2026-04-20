import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Outlet } from "react-router";
import { describe, expect, it } from "vitest";
import { GuestGuard } from "@/components/guards/GuestGuard";
import { FeatureGuard } from "@/components/guards/FeatureGuard";
import { PATHS } from "@/libs/routes";
import { AuthRoutes } from "./AuthRoutes";

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

describe("AuthRoutes", () => {
  it("wraps auth routes with guest guard and outlet", () => {
    const wrapper = (AuthRoutes as ReactElement<RouteLikeProps>).props.element;
    assert(wrapper);
    const guardWrapper = wrapper as ReactElement<{ children: ReactElement }>;
    expect(guardWrapper.type).toBe(GuestGuard);

    const wrappedChild = guardWrapper.props.children;
    expect(wrappedChild.type).toBe(Outlet);
  });

  it("defines expected auth paths", () => {
    const childRoutes = getRouteChildren(
      AuthRoutes as ReactElement<RouteLikeProps>,
    );
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
    const childRoutes = getRouteChildren(
      AuthRoutes as ReactElement<RouteLikeProps>,
    );

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
});
