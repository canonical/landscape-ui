import { FC, HTMLProps, SyntheticEvent, useMemo, useState } from "react";
import { usePackages } from "../../../hooks/usePackages";
import { Button, Form, ModularTable } from "@canonical/react-components";
import SidePanelFormButtons from "../../../components/form/SidePanelFormButtons";
import useDebug from "../../../hooks/useDebug";
import useSidePanel from "../../../hooks/useSidePanel";
import { Computer } from "../../../types/Computer";
import { Cell, CellProps, Column, TableCellProps } from "react-table";
import { useNavigate } from "react-router-dom";
import classes from "./MachinesUpgrades.module.scss";
import { mockUsns } from "./_data";
import moment from "moment";
import { DISPLAY_DATE_FORMAT } from "../../../constants";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import LoadingState from "../../../components/layout/LoadingState";
import ExpandableTableFooter from "../../../components/layout/ExpandableTableFooter";
import OverflowingCell from "./OverflowingCell";

const GET_USNS = ({
  limit,
  offset,
  query,
}: {
  limit: number;
  offset: number;
  query: number[];
}): {
  limit: number;
  offset: number;
  notices: typeof mockUsns;
  notice_count: number;
} => {
  return {
    notices: mockUsns
      .filter(({ release_packages }) =>
        release_packages.some(({ computers: { upgrades } }) =>
          upgrades.some((id) => query.includes(id)),
        ),
      )
      .slice(offset, offset + limit),
    limit,
    offset,
    notice_count: mockUsns.length,
  };
};

const overflowingSpansCount = (
  elements: NodeList | null,
  overflowRowLimit = 1,
) => {
  if (!elements) {
    return 0;
  }

  let count = 0;

  elements.forEach((element) => {
    const span = element as HTMLSpanElement;

    if (span.offsetTop > span.offsetHeight * overflowRowLimit) {
      count++;
    }
  });

  return count;
};

interface MachinesUpgradesProps {
  selectedMachines: Computer[];
}

const MachinesUpgrades: FC<MachinesUpgradesProps> = ({ selectedMachines }) => {
  const [securityIssuesLimit, setSecurityIssuesLimit] = useState(2);
  const [affectedMachinesLimit, setAffectedMachinesLimit] = useState(5);
  const [expandedUsn, setExpandedUsn] = useState<string>("");
  const [innerTableLimit, setInnerTableLimit] = useState(2);

  const navigate = useNavigate();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { getPackagesQuery, upgradePackagesQuery } = usePackages();

  const {
    data: fetchedMockedUsns,
    error: fetchedMockedUsnsError,
    isLoading: fetchedMockedUsnsLoading,
  } = useQuery({
    queryKey: [
      "mockedUsns",
      {
        limit: securityIssuesLimit,
        offset: 0,
        query: selectedMachines.map(({ id }) => id),
      },
    ],
    queryFn: () =>
      GET_USNS({
        limit: securityIssuesLimit,
        offset: 0,
        query: selectedMachines.map(({ id }) => id),
      }),
    enabled: !!selectedMachines.length,
  });

  if (fetchedMockedUsnsError) {
    debug(fetchedMockedUsnsError);
  }

  const container = document.querySelector(".p-accordion__tab");

  if (container) {
    const spans = container.querySelectorAll(".cve");
    const overflowSpans = overflowingSpansCount(spans);
    if (overflowSpans) {
      container.setAttribute("data-hidden-items", `${overflowSpans}`);
    }
  }

  const { data: getPackagesQueryResult, error: getPackagesQueryError } =
    getPackagesQuery({
      query: `id:${selectedMachines.map(({ id }) => id).join(" OR id:")}`,
      upgrade: true,
    });

  if (getPackagesQueryError) {
    debug(getPackagesQueryError);
  }

  const { mutateAsync: upgradePackages, isLoading: upgradePackagesLoading } =
    upgradePackagesQuery;

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      await upgradePackages({
        query: `id:${selectedMachines.map(({ id }) => id).join(" OR id:")}`,
        packages: (getPackagesQueryResult?.data.results ?? []).map(
          ({ name }) => name,
        ),
      });

      closeSidePanel();
    } catch (error) {
      console.error(error);
    }
  };

  const expandedPackages = useMemo<
    (typeof mockUsns)[number]["release_packages"]
  >(() => {
    if (!fetchedMockedUsns) {
      return [];
    }

    return fetchedMockedUsns.notices
      .filter(({ name }) => name === expandedUsn)
      .flatMap(({ release_packages }) => release_packages)
      .slice(0, innerTableLimit);
  }, [fetchedMockedUsns, expandedUsn, innerTableLimit]);

  const expandedPackagesColumns = useMemo<
    Column<(typeof mockUsns)[number]["release_packages"][number]>[]
  >(
    () => [
      {
        accessor: "name",
        Header: "Package",
        Cell: ({
          row,
        }: CellProps<
          (typeof mockUsns)[number]["release_packages"][number]
        >) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
          >
            {row.original.name}
          </Button>
        ),
      },
      {
        accessor: "current_version",
        Header: "Current version",
      },
      {
        accessor: "fix_version",
        Header: "New version",
      },
      {
        accessor: "summary",
        Header: "Details",
      },
    ],
    [expandedPackages.length],
  );

  const securityIssues = useMemo<typeof mockUsns>(() => {
    if (fetchedMockedUsnsLoading) {
      return [
        {
          name: "loading",
          published: "",
          cves_ids: [],
          summary: "",
          release_packages: [],
        },
      ];
    }

    if (!fetchedMockedUsns) {
      return [];
    }

    if (!expandedUsn) {
      return fetchedMockedUsns.notices;
    }

    return [
      ...fetchedMockedUsns.notices,
      {
        name: "expandedUsn",
        published: "",
        cves_ids: [],
        summary: "",
        release_packages: [],
      },
    ].sort((a, b) => {
      if (a.name === "expandedUsn" && b.name !== expandedUsn) {
        return -1;
      }

      return 0;
    });
  }, [fetchedMockedUsns, fetchedMockedUsnsLoading, expandedUsn]);

  const securityIssueColumns = useMemo<Column<(typeof mockUsns)[number]>[]>(
    () => [
      {
        accessor: "name",
        Header: "USN",
        Cell: ({ row }: CellProps<(typeof mockUsns)[number]>) => {
          if (
            row.original.name !== "loading" &&
            row.original.name !== "expandedUsn"
          ) {
            return (
              <Button
                type="button"
                appearance="link"
                className="u-no-margin--bottom u-no-padding--top"
              >
                {row.original.name}
              </Button>
            );
          }

          if (row.original.name !== "loading") {
            return (
              <>
                <ModularTable
                  columns={expandedPackagesColumns}
                  data={expandedPackages}
                  className="u-no-margin--bottom"
                />
                <ExpandableTableFooter
                  buttonText="Show 2 more"
                  itemName="package"
                  limit={innerTableLimit}
                  onClick={() => {
                    setInnerTableLimit((prevState) => prevState + 2);
                  }}
                  total={
                    fetchedMockedUsns?.notices.find(
                      ({ name }) => name === expandedUsn,
                    )?.release_packages.length ?? 0
                  }
                />
              </>
            );
          }

          return <LoadingState />;
        },
      },
      {
        accessor: "cves_ids",
        Header: "CVE(s)",
        Cell: ({ row }: CellProps<(typeof mockUsns)[number]>) => (
          <OverflowingCell items={row.original.cves_ids} />
        ),
      },
      {
        accessor: "published",
        Header: "Date published",
        Cell: ({ row }: CellProps<(typeof mockUsns)[number]>) => (
          <>
            {moment(row.original.published).isValid()
              ? moment(row.original.published).format(DISPLAY_DATE_FORMAT)
              : "---"}
          </>
        ),
      },
      {
        accessor: "release_packages",
        Header: "Affected packages",
        Cell: ({ row }: CellProps<(typeof mockUsns)[number]>) => (
          <>
            <Button
              type="button"
              className={classNames("p-accordion__tab", classes.expandButton)}
              aria-expanded={row.original.name === expandedUsn}
              onClick={() => {
                setExpandedUsn((prevState) =>
                  prevState === row.original.name ? "" : row.original.name,
                );
                setInnerTableLimit(2);
              }}
            >
              {row.original.release_packages.length}
            </Button>
          </>
        ),
      },
    ],
    [selectedMachines.length, expandedUsn, expandedPackages.length],
  );

  const handleSecurityIssuesCellProps = ({
    column,
    row: {
      original: { name },
    },
  }: Cell<(typeof mockUsns)[number]>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (name === expandedUsn) {
      if (column.id === "release_packages") {
        cellProps.className = classes.expanded;
      }
    } else if (["expandedUsn", "loading"].includes(name)) {
      if (column.id === "name") {
        cellProps.colSpan = 4;
        if (name === "expandedUsn") {
          cellProps.className = classes.innerTable;
        }
      } else {
        cellProps.className = classes.hidden;
        cellProps["aria-hidden"] = true;
      }
    }

    return cellProps;
  };

  const affectedMachines = useMemo<Computer[]>(
    () => selectedMachines.slice(0, affectedMachinesLimit),
    [selectedMachines, affectedMachinesLimit],
  );

  const machineColumns = useMemo<Column<Computer>[]>(
    () => [
      {
        accessor: "title",
        Header: "Machine",
        Cell: ({ row }: CellProps<Computer>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              navigate(`/machines/${row.original.hostname}`, {
                state: { tab: "packages", filter: "upgrade", selectAll: true },
              });
            }}
          >
            {row.original.title}
          </Button>
        ),
      },
      {
        accessor: "security_upgrades",
        Header: "Security upgrades",
        Cell: 4,
      },
      {
        accessor: "upgrades",
        Header: "Regular upgrades",
        Cell: 42,
      },
    ],
    [selectedMachines.length],
  );

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <p className="p-heading--5">Security issues</p>
        <ModularTable
          columns={securityIssueColumns}
          data={securityIssues}
          className="u-no-margin--bottom"
          getCellProps={handleSecurityIssuesCellProps}
        />
        <ExpandableTableFooter
          buttonText="Show 2 more"
          itemName="security issue"
          limit={securityIssuesLimit}
          onClick={() => {
            setSecurityIssuesLimit((prevState) => prevState + 2);
          }}
          total={fetchedMockedUsns?.notice_count ?? 0}
        />
      </div>

      <div>
        <p className="p-heading--5">Affected machines</p>
        <ModularTable
          columns={machineColumns}
          data={affectedMachines}
          className="u-no-margin--bottom"
        />
        <ExpandableTableFooter
          buttonText="Show 5 more"
          itemName="machine"
          limit={affectedMachinesLimit}
          onClick={() => {
            setAffectedMachinesLimit((prevState) => prevState + 5);
          }}
          total={selectedMachines.length}
        />
      </div>

      <SidePanelFormButtons
        disabled={upgradePackagesLoading}
        submitButtonText="Request all upgrades"
      />
    </Form>
  );
};

export default MachinesUpgrades;
