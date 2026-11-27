import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-ds-global";
import type { FC } from "react";

const AddLocalRepositoryButton: FC = () => {
  const { createPageParamsSetter } = usePageParams();
  const handleOpen = createPageParamsSetter({ sidePath: ["add"] });

  return (
    <Button
      type="button"
      importance="primary"
      anticipation="constructive"
      icon="plus"
      onClick={handleOpen}
    >
      Add local repository
    </Button>
  );
};

export default AddLocalRepositoryButton;
