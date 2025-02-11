/* eslint-disable @typescript-eslint/no-unused-vars */
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { employeeGroups } from "@/tests/mocks/employees";
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
import type { EmployeeGroup } from "../../types";

const EmployeeGroupIdentityProviderForm = lazy(
  () => import("../EmployeeGroupIdentityProviderForm"),
);

const EmployeeGroupsOrganiserForm = lazy(
  () => import("../EmployeeGroupsOrganiserForm"),
);

interface ImportEmployeeGroupsFormProps {
  readonly providerId: number;
}

const ImportEmployeeGroupsForm: FC<ImportEmployeeGroupsFormProps> = ({
  providerId,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedEmployeeGroups, setSelectedEmployeeGroups] = useState<
    number[]
  >([]);

  const { setSidePanelContent } = useSidePanel();

  const isEmployeeGroupsLoading = false;

  const filteredEmployeeGroups = employeeGroups.filter((employeeGroup) =>
    employeeGroup.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleToggleSingleEmployeeGroup = (id: number) => {
    setSelectedEmployeeGroups(
      selectedEmployeeGroups.includes(id)
        ? selectedEmployeeGroups.filter((selectedGroup) => selectedGroup !== id)
        : [...selectedEmployeeGroups, id],
    );
  };

  const handleBackButtonPress = () => {
    setSidePanelContent(
      "Choose an identity provider",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupIdentityProviderForm />
      </Suspense>,
    );
  };

  const handleSubmit = () => {
    setSidePanelContent(
      "Organise employee groups",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupsOrganiserForm
          employeeGroups={employeeGroups.filter((group) =>
            selectedEmployeeGroups.includes(group.id),
          )}
        />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<EmployeeGroup>[]>(
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
              filteredEmployeeGroups.length === 0 || isEmployeeGroupsLoading
            }
            indeterminate={
              selectedEmployeeGroups.length > 0 &&
              selectedEmployeeGroups.length < employeeGroups.length
            }
            checked={
              selectedEmployeeGroups.length > 0 &&
              selectedEmployeeGroups.length === employeeGroups.length
            }
            onChange={() =>
              setSelectedEmployeeGroups(
                selectedEmployeeGroups.length > 0
                  ? []
                  : employeeGroups.map(({ id }) => id),
              )
            }
          />
        ),
        Cell: ({ row: { original } }: CellProps<EmployeeGroup>) => (
          <CheckboxInput
            labelClassName="u-no-margin--bottom u-no-padding--top"
            label={
              <span className="u-off-screen">{`Toggle ${original.name}`}</span>
            }
            disabled={isEmployeeGroupsLoading}
            name="employee-group-checkbox"
            checked={selectedEmployeeGroups.includes(original.id)}
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
        }: CellProps<EmployeeGroup>) => {
          return (
            <>
              <span className="p-text--small-caps">
                {name}
                {isNotUnique(employeeGroups, name) && (
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
    [selectedEmployeeGroups],
  );

  console.log(providerId);

  return (
    <Form noValidate>
      <HeaderWithSearch onSearch={(input) => setSearchText(input)} />
      <ModularTable
        data={[
          ...filteredEmployeeGroups,
          ...filteredEmployeeGroups,
          ...filteredEmployeeGroups,
          ...filteredEmployeeGroups,
          ...filteredEmployeeGroups,
          ...filteredEmployeeGroups,
        ]}
        columns={columns}
      />
      <SidePanelFormButtons
        hasBackButton
        onBackButtonPress={handleBackButtonPress}
        submitButtonText="Import"
        submitButtonDisabled={selectedEmployeeGroups.length === 0}
        onSubmit={handleSubmit}
      />
    </Form>
  );
};

export default ImportEmployeeGroupsForm;
