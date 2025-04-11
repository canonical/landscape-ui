import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { CheckboxInput, Form, ModularTable } from "@canonical/react-components";
import type { CellProps, Column } from "react-table";
import type { FC, FormEvent } from "react";
import { lazy, Suspense, useMemo, useState } from "react";
import type { StagedOidcGroup } from "../../types";
import SearchBoxWithForm from "@/components/form/SearchBoxWithForm";
import { useImportEmployeeGroups, useStagedOidcGroups } from "../../api";
import type { OidcIssuer } from "@/features/oidc";
import MaybeExceededLimitNotification from "../MaybeExceededLimitNotification";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import classes from "./ImportEmployeeGroupsForm.module.scss";
import SidePanelDescription from "../SidePanelDescription";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { PAGE_SIZE_OPTIONS } from "@/components/layout/TablePagination/components/TablePaginationBase/constants";
import EmptyState from "@/components/layout/EmptyState";

const EmployeeGroupIdentityIssuerListContainer = lazy(
  async () => import("../EmployeeGroupIdentityIssuerListContainer"),
);

interface ImportEmployeeGroupsFormProps {
  readonly issuer: OidcIssuer;
}

const ImportEmployeeGroupsForm: FC<ImportEmployeeGroupsFormProps> = ({
  issuer,
}) => {
  const [search, setSearch] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [importAll, setImportAll] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0].value);

  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const { stagedOidcGroups, stagedOidcGroupsCount, isStagedOidcGroupsLoading } =
    useStagedOidcGroups({ issuerId: issuer.id, pageSize, currentPage, search });

  const debug = useDebug();
  const { notify } = useNotify();

  const { importEmployeeGroups, isEmployeeGroupsImporting } =
    useImportEmployeeGroups();

  const handlePageChange = (page: number) => {
    setSelectedGroupIds([]);
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSelectedGroupIds([]);
    setPageSize(newPageSize);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const {
        data: { count },
      } = await importEmployeeGroups({
        staged_oidc_group_ids: selectedGroupIds,
        import_all: importAll,
      });

      closeSidePanel();

      notify.success({
        title: `You’ve successfully Imported ${count} Employee ${count > 1 ? "groups" : "group"}.`,
        message:
          "Newly added Employee groups can now be managed within Landscape.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleToggleSingleEmployeeGroup = (id: number) => {
    setSelectedGroupIds(
      selectedGroupIds.includes(id)
        ? selectedGroupIds.filter((selectedGroup) => selectedGroup !== id)
        : [...selectedGroupIds, id],
    );
  };

  const handleBackButtonPress = () => {
    setSidePanelContent(
      "Choose an identity issuer",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupIdentityIssuerListContainer />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<StagedOidcGroup>[]>(() => {
    const nameColumn = {
      accessor: "name",
      Header: "name",
      Cell: ({
        row: {
          original: { name },
        },
      }: CellProps<StagedOidcGroup>) => {
        return (
          <>
            <span>{name}</span>
          </>
        );
      },
    };

    if (importAll) {
      return [nameColumn];
    } else {
      return [
        {
          accessor: "id",
          className: "checkbox-column",
          Header: () => (
            <CheckboxInput
              inline
              label={
                <span className="u-off-screen">Toggle all employee groups</span>
              }
              disabled={
                stagedOidcGroups.length === 0 || isStagedOidcGroupsLoading
              }
              indeterminate={
                selectedGroupIds.length > 0 &&
                selectedGroupIds.length < stagedOidcGroups.length
              }
              checked={
                selectedGroupIds.length > 0 &&
                selectedGroupIds.length === stagedOidcGroups.length
              }
              onChange={() => {
                setSelectedGroupIds(
                  selectedGroupIds.length > 0
                    ? []
                    : stagedOidcGroups.map(({ id }) => id),
                );
              }}
            />
          ),
          Cell: ({ row: { original } }: CellProps<StagedOidcGroup>) => (
            <CheckboxInput
              labelClassName="u-no-margin--bottom u-no-padding--top"
              label={
                <span className="u-off-screen">{`Toggle ${original.name}`}</span>
              }
              disabled={isStagedOidcGroupsLoading}
              name="employee-group-checkbox"
              checked={selectedGroupIds.includes(original.id)}
              onChange={() => {
                handleToggleSingleEmployeeGroup(original.id);
              }}
            />
          ),
        },
        nameColumn,
      ];
    }
  }, [
    selectedGroupIds,
    isStagedOidcGroupsLoading,
    stagedOidcGroups,
    importAll,
  ]);

  if (isStagedOidcGroupsLoading && !search) {
    return <LoadingState />;
  }

  if (!stagedOidcGroupsCount && !search) {
    return (
      <EmptyState
        title="No employee groups found"
        body={
          <p className="u-no-margin--bottom">
            {`Seems like there are no employee groups to import from ${issuer.provider.provider_label}.`}
          </p>
        }
      />
    );
  }

  return (
    <>
      <MaybeExceededLimitNotification />
      <SidePanelDescription>
        Choose employee groups to import into Landscape. Once imported, you can
        set their priority, assign Autoinstall files, and manage associated
        employees.
      </SidePanelDescription>
      <div className={classes.checkbox}>
        <CheckboxInput
          label="Import all groups"
          onChange={() => {
            setImportAll((prev) => !prev);
          }}
          checked={importAll}
        />
      </div>
      <SearchBoxWithForm
        onSearch={(input) => {
          setSearch(input);
        }}
      />
      {isStagedOidcGroupsLoading ? (
        <LoadingState />
      ) : (
        <Form noValidate onSubmit={handleSubmit}>
          <ModularTable
            data={stagedOidcGroups}
            columns={columns}
            emptyMsg={`No employee groups found with the search: "${search}"`}
          />
          <SidePanelTablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            paginate={handlePageChange}
            setPageSize={handlePageSizeChange}
            totalItems={stagedOidcGroupsCount}
            className={classes.pagination}
          />
          <SidePanelFormButtons
            hasBackButton
            onBackButtonPress={handleBackButtonPress}
            submitButtonText="Import"
            submitButtonDisabled={
              (!importAll && selectedGroupIds.length === 0) ||
              isEmployeeGroupsImporting
            }
          />
        </Form>
      )}
    </>
  );
};

export default ImportEmployeeGroupsForm;
