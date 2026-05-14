import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";

const RepositoryProfileAddButton: FC = () => {
  const { createPageParamsSetter } = usePageParams();

  return (
    <Button
      appearance="positive"
      key="add"
      onClick={createPageParamsSetter({ sidePath: ["add"] })}
      type="button"
      hasIcon
    >
      <Icon name="plus" light={true} />
      <span>Add repository profile</span>
    </Button>
  );
};

export default RepositoryProfileAddButton;
