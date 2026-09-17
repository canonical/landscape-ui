import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { useMemo } from "react";
import { useGetOverLimitUsgProfiles } from "@/features/usg-profiles";
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
  const { hasOverLimitUsgProfiles, overLimitUsgProfilesCount } =
    useGetOverLimitUsgProfiles(
      {
        limit: INSURANCE_LIMIT,
        offset: 0,
      },
      { enabled: isFeatureEnabled("usg-profiles") },
    );

  if (IS_DEV_ENV && overLimitUsgProfilesCount >= INSURANCE_LIMIT) {
    console.warn(
      `There are ${INSURANCE_LIMIT} or more over-limit USG profiles, so the navigation badge will be inaccurate`,
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
      if (!hasOverLimitUsgProfiles || item.label !== "Profiles") {
        return item;
      }

      return {
        ...item,
        items: item.items?.map((subItem) => {
          if (subItem.label === "USG profiles") {
            return {
              ...subItem,
              badge: {
                count: overLimitUsgProfilesCount,
                isNegative: true,
              },
            };
          }
          return subItem;
        }),
      };
    });
  }, [isSaas, isSelfHosted, isFeatureEnabled, hasOverLimitUsgProfiles]);
}
