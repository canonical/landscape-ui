import { FC, useState } from "react";
import { Col, Form, Row, SearchBox } from "@canonical/react-components";

interface PackageProfilesHeaderProps {
  onSearch: (searchText: string) => void;
}

const PackageProfilesHeader: FC<PackageProfilesHeaderProps> = ({
  onSearch,
}) => {
  const [inputText, setInputText] = useState("");

  return (
    <Row className="u-no-margin--left u-no-padding--left u-no-padding--right">
      <Col size={4}>
        <Form
          className="u-no-margin--bottom"
          onSubmit={(event) => {
            event.preventDefault();

            onSearch(inputText.trim());
          }}
        >
          <SearchBox
            externallyControlled
            shouldRefocusAfterReset
            autoComplete="off"
            onSearch={() => onSearch(inputText.trim())}
            value={inputText}
            onChange={(inputValue) => setInputText(inputValue)}
            onClear={() => {
              setInputText("");
              onSearch("");
            }}
          />
        </Form>
      </Col>
    </Row>
  );
};

export default PackageProfilesHeader;
