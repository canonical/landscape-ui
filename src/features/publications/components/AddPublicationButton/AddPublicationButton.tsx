import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";

const AddPublicationButton = () => {
  const { createPageParamsSetter } = usePageParams();

  return (
    <Button
      appearance="positive"
      hasIcon
      type="button"
      onClick={createPageParamsSetter({ sidePath: ["add"] })}
    >
      <Icon name="plus" light />
      <span>Add publication</span>
    </Button>
  );
};

export default AddPublicationButton;
