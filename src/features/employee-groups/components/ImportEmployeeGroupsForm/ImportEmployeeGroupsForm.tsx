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

const EmployeeGroupIdentityIssuerListContainer = lazy(
  () => import("../EmployeeGroupIdentityIssuerListContainer"),
);

const Description = () => (
  <p className={classes.description}>
    Choose employee groups to import into Landscape. Once imported, you can set
    their priority, assign Autoinstall files, and manage associated employees.
  </p>
);

interface ImportEmployeeGroupsFormProps {
  readonly issuer: OidcIssuer;
}

const ImportEmployeeGroupsForm: FC<ImportEmployeeGroupsFormProps> = ({
  issuer,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [importAll, setImportAll] = useState(true);

  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const { stagedOidcGroups, isStagedOidcGroupsLoading } = useStagedOidcGroups(
    issuer.id,
  );

  const debug = useDebug();
  const { notify } = useNotify();

  const { importEmployeeGroups, isEmployeeGroupsImporting } =
    useImportEmployeeGroups();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { count } = await importEmployeeGroups({
        importAll,
        stagedOidcGroupIds: selectedGroupIds,
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

  const filteredEmployeeGroups = stagedOidcGroups.filter((employeeGroup) =>
    employeeGroup.name.toLowerCase().includes(searchText.toLowerCase()),
  );

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
                filteredEmployeeGroups.length === 0 || isStagedOidcGroupsLoading
              }
              indeterminate={
                selectedGroupIds.length > 0 &&
                selectedGroupIds.length < stagedOidcGroups.length
              }
              checked={
                selectedGroupIds.length > 0 &&
                selectedGroupIds.length === stagedOidcGroups.length
              }
              onChange={() =>
                setSelectedGroupIds(
                  selectedGroupIds.length > 0
                    ? []
                    : stagedOidcGroups.map(({ id }) => id),
                )
              }
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
              onChange={() => handleToggleSingleEmployeeGroup(original.id)}
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

  if (isStagedOidcGroupsLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <MaybeExceededLimitNotification />
      <Description />
      <div className={classes.checkbox}>
        <CheckboxInput
          label="Import all groups"
          onChange={() => setImportAll((prev) => !prev)}
          checked={importAll}
        />
      </div>
      <SearchBoxWithForm onSearch={(input) => setSearchText(input)} />
      <Form noValidate onSubmit={handleSubmit}>
        <ModularTable data={filteredEmployeeGroups} columns={columns} />
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
    </>
  );
};

export default ImportEmployeeGroupsForm;
