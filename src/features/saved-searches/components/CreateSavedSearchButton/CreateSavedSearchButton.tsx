import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";

interface CreateSavedSearchButtonProps {
  readonly afterCreate?: () => void;
  readonly appearance?: "base" | "positive" | "negative" | "link" | "secondary";
  readonly className?: string;
  readonly buttonLabel?: string;
  readonly search?: string;
  readonly isInSidePanel?: boolean;
  readonly onBackButtonPress?: () => void;
}

const CreateSavedSearchButton: FC<CreateSavedSearchButtonProps> = ({
  afterCreate,
  appearance = "secondary",
  buttonLabel = "Add saved search",
  search = "",
  className,
  isInSidePanel = false,
}) => {
  const { setPageParams, sidePath } = usePageParams();

  return (
    <Button
      type="button"
      appearance={appearance}
      onClick={() => {
        setPageParams({ sidePath: [...sidePath, "create-saved-search"], query: search });
        afterCreate?.();
      }}
      className={className}
      hasIcon={isInSidePanel}
    >
      {isInSidePanel && <Icon name="plus" />}
      {<span>{buttonLabel}</span>}
    </Button>
  );
};

export default CreateSavedSearchButton;
