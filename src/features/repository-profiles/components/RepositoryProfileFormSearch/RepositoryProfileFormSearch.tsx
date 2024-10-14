import { FC, useEffect, useRef, useState } from "react";
import { Button, Icon, ICONS, Input } from "@canonical/react-components";

interface RepositoryProfileFormSearchProps {
  label: string;
  onSearchChange: (searchText: string) => void;
}

const RepositoryProfileFormSearch: FC<RepositoryProfileFormSearchProps> = ({
  label,
  onSearchChange,
}) => {
  const [inputText, setInputText] = useState("");
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    setInput(containerRef.current.querySelector("input"));
  }, [containerRef.current]);

  return (
    <div className="p-search-box" ref={containerRef}>
      <label className="u-off-screen" htmlFor={input?.id}>
        {label}
      </label>
      <Input
        type="search"
        autoComplete="off"
        className="p-search-box__input"
        name="search"
        placeholder="Search"
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSearchChange(inputText);
          }
        }}
      />
      {inputText && (
        <Button
          type="reset"
          className="p-search-box__reset"
          onClick={() => {
            onSearchChange("");
            setInputText("");
            input?.focus();
          }}
          aria-label="Reset search"
        >
          <Icon name={ICONS.close} />
        </Button>
      )}
      <Button
        type="button"
        className="p-search-box__button"
        onClick={() => onSearchChange(inputText)}
        aria-label={label}
      >
        <Icon name={ICONS.search} />
      </Button>
    </div>
  );
};

export default RepositoryProfileFormSearch;
