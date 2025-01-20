/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, lazy, Suspense } from "react";
import { EmployeeGroup } from "../../types";
import { Form, List } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import DragAndDropList from "../DragAndDropList";

const ImportEmployeeGroupsForm = lazy(
  () => import("../ImportEmployeeGroupsForm"),
);

interface EmployeeGroupsOrganiserFormProps {
  employeeGroups: EmployeeGroup[];
}

const EmployeeGroupsOrganiserForm: FC<EmployeeGroupsOrganiserFormProps> = ({
  employeeGroups,
}) => {
  const { setSidePanelContent } = useSidePanel();

  console.log(employeeGroups);
  const items = employeeGroups.map((employeeGroup) => (
    <p key={employeeGroup.id}>{employeeGroup.name}</p>
  ));

  const handleSubmit = () => {
    //
  };

  const handleBackButtonPress = () => {
    setSidePanelContent(
      "Choose an identity provider",
      <Suspense fallback={<LoadingState />}>
        <ImportEmployeeGroupsForm providerId={1} />
      </Suspense>,
    );
  };

  return (
    <>
      <List items={items} />
      <DragAndDropList />
      <SidePanelFormButtons
        hasBackButton
        onBackButtonPress={handleBackButtonPress}
        submitButtonText="Import"
        submitButtonDisabled={false}
      />
    </>
  );
};

export default EmployeeGroupsOrganiserForm;
