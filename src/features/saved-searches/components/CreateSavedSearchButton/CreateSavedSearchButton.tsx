import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import { useCreateSavedSearch } from "../../api";
import type { FormProps } from "../SavedSearchForm";
import { SIDEPANEL_SIZE } from "../../constants";

const SavedSearchForm = lazy(async () => import("../SavedSearchForm"));

interface CreateSavedSearchButtonProps {
  readonly afterCreate?: () => void;
  readonly appearance?: "base" | "positive" | "negative" | "link" | "secondary";
  readonly className?: string;
  readonly buttonLabel?: string;
  readonly search?: string;
  readonly onBackButtonPress?: () => void;
}

const CreateSavedSearchButton: FC<CreateSavedSearchButtonProps> = ({
  afterCreate,
  appearance = "secondary",
  buttonLabel = "Add saved search",
  search = "",
  className,
  onBackButtonPress,
}) => {
  const { createSavedSearch } = useCreateSavedSearch();
  const { notify } = useNotify();
  const debug = useDebug();
  const { setSidePanelContent, closeSidePanel } = useSidePanel();

  const isInSidePanel = Boolean(onBackButtonPress);

  const handleSubmit = async (values: FormProps) => {
    try {
      await createSavedSearch({
        title: values.title,
        search: values.search,
      });

      closeSidePanel();

      if (afterCreate) {
        afterCreate();
      }

      notify.success({
        title: "Saved search created",
        message: `The saved search "${values.title}" has been created successfully.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleCreateClick = () => {
    const sidePanelSize = onBackButtonPress && SIDEPANEL_SIZE;

    setSidePanelContent(
      "Add saved search",
      <Suspense fallback={<LoadingState />}>
        <SavedSearchForm
          mode="create"
          initialValues={{
            title: "",
            search,
          }}
          onSubmit={handleSubmit}
          onBackButtonPress={onBackButtonPress}
        />
      </Suspense>,
      sidePanelSize,
    );
  };

  return (
    <Button
      type="button"
      appearance={appearance}
      onClick={handleCreateClick}
      className={className}
      hasIcon={isInSidePanel}
    >
      {isInSidePanel && <Icon name="plus" light />}
      {<span>{buttonLabel}</span>}
    </Button>
  );
};

export default CreateSavedSearchButton;
