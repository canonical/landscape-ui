import type { FC, FormEvent } from "react";
import { lazy, Suspense, useState } from "react";
import type { StagedOidcGroup } from "../../types";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SearchBoxWithForm from "@/components/form/SearchBoxWithForm";
import EmployeeGroupSortableList from "../EmployeeGroupSortableList";
import { Form } from "@canonical/react-components";
import { useEmployeeGroupsImport } from "../../api";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import classes from "../../styles.module.scss";

const EmployeeGroupIdentityIssuerList = lazy(
  () => import("../EmployeeGroupIdentityIssuerList"),
);

const Description = () => (
  <p className={classes.description}>
    Set priority levels for employee groups to resolve conflicts when assigning
    Autoinstall files. By default, no priorities are set. Employees in multiple
    groups inherit the file from the highest-priority group. The list is sorted
    from highest priority (lowest number) to lowest priority (highest number).
  </p>
);

interface EmployeeGroupsOrganiserFormProps {
  readonly stagedGroups: StagedOidcGroup[];
}

const EmployeeGroupsOrganiserForm: FC<EmployeeGroupsOrganiserFormProps> = ({
  stagedGroups,
}) => {
  const [sortedGroupList, setSortedGroupList] = useState(stagedGroups);
  const [searchText, setSearchText] = useState("");

  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { notify } = useNotify();

  const { createEmployeeGroup, isEmployeeGroupCreating } =
    useEmployeeGroupsImport();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createEmployeeGroup(sortedGroupList.map(({ id }) => id));

      closeSidePanel();

      notify.success({
        title: `You've successfully imported ${sortedGroupList.length} employee ${sortedGroupList.length > 1 ? "groups" : "group"}`,
        message:
          "Newly added Employee groups can now be managed within Landscape.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleBackButtonPress = () => {
    setSidePanelContent(
      "Choose an identity issuer",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupIdentityIssuerList />
      </Suspense>,
    );
  };

  return (
    <>
      <Description />
      <SearchBoxWithForm
        onSearch={(search) => {
          setSearchText(search);
        }}
      />
      <Form onSubmit={handleSubmit}>
        <EmployeeGroupSortableList
          visibleGroupList={sortedGroupList.filter(({ name }) =>
            name.toLowerCase().includes(searchText.toLowerCase()),
          )}
          groupList={sortedGroupList}
          onSort={(groupList) => {
            setSortedGroupList(groupList);
          }}
        />
        <SidePanelFormButtons
          hasBackButton
          onBackButtonPress={handleBackButtonPress}
          submitButtonText="Import"
          submitButtonDisabled={isEmployeeGroupCreating}
        />
      </Form>
    </>
  );
};

export default EmployeeGroupsOrganiserForm;
