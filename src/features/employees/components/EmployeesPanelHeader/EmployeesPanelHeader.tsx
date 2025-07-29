import {
  AutoinstallFilesFilter,
  StatusFilter,
  TableFilterChips,
} from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import {
  getAutoinstallFileOptions,
  useGetAutoinstallFiles,
} from "@/features/autoinstall-files";
import { type FC, useMemo } from "react";
import { STATUS_OPTIONS } from "./constants";
import classes from "./EmployeesPanelHeader.module.scss";

const EmployeesPanelHeader: FC = () => {
  const { autoinstallFiles } = useGetAutoinstallFiles();

  const autoinstallFileOptions = useMemo(
    () => getAutoinstallFileOptions(autoinstallFiles),
    [autoinstallFiles],
  );

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.filters}>
            <AutoinstallFilesFilter
              label="Autoinstall files"
              options={autoinstallFileOptions}
            />
            <StatusFilter label="Status" options={STATUS_OPTIONS} />
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={["autoinstallFiles", "search", "status"]}
        autoinstallFileOptions={autoinstallFileOptions}
        statusOptions={STATUS_OPTIONS}
      />
    </>
  );
};

export default EmployeesPanelHeader;
