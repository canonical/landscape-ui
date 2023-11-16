import { FC, useMemo, useState } from "react";
import { CheckboxInput, Chip, ModularTable } from "@canonical/react-components";
import { usePackages } from "../../../hooks/usePackages";
import useDebug from "../../../hooks/useDebug";
import TablePagination from "../../../components/layout/TablePagination";
import SearchBoxWithDescriptionButton from "../../../components/form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "../../../components/layout/SearchHelpPopup";
import { MACHINE_SEARCH_HELP_TERMS } from "../machines/_data";
import classes from "./PackagesContainer.module.scss";
import LoadingState from "../../../components/layout/LoadingState";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import { Package } from "../../../types/Package";

interface PackagesContainerProps {
  selectedPackageNames: string[];
  setSelectedPackageNames: (value: string[]) => void;
  query: string;
  setQuery: (value: string) => void;
}

const PackagesContainer: FC<PackagesContainerProps> = ({
  selectedPackageNames,
  setSelectedPackageNames,
  query,
  setQuery,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [chips, setChips] = useState<{
    [key in keyof Package["computers"]]?: boolean;
  }>({});

  const debug = useDebug();

  const { getPackagesQuery } = usePackages();

  const {
    data: getPackagesQueryResult,
    isLoading: getPackagesQueryLoading,
    error: getPackagesQueryError,
  } = getPackagesQuery(
    {
      query,
      installed: chips.installed,
      available: chips.available,
      upgrade: chips.upgrades,
      held: chips.held,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    },
    {
      enabled: !!query,
    },
  );

  if (getPackagesQueryError) {
    debug(getPackagesQueryError);
  }

  const packages = useMemo(() => {
    return getPackagesQueryResult?.data ?? [];
  }, [getPackagesQueryResult?.data]);

  const toggleAll = () => {
    setSelectedPackageNames(
      selectedPackageNames.length > 0 ? [] : packages.map(({ name }) => name),
    );
  };

  const columns = useMemo<Column<Package>[]>((): Column<Package>[] => {
    return [
      {
        accessor: "name",
        Header: (
          <>
            <CheckboxInput
              inline
              label={<span className="u-off-screen">Toggle all</span>}
              checked={
                selectedPackageNames.length === packages.length &&
                packages.length > 0
              }
              indeterminate={
                selectedPackageNames.length < packages.length &&
                selectedPackageNames.length > 0
              }
              disabled={packages.length === 0}
              onChange={toggleAll}
            />
            <span>Name</span>
          </>
        ),
        Cell: ({ row }: CellProps<Package, unknown>) => {
          return (
            <>
              <CheckboxInput
                inline
                label={
                  <span className="u-off-screen">{row.original.name}</span>
                }
                checked={selectedPackageNames.includes(row.original.name)}
                onChange={() => {
                  setSelectedPackageNames(
                    selectedPackageNames.includes(row.original.name)
                      ? selectedPackageNames.filter(
                          (name) => name !== row.original.name,
                        )
                      : [...selectedPackageNames, row.original.name],
                  );
                }}
              />
              <span>{row.original.name}</span>
            </>
          );
        },
      },
      {
        accessor: "version",
        Header: "Version",
      },
      {
        accessor: "summary",
        Header: "Summary",
      },
    ];
  }, [getPackagesQueryResult?.data, selectedPackageNames]);

  const handleChipClick = (chipKey: keyof Package["computers"]) => {
    setChips((prevState) => {
      switch (prevState[chipKey]) {
        case undefined:
          return {
            ...prevState,
            [chipKey]: true,
          };
        case true:
          return {
            ...prevState,
            [chipKey]: false,
          };
        case false:
          return {
            ...prevState,
            [chipKey]: undefined,
          };
        default:
          return prevState;
      }
    });
  };

  const getChipValue = (chipKey: keyof Package["computers"]) => {
    const label = "upgrades" === chipKey ? "upgrade" : chipKey;

    switch (chips[chipKey]) {
      case undefined:
        return label;
      case true:
        return `+ ${label}`;
      case false:
        return `- ${label}`;
      default:
        return "";
    }
  };

  const getChipAppearance = (chipKey: keyof Package["computers"]) => {
    switch (chips[chipKey]) {
      case undefined:
        return undefined;
      case true:
        return "positive";
      case false:
        return "negative";
      default:
        return undefined;
    }
  };

  const getEmptyMsg = () => {
    if ("" === query) {
      return;
    }

    let msg = `No packages found with "query=${query}`;

    for (const chipsKey in chips) {
      const key = chipsKey as keyof Package["computers"];

      if (undefined !== chips[key]) {
        msg += `&${key}=${chips[key]}`;
      }
    }

    return `${msg}"`;
  };

  return (
    <>
      <div className={classes.searchRow}>
        <form
          className={classes.search}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setSelectedPackageNames([]);
            setCurrentPage(1);
            setQuery(search);
          }}
        >
          <SearchBoxWithDescriptionButton
            inputValue={search}
            onInputChange={(inputValue) => {
              setSearch(inputValue);
            }}
            onSearchClick={() => {
              setSelectedPackageNames([]);
              setCurrentPage(1);
              setQuery(search);
            }}
            onClear={() => {
              setSelectedPackageNames([]);
              setCurrentPage(1);
              setQuery("");
            }}
            onDescriptionClick={() => {
              setShowDescription(true);
            }}
          />
          <div>
            <Chip
              value={getChipValue("installed")}
              onClick={() => handleChipClick("installed")}
              appearance={getChipAppearance("installed")}
            />
            <Chip
              value={getChipValue("available")}
              onClick={() => handleChipClick("available")}
              appearance={getChipAppearance("available")}
            />
            <Chip
              value={getChipValue("upgrades")}
              onClick={() => handleChipClick("upgrades")}
              appearance={getChipAppearance("upgrades")}
            />
            <Chip
              value={getChipValue("held")}
              onClick={() => handleChipClick("held")}
              appearance={getChipAppearance("held")}
            />
          </div>
        </form>
      </div>
      <SearchHelpPopup
        open={showDescription}
        data={MACHINE_SEARCH_HELP_TERMS}
        onClose={() => {
          setShowDescription(false);
        }}
      />
      {"" !== query &&
        (getPackagesQueryLoading ? (
          <LoadingState />
        ) : (
          <ModularTable
            columns={columns}
            data={packages}
            emptyMsg={getEmptyMsg()}
          />
        ))}
      <TablePagination
        currentPage={currentPage}
        totalItems={10}
        paginate={(page) => {
          setSelectedPackageNames([]);
          setCurrentPage(page);
        }}
        pageSize={itemsPerPage}
        setPageSize={(itemsNumber) => {
          setSelectedPackageNames([]);
          setCurrentPage(1);
          setItemsPerPage(itemsNumber);
        }}
      />
    </>
  );
};

export default PackagesContainer;
