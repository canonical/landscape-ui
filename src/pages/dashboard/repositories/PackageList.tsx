import { FC, useLayoutEffect, useRef, useState } from "react";
import { Pocket } from "../../../types/Pocket";
import { Distribution } from "../../../types/Distribution";
import { Series } from "../../../types/Series";
import usePockets from "../../../hooks/usePockets";
import {
  Button,
  Col,
  Input,
  MainTable,
  Pagination,
  Row,
} from "@canonical/react-components";
import { Package } from "../../../types/Package";
import useDebug from "../../../hooks/useDebug";

const paginationLimit = 15;

interface PackageFormProps {
  pocket: Pocket;
  distribution: Distribution;
  series: Series;
}

const PackageList: FC<PackageFormProps> = ({
  distribution,
  pocket,
  series,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const debug = useDebug();

  const {
    listPocketQuery,
    pullPackagesToPocketQuery,
    syncMirrorPocketQuery,
    removePackagesFromPocketQuery,
  } = usePockets();

  const { data: pocketPackagesData, error: pocketPackagesListError } =
    listPocketQuery({
      name: pocket.name,
      series: series.name,
      distribution: distribution.name,
    });

  if (pocketPackagesListError) {
    debug(pocketPackagesListError);
  }

  const pocketPackages: Package[] = [];

  if (pocketPackagesData) {
    for (const dataKey in pocketPackagesData.data) {
      pocketPackages.push(...pocketPackagesData.data[dataKey]);
    }
  }

  const checkBoxRef = useRef<HTMLInputElement>(null);

  const packagesToShow = pocketPackages.filter(
    (_, index) =>
      index >= (currentPage - 1) * paginationLimit &&
      index < currentPage * paginationLimit
  );

  const rows = packagesToShow.map(([packageName, packageVersion], index) => {
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

    return {
      columns: [
        {
          content: firstColumnContent,
        },
        {
          content: packageVersion,
        },
      ],
    };
  });

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
        series: series.name,
        distribution: distribution.name,
      });
    } else if ("pull" === pocket.mode) {
      pullPackagesToPocket({
        name: pocket.name,
        series: series.name,
        distribution: distribution.name,
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
      .map(([packageName]) => packageName);

    removePackagesFromPocket({
      name: pocket.name,
      series: series.name,
      distribution: distribution.name,
      packages,
    });
  };

  return (
    <>
      <Row className="u-no-padding--left u-no-padding--right ">
        <Col size={"upload" === pocket.mode ? 7 : 6} className="is-bordered">
          {"upload" !== pocket.mode && (
            <Button
              appearance="base"
              small
              dense
              className="u-no-margin--right"
              onClick={handleSync}
              disabled={
                ("mirror" === pocket.mode && isSynchronizingMirrorPocket) ||
                ("pull" === pocket.mode && isPullingPackagesToPocket)
              }
            >
              Sync
            </Button>
          )}
          <Button appearance="base" small dense className="u-no-margin--right">
            Edit
          </Button>
          <Button appearance="base" small dense className="u-no-margin--right">
            Remove
          </Button>
          {"upload" === pocket.mode && (
            <Button
              appearance="base"
              small
              dense
              className="u-no-margin--right"
              disabled={
                0 === selectedPackages.length || isRemovingPackagesFromPocket
              }
              onClick={handleRemovePackages}
            >
              Remove packages
            </Button>
          )}
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
        emptyStateMsg={"No packages found."}
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
