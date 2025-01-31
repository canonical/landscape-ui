import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  Col,
  ConfirmationButton,
  Form,
  ModularTable,
  Row,
  SearchBox,
  Tooltip,
} from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { lazy, Suspense, useMemo, useState } from "react";
import type { CellProps, Column, HeaderProps } from "react-table";
import { useMediaQuery } from "usehooks-ts";
import { usePockets } from "../../hooks";
import type { Distribution, Pocket, Series } from "../../types";
import classes from "./PackageList.module.scss";

const EditPocketForm = lazy(() => import("../EditPocketForm"));

interface FormattedPackage extends Record<string, unknown> {
  packageName: string;
  packageVersion: string;
  difference?: "update" | "delete" | "add";
  newVersion?: string;
}

interface PackageListProps {
  readonly distributionName: Distribution["name"];
  readonly pocket: Pocket;
  readonly seriesName: Series["name"];
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
  const { setSidePanelContent, closeSidePanel } = useSidePanel();

  const {
    listPocketQuery,
    diffPullPocketQuery,
    pullPackagesToPocketQuery,
    syncMirrorPocketQuery,
    removePackagesFromPocketQuery,
    removePocketQuery,
  } = usePockets();

  const { mutate: syncMirrorPocket, isPending: isSynchronizingMirrorPocket } =
    syncMirrorPocketQuery;
  const { mutate: pullPackagesToPocket, isPending: isPullingPackagesToPocket } =
    pullPackagesToPocketQuery;

  const handleSync = () => {
    if ("mirror" === pocket.mode) {
      syncMirrorPocket({
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
      });
      return;
    } else if ("pull" === pocket.mode) {
      pullPackagesToPocket({
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
      });
    }
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

  const { mutateAsync: removePocket, isPending: isRemovingPocket } =
    removePocketQuery;

  const handleRemovePocket = async () => {
    try {
      await removePocket({
        distribution: distributionName,
        series: seriesName,
        name: pocket.name,
      });

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const {
    mutateAsync: removePackagesFromPocket,
    isPending: isRemovingPackagesFromPocket,
  } = removePackagesFromPocketQuery;

  const handleRemovePackages = async () => {
    const packages = packagesToShow
      .filter((_, index) => selectedPackages.includes(index))
      .map(({ packageName }) => packageName);

    try {
      await removePackagesFromPocket({
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
        packages,
      });
    } catch (error) {
      debug(error);
    }
  };

  const noQueryIsPending =
    !isSynchronizingMirrorPocket &&
    !isPullingPackagesToPocket &&
    !isRemovingPackagesFromPocket &&
    !isRemovingPocket;

  const { data: listPocketData, isLoading: listPocketLoading } =
    listPocketQuery(
      {
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
        search,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      },
      {
        enabled: noQueryIsPending,
      },
    );

  const pocketPackages: FormattedPackage[] = [];

  if (listPocketData) {
    for (const newPackage of listPocketData.data.results) {
      pocketPackages.push({
        packageName: newPackage.name,
        packageVersion: newPackage.version,
      });
    }
  }

  const { data: diffPullPocketData } = diffPullPocketQuery(
    {
      name: pocket.name,
      series: seriesName,
      distribution: distributionName,
    },
    {
      enabled: "pull" === pocket.mode && !listPocketLoading && noQueryIsPending,
    },
  );

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
            <Tooltip
              position="top-center"
              message={
                "delete" === row.original.difference
                  ? "Package deleted"
                  : `Version differs\nfrom parent pocket.\nParent version:\n${row.original.newVersion}`
              }
            >
              <span>{row.original.packageVersion}</span>
            </Tooltip>
          ) : (
            row.original.packageVersion
          ),
      },
    ],
    [packagesToShow, selectedPackages.length],
  );

  const hasNoPackages =
    !search &&
    currentPage === 1 &&
    itemsPerPage === 20 &&
    !listPocketData?.data.count;

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
              {"upload" !== pocket.mode && (
                <Button
                  className="p-segmented-control__button"
                  type="button"
                  onClick={handleSync}
                  disabled={
                    isSynchronizingMirrorPocket && isPullingPackagesToPocket
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
                className="p-segmented-control__button"
                type="button"
                onClick={handleEditPocket}
                aria-label={`Edit ${pocket.name} pocket of ${distributionName}/${seriesName}`}
              >
                Edit
              </Button>
              <ConfirmationButton
                className="p-segmented-control__button"
                type="button"
                aria-label={`Remove ${pocket.name} pocket of ${distributionName}/${seriesName}`}
                confirmationModalProps={{
                  title: "Deleting pocket",
                  children: (
                    <p>
                      Do you really want to delete {pocket.name} pocket from{" "}
                      {seriesName} series of {distributionName} distribution?
                    </p>
                  ),
                  confirmButtonLabel: "Delete",
                  confirmButtonAppearance: "negative",
                  confirmButtonDisabled: isRemovingPocket,
                  confirmButtonLoading: isRemovingPocket,
                  onConfirm: handleRemovePocket,
                }}
              >
                Remove
              </ConfirmationButton>
              {"upload" === pocket.mode && (
                <ConfirmationButton
                  className="p-segmented-control__button"
                  type="button"
                  disabled={
                    0 === selectedPackages.length ||
                    isRemovingPackagesFromPocket
                  }
                  aria-label={`Remove selected packages from ${pocket.name} pocket of ${distributionName}/${seriesName}`}
                  confirmationModalProps={{
                    title: "Deleting packages from pocket",
                    children: (
                      <p>
                        This will delete {selectedPackages.length} selected{" "}
                        {selectedPackages.length === 1 ? "package" : "packages"}{" "}
                        from {pocket.name} pocket {seriesName} series of{" "}
                        {distributionName} distribution
                      </p>
                    ),
                    confirmButtonLabel: "Delete",
                    confirmButtonAppearance: "negative",
                    confirmButtonDisabled: isRemovingPackagesFromPocket,
                    confirmButtonLoading: isRemovingPackagesFromPocket,
                    onConfirm: handleRemovePackages,
                  }}
                >
                  Remove packages
                </ConfirmationButton>
              )}
            </div>
          </div>
        </Col>
        {"upload" !== pocket.mode && !hasNoPackages && (
          <Col size={6} medium={3}>
            <Form
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
            </Form>
          </Col>
        )}
      </Row>

      {listPocketLoading ? (
        <LoadingState />
      ) : hasNoPackages ? (
        <p>No packages found</p>
      ) : (
        <>
          <ModularTable
            columns={columns}
            data={packagesToShow}
            emptyMsg={
              search
                ? `No packages found with the search: "${search}".`
                : undefined
            }
            className={classes.content}
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
          <SidePanelTablePagination
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
      )}
    </>
  );
};

export default PackageList;
