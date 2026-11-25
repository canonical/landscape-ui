import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, type ButtonProps } from "@canonical/react-ds-global";
import { lazy, Suspense, type FC } from "react";
import { useCreateSavedSearch } from "../../api";
import type { FormProps } from "../SavedSearchForm";
import { SIDEPANEL_SIZE } from "../../constants";

const SavedSearchForm = lazy(async () => import("../SavedSearchForm"));

interface CreateSavedSearchButtonProps {
  readonly afterCreate?: () => void;
  readonly importance?: ButtonProps["importance"];
  readonly anticipation?: ButtonProps["anticipation"];
  readonly variant?: ButtonProps["variant"];
  readonly className?: string;
  readonly buttonLabel?: string;
  readonly search?: string;
  readonly onBackButtonPress?: () => void;
}

const CreateSavedSearchButton: FC<CreateSavedSearchButtonProps> = ({
  afterCreate,
  importance = "secondary",
  anticipation,
  variant,
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
      importance={importance}
      anticipation={anticipation}
      variant={variant}
      icon={isInSidePanel ? "plus" : undefined}
      onClick={handleCreateClick}
      className={className}
    >
      {buttonLabel}
    </Button>
  );
};

export default CreateSavedSearchButton;
