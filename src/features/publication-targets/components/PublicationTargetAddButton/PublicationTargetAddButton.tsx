import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";

const PublicationTargetAddButton: FC = () => {
  const { createPageParamsSetter } = usePageParams();

  const handleAdd = createPageParamsSetter({ sidePath: ["add"], name: "" });

  return (
    <Button
      appearance="positive"
      hasIcon
      onClick={handleAdd}
      type="button"
      name="Add publication target"
    >
      <Icon name="plus" light={true} />
      <span>Add publication target</span>
    </Button>
  );
};

export default PublicationTargetAddButton;
