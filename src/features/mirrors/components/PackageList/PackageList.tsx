import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  Col,
  ConfirmationButton,
  Form,
  Row,
  SearchBox,
} from "@canonical/react-components";
import classNames from "classnames";
import type { ComponentProps, FC } from "react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { pluralize } from "../../helpers";
import { usePockets } from "../../hooks";
import type { Distribution, Pocket, Series } from "../../types";
import type { FormattedPackage } from "../../types/FormattedPackage";
import PackageTable from "../PackageTable";
import classes from "./PackageList.module.scss";

const EditPocketForm = lazy(async () => import("../EditPocketForm"));

interface PackageListProps {
  readonly distributionName: Distribution["name"];
  readonly pocket: Pocket;
  readonly seriesName: Series["name"];
}

const defaultPage = 1;
const defaultItemsPerPage = 20;

const PackageList: FC<PackageListProps> = ({
  distributionName,
  pocket,
  seriesName,
}) => {
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [hasUpdatedOrDeletedPackages, setHasUpdatedOrDeletedPackages] =
    useState(false);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [diffPullPocket, setDiffPullPocket] = useState<
    {
      packageName: string;
      newVersion: string;
      difference: "update" | "delete" | "add";
    }[]
  >([]);

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

  const handleSync = (): void => {
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

  const handleEditPocket = (): void => {
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

  const handleRemovePocket = async (): Promise<void> => {
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

  const noQueryIsPending =
    !isSynchronizingMirrorPocket &&
    !isPullingPackagesToPocket &&
    !isRemovingPackagesFromPocket &&
    !isRemovingPocket;

  const { data: listPocketQueryResult, isLoading: listPocketLoading } =
    listPocketQuery(
      {
        name: pocket.name,
        series: seriesName,
        distribution: distributionName,
        search,
        limit: itemsPerPage,
        offset: currentPage * itemsPerPage - itemsPerPage,
      },
      {
        enabled: noQueryIsPending,
      },
    );

  const listPocketData = listPocketQueryResult?.data ?? {
    count: 0,
    results: [],
  };

  const pocketPackages: FormattedPackage[] = listPocketData.results.map(
    (newPackage) => {
      return {
        packageName: newPackage.name,
        packageVersion: newPackage.version,
      };
    },
  );

  const { data: diffPullPocketQueryResult } = diffPullPocketQuery(
    {
      name: pocket.name,
      series: seriesName,
      distribution: distributionName,
    },
    {
      enabled: "pull" === pocket.mode && !listPocketLoading && noQueryIsPending,
    },
  );

  useEffect(() => {
    const diffPullPocketData = diffPullPocketQueryResult?.data ?? {};

    const diffs: {
      packageName: string;
      newVersion: string;
      difference: "update" | "delete" | "add";
    }[] = [];

    for (const dataKey in diffPullPocketData) {
      const diff = {
        add: [],
        update: [],
        delete: [],
        ...diffPullPocketData[dataKey],
      };

      for (const [packageName, newVersion] of diff.add) {
        diffPullPocket.push({
          packageName,
          newVersion,
          difference: "add",
        });
      }

      if (diff.update.length || diff.delete.length) {
        setHasUpdatedOrDeletedPackages(true);
      }

      for (const [packageName, , newVersion] of diff.update) {
        diffPullPocket.push({
          packageName,
          newVersion,
          difference: "update",
        });
      }

      for (const [packageName] of diff.delete) {
        diffPullPocket.push({
          packageName,
          difference: "delete",
          newVersion: "",
        });
      }
    }

    setDiffPullPocket(diffs);
  }, [diffPullPocketQueryResult]);

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

    return [
      ...pocketPackages.filter(({ difference }) => difference),
      ...pocketPackages.filter(({ difference }) => !difference),
    ];
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

  const handleRemovePackages = async (): Promise<void> => {
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

  const hasNoPackages =
    !search &&
    currentPage === defaultPage &&
    itemsPerPage === defaultItemsPerPage &&
    !listPocketData.count;

  const colProps: ComponentProps<typeof Col> =
    "upload" === pocket.mode
      ? {
          size: 8,
          medium: 4,
        }
      : {
          size: 6,
          medium: 3,
        };

  return (
    <>
      <Row
        className={classNames(
          "u-no-padding--left u-no-padding--right",
          classes.ctaRow,
        )}
      >
        <Col {...colProps}>
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
                    !selectedPackages.length || isRemovingPackagesFromPocket
                  }
                  aria-label={`Remove selected packages from ${pocket.name} pocket of ${distributionName}/${seriesName}`}
                  confirmationModalProps={{
                    title: "Deleting packages from pocket",
                    children: (
                      <p>
                        This will delete {selectedPackages.length} selected{" "}
                        {pluralize(
                          selectedPackages.length,
                          "package",
                          "packages",
                        )}{" "}
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
                setCurrentPage(defaultPage);
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
                  setCurrentPage(defaultPage);
                }}
                className={classNames({
                  "is-dense": !isSmallerScreen,
                  "u-no-margin--bottom": isSmallerScreen,
                })}
                onSearch={() => {
                  setSearch(inputText);
                  setCurrentPage(defaultPage);
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
          <PackageTable
            isUpload={"upload" === pocket.mode}
            packagesToShow={packagesToShow}
            search={search}
            selectedPackages={selectedPackages}
            setSelectedPackages={setSelectedPackages}
          />
          <SidePanelTablePagination
            currentPage={currentPage}
            totalItems={listPocketData.count}
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
