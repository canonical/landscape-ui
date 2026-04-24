import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";

const AddLocalRepositoryButton: FC = () => {
  const { createPageParamsSetter } = usePageParams();
  const handleOpen = createPageParamsSetter({ sidePath: ["add"] });

  return (
    <Button appearance="positive" hasIcon onClick={handleOpen} type="button">
      <Icon name="plus" light />
      <span>Add local repository</span>
    </Button>
  );
};

export default AddLocalRepositoryButton;
