import type { FC } from "react";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { PageParamFilter, TableFilterChips } from "@/components/filter";
import type { ProfileType } from "@/types/Profile";
import AddProfileButton from "../../components/AddProfileButton";
import PassRateFilter from "@/components/filter/PassRateFilter";
import type { FilterKey } from "@/components/filter/TableFilterChips/types";
import classes from "./ProfilesHeader.module.scss";
import { STATUS_OPTIONS } from "./constants";
import { canArchiveProfile } from "../../helpers";

interface ProfilesHeaderProps {
  readonly type: ProfileType;
}

const ProfilesHeader: FC<ProfilesHeaderProps> = ({ type }) => {
  const hasFilters = canArchiveProfile(type);

  const filters: FilterKey[] = (() => {
    switch (type) {
      case "script":
        return ["search", "status"];
      case "security":
        return ["status", "search", "passRateFrom", "passRateTo"];
      default:
        return ["search"];
    }
  })();

  const actionsClass = (() => {
    switch (type) {
      case "script":
        return classes.actions;
      case "security":
        return classes.filters;
      default:
        return undefined;
    }
  })();

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={actionsClass}>
            {hasFilters && (
              <>
                <PageParamFilter
                  pageParamKey="status"
                  label="Status"
                  options={STATUS_OPTIONS}
                />
                {type == "script" ? (
                  <AddProfileButton type={type} />
                ) : (
                  <PassRateFilter />
                )}
              </>
            )}
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={filters}
        statusOptions={hasFilters ? STATUS_OPTIONS : undefined}
      />
    </>
  );
};

export default ProfilesHeader;
