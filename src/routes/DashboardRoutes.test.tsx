import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Outlet } from "react-router";
import { describe, expect, it } from "vitest";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { FeatureGuard } from "@/components/guards/FeatureGuard";
import { SelfHostedGuard } from "@/components/guards/SelfHostedGuard";
import { PATHS } from "@/libs/routes";
import { DashboardRoutes } from "./DashboardRoutes";

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

const flattenRoutes = (
  routeElement: ReactElement<RouteLikeProps>,
): ReactElement<RouteLikeProps>[] => {
  const directChildren = getRouteChildren(routeElement);
  return directChildren.flatMap((child) => [child, ...flattenRoutes(child)]);
};

describe("DashboardRoutes", () => {
  it("wraps dashboard routes with auth guard and outlet", () => {
    const wrapper = (DashboardRoutes as ReactElement<RouteLikeProps>).props
      .element;
    assert(wrapper);
    const guardWrapper = wrapper as ReactElement<{ children: ReactElement }>;
    expect(guardWrapper.type).toBe(AuthGuard);

    const wrappedChild = guardWrapper.props.children;
    expect(wrappedChild.type).toBe(Outlet);
  });

  it("includes key dashboard route paths", () => {
    const allRoutes = flattenRoutes(
      DashboardRoutes as ReactElement<RouteLikeProps>,
    );
    const paths = allRoutes.map((route) => route.props.path).filter(Boolean);

    expect(paths).toContain(PATHS.root.root);
    expect(paths).toContain(PATHS.overview.root);
    expect(paths).toContain(PATHS.instances.root);
    expect(paths).toContain(PATHS.instances.single);
    expect(paths).toContain(PATHS.account.apiCredentials);
    expect(paths).toContain(PATHS.repositories.mirrors);
    expect(paths).toContain(PATHS.settings.employees);
  });

  it("uses self-hosted and feature guards for guarded paths", () => {
    const allRoutes = flattenRoutes(
      DashboardRoutes as ReactElement<RouteLikeProps>,
    );

    const mirrorsRoute = allRoutes.find(
      (route) => route.props.path === PATHS.repositories.mirrors,
    );
    const employeesRoute = allRoutes.find(
      (route) => route.props.path === PATHS.settings.employees,
    );
    const identityProvidersRoute = allRoutes.find(
      (route) => route.props.path === PATHS.settings.identityProviders,
    );

    const wslProfilesRoute = allRoutes.find(
      (route) => route.props.path === PATHS.profiles.wsl,
    );

    assert(mirrorsRoute?.props.element);
    assert(employeesRoute?.props.element);
    assert(identityProvidersRoute?.props.element);
    assert(wslProfilesRoute?.props.element);

    expect(mirrorsRoute.props.element.type).toBe(SelfHostedGuard);
    expect(employeesRoute.props.element.type).toBe(FeatureGuard);
    expect(identityProvidersRoute.props.element.type).toBe(FeatureGuard);
    expect(wslProfilesRoute.props.element.type).toBe(FeatureGuard);
  });
});
