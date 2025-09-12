import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
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
    >
      Add repository profile
    </Button>
  );
};

export default RepositoryProfileAddButton;
