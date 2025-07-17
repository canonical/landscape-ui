import type { FC } from "react";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";
import NavigationLink from "@/templates/dashboard/Navigation/components/NavigationLink";
import { useLocation } from "react-router";
import useAuth from "@/hooks/useAuth";
import { useGetOverLimitSecurityProfiles } from "@/features/security-profiles";
import { IS_DEV_ENV } from "@/constants";
import { getPathToExpand } from "@/templates/dashboard/Navigation/helpers";
import NavigationRoute from "@/templates/dashboard/Navigation/components/NavigationRoute";
import NavigationExpandableParent from "@/templates/dashboard/Navigation/components/NavigationExpandableParent";

const INSURANCE_LIMIT = 20;

interface NavigationExpandableProps {
  readonly item: MenuItem;
}

const NavigationExpandable: FC<NavigationExpandableProps> = ({ item }) => {
  const [expanded, setExpanded] = useState("");
  const { pathname } = useLocation();

  const { isFeatureEnabled } = useAuth();

  const { hasOverLimitSecurityProfiles, overLimitSecurityProfilesCount } =
    useGetOverLimitSecurityProfiles(
      {
        limit: INSURANCE_LIMIT,
        offset: 0,
      },
      { enabled: isFeatureEnabled("usg-profiles") },
    );

  if (IS_DEV_ENV && overLimitSecurityProfilesCount >= INSURANCE_LIMIT) {
    console.warn(
      `There are ${INSURANCE_LIMIT} or more over-limit security profiles, so the navigation badge will be inaccurate`,
    );
  }

  useEffect(() => {
    const shouldBeExpandedPath = getPathToExpand(pathname);

    if (shouldBeExpandedPath) {
      setExpanded(shouldBeExpandedPath);
    }
  }, [pathname]);

  return (
    <>
      <NavigationExpandableParent
        item={item}
        expanded={expanded}
        onClick={() => {
          setExpanded(expanded === item.path ? "" : item.path);
        }}
      />
      {item.items && item.items.length > 0 && (
        <ul
          className="p-side-navigation__list"
          aria-expanded={expanded === item.path}
        >
          {item.items
            .filter(({ requiresFeature }) =>
              requiresFeature ? isFeatureEnabled(requiresFeature) : true,
            )
            .map((subItem) => (
              <li key={subItem.path}>
                {subItem.path.startsWith("http") ? (
                  <NavigationLink item={subItem} />
                ) : (
                  <NavigationRoute
                    item={subItem}
                    current={pathname === subItem.path}
                    badgeCount={
                      subItem.label === "Security profiles" &&
                      hasOverLimitSecurityProfiles
                        ? overLimitSecurityProfilesCount
                        : undefined
                    }
                  />
                )}
              </li>
            ))}
        </ul>
      )}
    </>
  );
};

export default NavigationExpandable;
