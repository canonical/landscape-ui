import { FC, useLayoutEffect, useRef, useState } from "react";
import { Pocket } from "../../../../types/Pocket";
import { Distribution } from "../../../../types/Distribution";
import { Series } from "../../../../types/Series";
import usePockets from "../../../../hooks/usePockets";
import {
  Button,
  Col,
  Input,
  MainTable,
  Pagination,
  Row,
  Spinner,
} from "@canonical/react-components";
import useDebug from "../../../../hooks/useDebug";
import classNames from "classnames";
import useConfirm from "../../../../hooks/useConfirm";
import useSidePanel from "../../../../hooks/useSidePanel";
import EditPocketForm from "./EditPocketForm";
import classes from "./PackageList.module.scss";

interface FormattedPackage {
  packageName: string;
  packageVersion: string;
  difference?: "update" | "delete" | "add";
  newVersion?: string;
}

const paginationLimit = 15;

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
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [hasUpdatedOrDeletedPackages, setHasUpdatedOrDeletedPackages] =
    useState(false);

  const debug = useDebug();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { setSidePanelContent } = useSidePanel();

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
      }
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
        ({ packageName }) => pocketPackage.packageName === packageName
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

  const sortedPackages = getSortedPackages();

  const packagesToShow = sortedPackages.filter(
    (_, index) =>
      index >= (currentPage - 1) * paginationLimit &&
      index < currentPage * paginationLimit
  );

  const rows = packagesToShow.map(
    ({ packageName, packageVersion, difference, newVersion }, index) => {
      const firstColumnContent =
        "upload" === pocket.mode ? (
          <label className="p-checkbox--inline">
            <input
              type="checkbox"
              checked={selectedPackages.includes(index)}
              className="p-checkbox__input"
              onChange={(event) => {
                setSelectedPackages(
                  event.target.checked
                    ? (prevState) => [...prevState, index]
                    : (prevState) =>
                        prevState.filter(
                          (selectedPackage) => selectedPackage !== index
                        )
                );
              }}
            />
            <span className="p-checkbox__label">{packageName}</span>
          </label>
        ) : (
          packageName
        );

      const versionInfo =
        "pull" === pocket.mode && difference ? (
          <div className={classNames("p-tooltip--right", classes.withIcon)}>
            <span>{packageVersion}</span>
            <i className="p-icon--warning" />
            <span className="p-tooltip__message" role="tooltip">
              {"update" === difference
                ? `Version differs\nfrom parent pocket.\nParent version: ${newVersion}`
                : "Package deleted"}
            </span>
          </div>
        ) : (
          packageVersion
        );

      return {
        columns: [
          {
            content: firstColumnContent,
          },
          {
            content: versionInfo,
          },
        ],
      };
    }
  );

  const checkBoxRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (0 === rows.length) {
      return;
    }

    const isIndeterminate =
      selectedPackages.length > 0 && selectedPackages.length < rows.length;
    setChecked(selectedPackages.length === rows.length);
    setIndeterminate(isIndeterminate);
    if (null !== checkBoxRef.current) {
      checkBoxRef.current.indeterminate = isIndeterminate;
    }
  }, [selectedPackages, rows]);

  const toggleAll = () => {
    setSelectedPackages(
      checked || indeterminate ? [] : rows.map((_, index) => index)
    );
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  };

  const headers = [
    {
      content:
        "upload" === pocket.mode ? (
          <label className="p-checkbox--inline">
            <input
              ref={checkBoxRef}
              type="checkbox"
              checked={checked}
              onChange={toggleAll}
              className="p-checkbox__input"
            />
            <span className="p-checkbox__label">Package</span>
          </label>
        ) : (
          "Package"
        ),
    },
    {
      content: "Version",
    },
  ];

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
      />
    );
  };

  const {
    mutate: removePocket,
    isLoading: isRemovingPocket,
    error: removePocketError,
  } = removePocketQuery;

  if (removePocketError) {
    debug(removePocketError);
  }

  const handleRemovePocket = () => {
    confirmModal({
      body: `Do you really want to delete ${pocket.name} pocket from ${seriesName} series of ${distributionName} distribution?`,
      title: "Deleting pocket",
      buttons: [
        <Button
          key={`delete-${pocket.name}-pocket`}
          appearance="negative"
          disabled={isRemovingPocket}
          onClick={() => {
            removePocket({
              distribution: distributionName,
              series: seriesName,
              name: pocket.name,
            });

            closeConfirmModal();
          }}
        >
          Delete
        </Button>,
      ],
    });
  };

  return (
    <>
      <Row className="u-no-padding--left u-no-padding--right ">
        <Col
          size={"upload" === pocket.mode ? 8 : 6}
          className={classNames("is-bordered")}
        >
          <div className="p-segmented-control">
            <div className="p-segmented-control__list">
              {"upload" !== pocket.mode && (
                <Button
                  dense
                  className="p-segmented-control__button"
                  onClick={handleSync}
                  disabled={
                    ("mirror" === pocket.mode && isSynchronizingMirrorPocket) ||
                    ("pull" === pocket.mode && isPullingPackagesToPocket)
                  }
                >
                  Sync
                </Button>
              )}
              <Button
                dense
                className="p-segmented-control__button"
                onClick={handleEditPocket}
              >
                Edit
              </Button>
              <Button
                dense
                className="p-segmented-control__button"
                onClick={handleRemovePocket}
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
                >
                  Remove packages
                </Button>
              )}
            </div>
          </div>
        </Col>
        {"upload" !== pocket.mode && (
          <Col size={6}>
            <Input
              type="text"
              placeholder="Search"
              aria-label="Package search"
              className="is-dense"
            />
          </Col>
        )}
      </Row>
      <MainTable
        headers={headers}
        rows={rows}
        emptyStateMsg={
          listPocketLoading ? (
            <div className={classes.loading}>
              <Spinner />
            </div>
          ) : (
            "No packages found."
          )
        }
        className={classes.content}
      />
      <Pagination
        currentPage={currentPage}
        itemsPerPage={paginationLimit}
        paginate={(page) => {
          setSelectedPackages([]);
          setChecked(false);
          setIndeterminate(false);
          setCurrentPage(page);
        }}
        totalItems={pocketPackages.length}
      />
    </>
  );
};

export default PackageList;
