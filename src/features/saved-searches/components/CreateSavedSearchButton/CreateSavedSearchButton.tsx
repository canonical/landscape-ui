import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";

interface CreateSavedSearchButtonProps {
  readonly appearance?: "base" | "positive" | "negative" | "link" | "secondary";
  readonly className?: string;
  readonly buttonLabel?: string;
  readonly search?: string;
  readonly isInSidePanel?: boolean;
}

const CreateSavedSearchButton: FC<CreateSavedSearchButtonProps> = ({
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
