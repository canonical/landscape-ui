import { FC, useState } from "react";
import { Col, Form, Row, SearchBox } from "@canonical/react-components";

interface UpgradeProfilesHeaderProps {
  onSearch: (searchText: string) => void;
}

const UpgradeProfilesHeader: FC<UpgradeProfilesHeaderProps> = ({
  onSearch,
}) => {
  const [inputText, setInputText] = useState("");

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(inputText);
      }}
    >
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={4}>
          <SearchBox
            externallyControlled
            shouldRefocusAfterReset
            autoComplete="off"
            value={inputText}
            onChange={(inputValue) => setInputText(inputValue)}
            onClear={() => {
              setInputText("");
              onSearch("");
            }}
            onSearch={() => onSearch(inputText)}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default UpgradeProfilesHeader;
