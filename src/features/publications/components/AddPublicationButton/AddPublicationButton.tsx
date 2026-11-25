import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-ds-global";

const AddPublicationButton = () => {
  const { createPageParamsSetter } = usePageParams();

  return (
    <Button
      type="button"
      importance="primary"
      anticipation="constructive"
      icon="plus"
      onClick={createPageParamsSetter({ sidePath: ["add"], name: "" })}
    >
      Add publication
    </Button>
  );
};

export default AddPublicationButton;
