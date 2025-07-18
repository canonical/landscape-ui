import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { useMemo } from "react";
import { useGetOverLimitSecurityProfiles } from "@/features/security-profiles";
import { IS_DEV_ENV } from "@/constants";
import { MENU_ITEMS } from "@/templates/dashboard/Navigation/constants";
import {
  getFilteredByEnvItems,
  getFilteredByFeatureItems,
} from "@/templates/dashboard/Navigation/helpers";

const INSURANCE_LIMIT = 20;

export function useMenuItems() {
  const { isSaas, isSelfHosted } = useEnv();
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

  return useMemo(() => {
    const filteredByEnvItems = getFilteredByEnvItems({
      isSaas,
      isSelfHosted,
      items: MENU_ITEMS,
    });

    const filteredByFeatureItems = getFilteredByFeatureItems({
      isFeatureEnabled,
      items: filteredByEnvItems,
    });

    return filteredByFeatureItems.map((item) => {
      if (!hasOverLimitSecurityProfiles || item.label !== "Profiles") {
        return item;
      }

      return {
        ...item,
        items: item.items?.map((subItem) => {
          if (subItem.label === "Security profiles") {
            return {
              ...subItem,
              badge: {
                count: overLimitSecurityProfilesCount,
                isNegative: true,
              },
            };
          }
          return subItem;
        }),
      };
    });
  }, [isSaas, isSelfHosted, isFeatureEnabled, hasOverLimitSecurityProfiles]);
}
