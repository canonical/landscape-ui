import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import {
  CheckboxInput,
  Form,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import type { CellProps, Column } from "react-table";
import type { FC } from "react";
import { lazy, Suspense, useMemo, useState } from "react";
import { isNotUnique } from "../../helpers";
import type { StagedOidcGroup } from "../../types";
import SearchBoxWithForm from "@/components/form/SearchBoxWithForm";
import { useStagedOidcGroups } from "../../api";
import type { OidcIssuer } from "@/features/oidc";
import classes from "../../styles.module.scss";

const EmployeeGroupIdentityIssuerList = lazy(
  () => import("../EmployeeGroupIdentityIssuerList"),
);

const EmployeeGroupsOrganiserForm = lazy(
  () => import("../EmployeeGroupsOrganiserForm"),
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

  const { setSidePanelContent } = useSidePanel();
  const { stagedOidcGroups, isStagedOidcGroupsLoading } = useStagedOidcGroups(
    issuer.id,
  );

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
        <EmployeeGroupIdentityIssuerList />
      </Suspense>,
    );
  };

  const handleSubmit = () => {
    setSidePanelContent(
      "Organize Employee groups priority",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupsOrganiserForm
          stagedGroups={stagedOidcGroups.filter(({ id }) =>
            selectedGroupIds.includes(id),
          )}
        />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<StagedOidcGroup>[]>(
    () => [
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
      {
        accessor: "name",
        Header: "name",
        Cell: ({
          row: {
            original: { name },
          },
        }: CellProps<StagedOidcGroup>) => {
          return (
            <>
              <span className="p-text--small-caps">
                {name}
                {isNotUnique(stagedOidcGroups, name) && (
                  <Tooltip
                    message={`group id: 19872981yf938v6986136EEF`} //TODO change
                  >
                    <span>&nbsp;(...6EEF)</span>
                  </Tooltip>
                )}
              </span>
            </>
          );
        },
      },
    ],
    [selectedGroupIds, isStagedOidcGroupsLoading, stagedOidcGroups],
  );

  if (isStagedOidcGroupsLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <Description />
      <SearchBoxWithForm onSearch={(input) => setSearchText(input)} />
      <Form noValidate>
        <ModularTable data={filteredEmployeeGroups} columns={columns} />
        <SidePanelFormButtons
          hasBackButton
          onBackButtonPress={handleBackButtonPress}
          submitButtonText="Import"
          submitButtonDisabled={selectedGroupIds.length === 0}
          onSubmit={handleSubmit}
        />
      </Form>
    </>
  );
};

export default ImportEmployeeGroupsForm;
