import type { FC, SyntheticEvent } from "react";
import { useState } from "react";
import { Col, Form, Row, SearchBox } from "@canonical/react-components";
import usePageParams from "@/hooks/usePageParams";

const AdministratorsPanelHeader: FC = () => {
  const { search, setPageParams } = usePageParams();

  const [inputText, setInputText] = useState(search);

  const handleSearch = () => {
    setPageParams({
      search: inputText,
    });
  };

  const handleClear = () => {
    setPageParams({
      search: "",
    });
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <Row className="u-no-padding--left u-no-padding--right u-no-margin--left u-no-margin--right">
      <Col size={6}>
        <Form onSubmit={handleSubmit} noValidate>
          <SearchBox
            externallyControlled
            shouldRefocusAfterReset
            value={inputText}
            onChange={(inputValue) => setInputText(inputValue)}
            onSearch={handleSearch}
            onClear={handleClear}
            autocomplete="off"
          />
        </Form>
      </Col>
    </Row>
  );
};

export default AdministratorsPanelHeader;
