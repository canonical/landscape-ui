import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";


const NewPublicationTargetForm = lazy(
  async () =>
    import(
      "@/features/publication-targets/components/NewPublicationTargetForm"
    ).then((m) => ({ default: m.NewPublicationTargetForm })),
);

const PublicationTargetAddButton: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleAdd = () => {
    setSidePanelContent(
      "Add publication target",
      <Suspense fallback={<LoadingState />}>
        <NewPublicationTargetForm />
      </Suspense>,
    );
  };

  return (
    <Button appearance="positive" hasIcon onClick={handleAdd} type="button">
      <Icon name="plus" light={true} />
      <span>Add publication target</span>
    </Button>
  );
};

export default PublicationTargetAddButton;
