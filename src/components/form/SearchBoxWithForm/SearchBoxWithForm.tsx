import type { FC } from "react";
import { useState } from "react";
import { Form, SearchBox } from "@canonical/react-components";

interface SearchBoxWithFormProps {
  readonly onSearch: (search: string) => void;
}

const SearchBoxWithForm: FC<SearchBoxWithFormProps> = ({ onSearch }) => {
  const [input, setInput] = useState("");

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(input);
      }}
    >
      <SearchBox
        externallyControlled
        shouldRefocusAfterReset
        autoComplete="off"
        value={input}
        onChange={(inputValue) => setInput(inputValue)}
        onSearch={() => onSearch(input)}
        onClear={() => {
          setInput("");
          onSearch("");
        }}
      />
    </Form>
  );
};

export default SearchBoxWithForm;
