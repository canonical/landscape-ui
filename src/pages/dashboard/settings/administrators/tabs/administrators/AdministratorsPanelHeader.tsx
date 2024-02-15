import { FC, useState } from "react";
import { Col, Form, Row, SearchBox } from "@canonical/react-components";

interface AdministratorsPanelHeaderProps {
  onClear: () => void;
  onSearch: (inputText: string) => void;
}

const AdministratorsPanelHeader: FC<AdministratorsPanelHeaderProps> = ({
  onClear,
  onSearch,
}) => {
  const [inputText, setInputText] = useState("");

  return (
    <Row className="u-no-padding--left u-no-padding--right u-no-margin--left u-no-margin--right">
      <Col size={6}>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(inputText);
          }}
          noValidate
        >
          <SearchBox
            externallyControlled
            shouldRefocusAfterReset
            value={inputText}
            onChange={(inputValue) => setInputText(inputValue)}
            onSearch={() => onSearch(inputText)}
            onClear={() => {
              setInputText("");
              onClear();
            }}
            autocomplete="off"
          />
        </Form>
      </Col>
    </Row>
  );
};

export default AdministratorsPanelHeader;
