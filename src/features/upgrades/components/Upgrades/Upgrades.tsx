import { SidePanelTableFilterChips } from "@/components/filter";
import LoadingState from "@/components/layout/LoadingState";
import { usePackages } from "@/features/packages";
import { SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import { useState, type FC } from "react";
import UpgradesList from "../UpgradesList";

const Upgrades: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  const { getPackagesQuery } = usePackages();

  const {
    data: packagesResponse,
    isPending: isPendingPackages,
    error: packagesError,
  } = getPackagesQuery({
    query: "",
    upgrade: true,
  });

  if (packagesError) {
    throw packagesError;
  }

  const clear = () => {
    setInputValue("");
    setSearch("");
  };

  return (
    <>
      <SearchBox
        className={classNames("u-no-margin--bottom")}
        externallyControlled
        value={inputValue}
        onChange={setInputValue}
        onClear={clear}
        onSearch={setSearch}
        autoComplete="off"
      />
      <SidePanelTableFilterChips
        filters={[
          {
            label: "Search",
            item: search || undefined,
            clear,
          },
        ]}
      />
      {isPendingPackages ? (
        <LoadingState />
      ) : (
        <UpgradesList packages={packagesResponse.data.results} />
      )}
    </>
  );
};

export default Upgrades;
