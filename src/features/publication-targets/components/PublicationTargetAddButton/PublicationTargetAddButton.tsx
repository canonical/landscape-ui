import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-ds-global";
import type { FC } from "react";

const PublicationTargetAddButton: FC = () => {
  const { createPageParamsSetter } = usePageParams();

  const handleAdd = createPageParamsSetter({ sidePath: ["add"], name: "" });

  return (
    <Button
      type="button"
      importance="primary"
      anticipation="constructive"
      icon="plus"
      onClick={handleAdd}
      name="Add publication target"
    >
      Add publication target
    </Button>
  );
};

export default PublicationTargetAddButton;
