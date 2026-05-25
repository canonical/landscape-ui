import type { FC } from "react";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { PageParamFilter, TableFilterChips } from "@/components/filter";
import PassRateFilter from "@/components/filter/PassRateFilter";
import type { FilterKey } from "@/components/filter/TableFilterChips/types";
import classes from "./ProfilesHeader.module.scss";
import { STATUS_OPTIONS } from "./constants";
import { canArchiveProfile, ProfileTypes } from "../../helpers";
import AddProfileButton from "../AddProfileButton";

interface ProfilesHeaderProps {
  readonly type: ProfileTypes;
}

const ProfilesHeader: FC<ProfilesHeaderProps> = ({ type }) => {
  const hasFilters = canArchiveProfile(type);

  const getFilters = (): FilterKey[] => {
    switch (type) {
      case ProfileTypes.script:
        return ["search", "status"];
      case ProfileTypes.usg:
        return ["status", "search", "passRateFrom", "passRateTo"];
      default:
        return ["search"];
    }
  };

  const getActionsClass = () => {
    switch (type) {
      case ProfileTypes.script:
        return classes.actions;
      case ProfileTypes.usg:
        return classes.filters;
      default:
        return undefined;
    }
  };

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={getActionsClass()}>
            {hasFilters && (
              <>
                <PageParamFilter
                  pageParamKey="status"
                  label="Status"
                  options={STATUS_OPTIONS}
                />
                {type === ProfileTypes.script ? (
                  <AddProfileButton isInsideScriptHeader={true} />
                ) : (
                  <PassRateFilter />
                )}
              </>
            )}
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={getFilters()}
        statusOptions={hasFilters ? STATUS_OPTIONS : undefined}
      />
    </>
  );
};

export default ProfilesHeader;
