import { Button, Icon } from "@canonical/react-components";

const AddPublicationButton = () => {
  return (
    <Button appearance="positive" hasIcon type="button">
      <Icon name="upload" />
      <span>Add publication</span>
    </Button>
  );
};

export default AddPublicationButton;
