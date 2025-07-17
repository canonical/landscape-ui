import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import type { FC } from "react";
import { getFilteredByEnvMenuItems } from "./helpers";
import NavigationItem from "@/templates/dashboard/Navigation/components/NavigationItem";

const Navigation: FC = () => {
  const { isSaas, isSelfHosted } = useEnv();
  const { isFeatureEnabled } = useAuth();

  return (
    <div className="p-side-navigation--icons is-dark">
      <nav aria-label="Main">
        <ul className="u-no-margin--bottom u-no-margin--left u-no-padding--left">
          {getFilteredByEnvMenuItems({ isSaas, isSelfHosted })
            .filter(({ requiresFeature }) =>
              requiresFeature ? isFeatureEnabled(requiresFeature) : true,
            )
            .map((item) => (
              <NavigationItem key={item.path} item={item} />
            ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
