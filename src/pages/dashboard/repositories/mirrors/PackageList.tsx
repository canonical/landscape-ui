import { FC, lazy, Suspense, useMemo, useState } from "react";
import { Pocket } from "../../../../types/Pocket";
import { Distribution } from "../../../../types/Distribution";
import { Series } from "../../../../types/Series";
import usePockets from "../../../../hooks/usePockets";
import {
  Button,
  CheckboxInput,
  Col,
  ModularTable,
  Row,
  SearchBox,
} from "@canonical/react-components";
import useDebug from "../../../../hooks/useDebug";
import classNames from "classnames";
import useConfirm from "../../../../hooks/useConfirm";
import useSidePanel from "../../../../hooks/useSidePanel";
import classes from "./PackageList.module.scss";
import TablePagination from "../../../../components/layout/TablePagination";
import { CellProps, Column, HeaderProps } from "react-table";
import { useMediaQuery } from "usehooks-ts";
import LoadingState from "../../../../components/layout/LoadingState";

const EditPocketForm = lazy(() => import("./EditPocketForm"));

interface FormattedPackage extends Record<string, unknown> {
  packageName: string;
  packageVersion: string;
  difference?: "update" | "delete" | "add";
  newVersion?: string;
}

interface PackageListProps {
  pocket: Pocket;
  distributionName: Distribution["name"];
  seriesName: Series["name"];
}

const PackageList: FC<PackageListProps> = ({
  distributionName,
  pocket,
  seriesName,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [hasUpdatedOrDeletedPackages, setHasUpdatedOrDeletedPackages] =
    useState(false);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");

  const isSmallerScreen = useMediaQuery("(max-width: 619px)");

  const debug = useDebug();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { setSidePanelContent, closeSidePanel } = useSidePanel();

  const {
    listPocketQuery,
    diffPullPocketQuery,
    pullPackagesToPocketQuery,
    syncMirrorPocketQuery,
    removePackagesFromPocketQuery,
    removePocketQuery,
  } = usePockets();

  const {
    data: listPocketData,
    error: listPocketError,
    isLoading: listPocketLoading,
  } = listPocketQuery({
    name: pocket.name,
    series: seriesName,
    distribution: distributionName,
    search,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  });

  if (listPocketError) {
    debug(listPocketError);
  }

  const pocketPackages: FormattedPackage[] = [];

  if (listPocketData) {
    for (const newPackage of listPocketData.data.results) {
      pocketPackages.push({
        packageName: newPackage.name,
        packageVersion: newPackage.version,
      });
    }
  }

  const { data: diffPullPocketData, error: diffPullPocketError } =
    diffPullPocketQuery(
      {
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
      },
      {
        enabled: "pull" === pocket.mode && !listPocketLoading,
      },
    );

  if (diffPullPocketError) {
    debug(diffPullPocketError);
  }

  const diffPullPocket: {
    packageName: string;
    newVersion: string;
    difference: "update" | "delete" | "add";
  }[] = [];

  if (diffPullPocketData) {
    for (const dataKey in diffPullPocketData.data) {
      const diff = diffPullPocketData.data[dataKey];

      if (diff.add) {
        for (const addElement of diff.add) {
          diffPullPocket.push({
            packageName: addElement[0],
            newVersion: addElement[1],
            difference: "add",
          });
        }
      }

      if (diff.update) {
        setHasUpdatedOrDeletedPackages(true);

        for (const updateElement of diff.update) {
          diffPullPocket.push({
            packageName: updateElement[0],
            newVersion: updateElement[2],
            difference: "update",
          });
        }
      }

      if (diff.delete) {
        setHasUpdatedOrDeletedPackages(true);

        for (const deleteElement of diff.delete) {
          diffPullPocket.push({
            packageName: deleteElement[0],
            difference: "delete",
            newVersion: "",
          });
        }
      }
    }
  }

  const getSortedPackages = (): FormattedPackage[] => {
    if (!hasUpdatedOrDeletedPackages) {
      return pocketPackages;
    }

    pocketPackages.forEach((pocketPackage, index) => {
      const alteredPackage = diffPullPocket.find(
        ({ packageName }) => pocketPackage.packageName === packageName,
      );

      if (alteredPackage) {
        pocketPackages[index].difference = alteredPackage.difference;

        if ("" !== alteredPackage.newVersion) {
          pocketPackages[index].newVersion = alteredPackage.newVersion;
        }
      }
    });

    return pocketPackages.sort((a, b) => {
      if (a.difference && !b.difference) {
        return -1;
      }
      if (!a.difference && b.difference) {
        return 1;
      }
      return 0;
    });
  };

  const packagesToShow = useMemo(
    () => getSortedPackages(),
    [
      currentPage,
      itemsPerPage,
      search,
      hasUpdatedOrDeletedPackages,
      pocketPackages.length,
      diffPullPocket.length,
    ],
  );

  const columns = useMemo<Column<FormattedPackage>[]>(
    () => [
      {
        accessor: "packageName",
        Header: ({ rows }: HeaderProps<FormattedPackage>) =>
          "upload" === pocket.mode ? (
            <>
              <CheckboxInput
                inline
                label={<span className="u-off-screen">Toggle all</span>}
                disabled={0 === rows.length}
                indeterminate={
                  selectedPackages.length > 0 &&
                  selectedPackages.length < rows.length
                }
                checked={
                  selectedPackages.length === rows.length &&
                  selectedPackages.length > 0
                }
                onChange={() => {
                  setSelectedPackages((prevState) =>
                    prevState.length > 0 ? [] : rows.map((_, index) => index),
                  );
                }}
              />
              <span>Package</span>
            </>
          ) : (
            "Package"
          ),
        Cell: ({ row }: CellProps<FormattedPackage>) =>
          "upload" === pocket.mode ? (
            <CheckboxInput
              inline
              label={row.original.packageName}
              checked={selectedPackages.includes(row.index)}
              onChange={() => {
                setSelectedPackages((prevState) =>
                  prevState.includes(row.index)
                    ? prevState.filter(
                        (selectedPackage) => selectedPackage !== row.index,
                      )
                    : [...prevState, row.index],
                );
              }}
            />
          ) : (
            row.original.packageName
          ),
      },
      {
        accessor: "packageVersion",
        Header: "Version",
        getCellIcon: ({ row }: CellProps<FormattedPackage>) =>
          row.original.difference ? "warning" : false,
        className: classes.version,
        Cell: ({ row }: CellProps<FormattedPackage>) =>
          row.original.difference ? (
            <>
              <span>{row.original.packageVersion}</span>
              <span className="p-tooltip__message" role="tooltip">
                {"delete" === row.original.difference
                  ? "Package deleted"
                  : `Version differs\nfrom parent pocket.\nParent version:\n${row.original?.newVersion}`}
              </span>
            </>
          ) : (
            row.original.packageVersion
          ),
      },
    ],
    [
      selectedPackages.length,
      currentPage,
      itemsPerPage,
      hasUpdatedOrDeletedPackages,
      pocketPackages.length,
      diffPullPocket.length,
    ],
  );

  const {
    mutate: syncMirrorPocket,
    isLoading: isSynchronizingMirrorPocket,
    error: synchronizingMirrorPocketError,
  } = syncMirrorPocketQuery;
  const {
    mutate: pullPackagesToPocket,
    isLoading: isPullingPackagesToPocket,
    error: pullingPackagesToPocketError,
  } = pullPackagesToPocketQuery;

  if (synchronizingMirrorPocketError) {
    debug(synchronizingMirrorPocketError);
  }

  if (pullingPackagesToPocketError) {
    debug(pullingPackagesToPocketError);
  }

  const handleSync = () => {
    if ("mirror" === pocket.mode) {
      syncMirrorPocket({
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
      });
    } else if ("pull" === pocket.mode) {
      pullPackagesToPocket({
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
      });
    }
  };

  const {
    mutate: removePackagesFromPocket,
    isLoading: isRemovingPackagesFromPocket,
    error: removingPackagesFromPocketError,
  } = removePackagesFromPocketQuery;

  if (removingPackagesFromPocketError) {
    debug(removingPackagesFromPocketError);
  }

  const handleRemovePackages = () => {
    const packages = packagesToShow
      .filter((_, index) => selectedPackages.includes(index))
      .map(({ packageName }) => packageName);

    removePackagesFromPocket({
      name: pocket.name,
      series: seriesName,
      distribution: distributionName,
      packages,
    });
  };

  const handleEditPocket = () => {
    setSidePanelContent(
      `Edit ${pocket.name} pocket`,
      <Suspense fallback={<LoadingState />}>
        <EditPocketForm
          pocket={pocket}
          distributionName={distributionName}
          seriesName={seriesName}
        />
      </Suspense>,
    );
  };

  const { mutateAsync: removePocket, isLoading: isRemovingPocket } =
    removePocketQuery;

  const handleRemovePocket = () => {
    confirmModal({
      body: `Do you really want to delete ${pocket.name} pocket from ${seriesName} series of ${distributionName} distribution?`,
      title: "Deleting pocket",
      buttons: [
        <Button
          key={`delete-${pocket.name}-pocket`}
          appearance="negative"
          disabled={isRemovingPocket}
          onClick={async () => {
            try {
              await removePocket({
                distribution: distributionName,
                series: seriesName,
                name: pocket.name,
              });

              closeSidePanel();
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
          aria-label={`Delete ${pocket.name} pocket of ${distributionName}/${seriesName}`}
        >
          Delete
        </Button>,
      ],
    });
  };

  return (
    <>
      <Row
        className={classNames(
          "u-no-padding--left u-no-padding--right",
          classes.ctaRow,
        )}
      >
        <Col
          size={"upload" === pocket.mode ? 8 : 6}
          medium={"upload" === pocket.mode ? 4 : 3}
        >
          <div className="p-segmented-control">
            <div className="p-segmented-control__list">
              {("mirror" == pocket.mode || "pull" == pocket.mode) && (
                <Button
                  className="p-segmented-control__button"
                  onClick={handleSync}
                  disabled={
                    ("mirror" === pocket.mode && isSynchronizingMirrorPocket) ||
                    ("pull" === pocket.mode && isPullingPackagesToPocket)
                  }
                  aria-label={
                    "mirror" === pocket.mode
                      ? `Synchronize ${pocket.name} pocket of ${distributionName}/${seriesName}`
                      : `Pull packages to ${pocket.name} pocket of ${distributionName}/${seriesName}`
                  }
                >
                  {"mirror" === pocket.mode ? "Sync" : "Pull"}
                </Button>
              )}
              <Button
                dense={"upload" === pocket.mode}
                className="p-segmented-control__button"
                onClick={handleEditPocket}
                aria-label={`Edit ${pocket.name} pocket of ${distributionName}/${seriesName}`}
              >
                Edit
              </Button>
              <Button
                dense={"upload" === pocket.mode}
                className="p-segmented-control__button"
                onClick={handleRemovePocket}
                aria-label={`Remove ${pocket.name} pocket of ${distributionName}/${seriesName}`}
              >
                Remove
              </Button>
              {"upload" === pocket.mode && (
                <Button
                  dense
                  className="p-segmented-control__button"
                  disabled={
                    0 === selectedPackages.length ||
                    isRemovingPackagesFromPocket
                  }
                  onClick={handleRemovePackages}
                  aria-label={`Remove selected packages from ${pocket.name} pocket of ${distributionName}/${seriesName}`}
                >
                  Remove packages
                </Button>
              )}
            </div>
          </div>
        </Col>
        {("pull" === pocket.mode || "mirror" === pocket.mode) && (
          <Col size={6} medium={3}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSearch(inputText);
                setCurrentPage(1);
              }}
              noValidate
            >
              <SearchBox
                externallyControlled
                shouldRefocusAfterReset
                aria-label="Package search"
                onChange={(inputValue) => {
                  setInputText(inputValue);
                }}
                value={inputText}
                onClear={() => {
                  setInputText("");
                  setSearch("");
                  setCurrentPage(1);
                }}
                className={classNames({
                  "is-dense": !isSmallerScreen,
                  "u-no-margin--bottom": isSmallerScreen,
                })}
                onSearch={() => {
                  setSearch(inputText);
                  setCurrentPage(1);
                }}
                autocomplete="off"
              />
            </form>
          </Col>
        )}
      </Row>
      <ModularTable
        columns={columns}
        data={packagesToShow}
        emptyMsg={listPocketLoading ? "Loading..." : "No packages found."}
        className={classes.content}
        getRowProps={({ original }) => ({
          className: original.difference ? "p-tooltip--top-center" : "",
        })}
        getCellProps={({ column }) => {
          switch (column.id) {
            case "packageName":
              return { role: "rowheader" };
            case "packageVersion":
              return { "aria-label": "Version" };
            default:
              return {};
          }
        }}
      />
      <TablePagination
        currentPage={currentPage}
        totalItems={listPocketData?.data.count}
        paginate={(page) => {
          setSelectedPackages([]);
          setCurrentPage(page);
        }}
        pageSize={itemsPerPage}
        setPageSize={(itemsNumber) => {
          setItemsPerPage(itemsNumber);
        }}
      />
    </>
  );
};

export default PackageList;
