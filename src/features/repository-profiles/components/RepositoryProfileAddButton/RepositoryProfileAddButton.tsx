import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";

const RepositoryProfileForm = lazy(
  () =>
    import("@/features/repository-profiles/components/RepositoryProfileForm"),
);

const RepositoryProfileAddButton: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleAddProfile = () => {
    setSidePanelContent(
      "Add repository profile",
      <Suspense fallback={<LoadingState />}>
        <RepositoryProfileForm action="add" />
      </Suspense>,
    );
  };

  return (
    <Button
      appearance="positive"
      key="add"
      onClick={handleAddProfile}
      type="button"
      hasIcon
    >
      <Icon name="plus" light={true} />
      <span>Add repository profile</span>
    </Button>
  );
};

export default RepositoryProfileAddButton;
