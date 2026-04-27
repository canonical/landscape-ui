import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import { lazy, Suspense } from "react";

const AddPublicationForm = lazy(() => import("../AddPublicationForm"));

const AddPublicationButton = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleAddPublication = () => {
    setSidePanelContent(
      "Add publication",
      <Suspense fallback={<LoadingState />}>
        <AddPublicationForm />
      </Suspense>,
    );
  };

  return (
    <Button
      appearance="positive"
      hasIcon
      type="button"
      onClick={handleAddPublication}
    >
      <Icon name="plus" light />
      <span>Add publication</span>
    </Button>
  );
};

export default AddPublicationButton;
