import { FC, useMemo, useState } from "react";
import { Pocket } from "../../../../types/Pocket";
import { Distribution } from "../../../../types/Distribution";
import { Series } from "../../../../types/Series";
import usePockets from "../../../../hooks/usePockets";
import {
  Button,
  CheckboxInput,
  Col,
  Input,
  ModularTable,
  Row,
} from "@canonical/react-components";
import useDebug from "../../../../hooks/useDebug";
import classNames from "classnames";
import useConfirm from "../../../../hooks/useConfirm";
import useSidePanel from "../../../../hooks/useSidePanel";
import EditPocketForm from "./EditPocketForm";
import classes from "./PackageList.module.scss";
import TablePagination from "../../../../components/layout/TablePagination";
import {
  CellProps,
  Column,
  HeaderProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { useMediaQuery } from "usehooks-ts";

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

  const isSmall = useMediaQuery("(min-width: 620px)");

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
  });

  if (listPocketError) {
    debug(listPocketError);
  }

  const pocketPackages: FormattedPackage[] = [];

  if (listPocketData) {
    for (const dataKey in listPocketData.data) {
      for (const [packageName, packageVersion] of listPocketData.data[
        dataKey
      ]) {
        pocketPackages.push({ packageName, packageVersion });
      }
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
    () =>
      getSortedPackages().filter(
        (_, index) =>
          index >= (currentPage - 1) * itemsPerPage &&
          index < currentPage * itemsPerPage,
      ),
    [
      currentPage,
      itemsPerPage,
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
        Cell: ({ row, value }: CellProps<FormattedPackage, unknown>) => {
          if ("string" !== typeof value) {
            return null;
          }

          return "upload" === pocket.mode ? (
            <CheckboxInput
              inline
              label={value}
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
            value
          );
        },
      },
      {
        accessor: "packageVersion",
        Header: "Version",
        getCellIcon: ({ row }: CellProps<FormattedPackage, unknown>) =>
          row.original.difference ? "warning" : false,
        className: classes.version,
        Cell: ({ row, value }: CellProps<FormattedPackage, unknown>) => {
          if ("string" !== typeof value) {
            return null;
          }

          return row.original.difference ? (
            <>
              <span>{value}</span>
              <span className="p-tooltip__message" role="tooltip">
                {"delete" === row.original.difference
                  ? "Package deleted"
                  : `Version differs\nfrom parent pocket.\nParent version:\n${row.original?.newVersion}`}
              </span>
            </>
          ) : (
            value
          );
        },
      },
    ],
    [],
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
      <EditPocketForm
        pocket={pocket}
        distributionName={distributionName}
        seriesName={seriesName}
      />,
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
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
              closeSidePanel();
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
                  dense
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
                dense
                className="p-segmented-control__button"
                onClick={handleEditPocket}
                aria-label={`Edit ${pocket.name} pocket of ${distributionName}/${seriesName}`}
              >
                Edit
              </Button>
              <Button
                dense
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
            <Input
              type="text"
              placeholder="Search"
              aria-label="Package search"
              className={classNames({
                "is-dense": isSmall,
                "u-no-margin--bottom": !isSmall,
              })}
            />
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
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={Math.ceil(pocketPackages.length / itemsPerPage)}
        paginate={(page) => {
          setSelectedPackages([]);
          setCurrentPage(page);
        }}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={(itemsNumber) => {
          setItemsPerPage(itemsNumber);
        }}
      />
    </>
  );
};

export default PackageList;
