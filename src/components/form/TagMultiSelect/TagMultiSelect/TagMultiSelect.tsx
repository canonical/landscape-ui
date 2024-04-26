import classNames from "classnames";
import {
  ChangeEvent,
  CSSProperties,
  FC,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOnClickOutside, useWindowSize } from "usehooks-ts";
import { Input } from "@canonical/react-components";
import InfoBox from "@/components/form/TagMultiSelect/InfoBox";
import TagChips from "@/components/form/TagMultiSelect/TagChips";
import TagList from "@/components/form/TagMultiSelect/TagList";
import TagPrompt from "@/components/form/TagMultiSelect/TagPrompt";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import { validationSchema } from "./constants";
import classes from "./TagMultiSelect.module.scss";

interface TagMultiSelectProps {
  onTagsChange: (value: string[]) => void;
  tags: string[];
  label?: string;
  labelClassName?: string;
  required?: boolean;
}

const TagMultiSelect: FC<TagMultiSelectProps> = ({
  onTagsChange,
  tags,
  label,
  labelClassName,
  required,
}) => {
  const [inputText, setInputText] = useState("");
  const [inputError, setInputError] = useState("");
  const [validateInputOnChange, setValidateInputOnChange] = useState(false);
  const [inputId, setInputId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [overflowingChipsAmount, setOverflowingChipsAmount] = useState(0);
  const { height: windowHeight } = useWindowSize();
  const [dropdownStyles, setDropdownStyles] = useState<CSSProperties>({
    top: "100%",
    bottom: "auto",
  });

  const debug = useDebug();
  const { getAllInstanceTagsQuery } = useInstances();

  const clickContainerRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chipsContainerRef.current) {
      return;
    }

    const input = chipsContainerRef.current.querySelector("input");

    if (!input) {
      return;
    }

    setInputId(input.id);
  }, [chipsContainerRef.current]);

  useEffect(() => {
    if (!showDropdown || !chipsContainerRef.current) {
      return;
    }

    handleDropdownPosition();
  }, [
    windowHeight,
    showDropdown,
    chipsContainerRef.current,
    chipsContainerRef.current?.clientHeight,
  ]);

  const handleDropdownPosition = () => {
    if (!chipsContainerRef.current) {
      return;
    }

    const { top, height } = chipsContainerRef.current.getBoundingClientRect();
    const dropdownHeight = 379;

    if (top + height + dropdownHeight < windowHeight) {
      setDropdownStyles({
        top: "100%",
        bottom: "auto",
      });
    } else {
      setDropdownStyles({
        top: "auto",
        bottom: "100%",
      });
    }
  };

  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  useOnClickOutside(clickContainerRef, handleDropdownClose);

  const handleChipDismiss = (chipValue: string) => {
    onTagsChange(tags.filter((tag) => tag !== chipValue));
  };

  const {
    data: getAllInstanceTagsQueryResult,
    error: getAllInstanceTagsQueryError,
    isLoading: getAllInstanceTagsQueryLoading,
  } = getAllInstanceTagsQuery();

  if (getAllInstanceTagsQueryError) {
    debug(getAllInstanceTagsQueryError);
  }

  const filteredTags = useMemo(() => {
    if (!getAllInstanceTagsQueryResult) {
      return [];
    }

    if (!inputText && !tags.length) {
      return getAllInstanceTagsQueryResult.data.results;
    }

    return getAllInstanceTagsQueryResult.data.results
      .filter((tag) => !tags.includes(tag))
      .filter((tag) =>
        tag.toLowerCase().includes(inputText.trim().toLowerCase()),
      );
  }, [getAllInstanceTagsQueryResult, inputText, tags]);

  const handleTagAdd = (tag: string) => {
    onTagsChange([...tags, tag]);
  };

  const handleTagCreate = () => {
    if (!inputText.trim()) {
      return;
    }

    try {
      const validValue = validationSchema.validateSync(inputText.trim()) ?? "";

      handleTagAdd(validValue);
      setInputText("");
      setInputError("");
      setValidateInputOnChange(false);
    } catch (error) {
      if (error instanceof Error) {
        setInputError(error.message);
        setValidateInputOnChange(true);
      }
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);

    if (validateInputOnChange) {
      try {
        validationSchema.validateSync(event.target.value);
        setInputError("");
      } catch (error) {
        if (error instanceof Error) {
          setInputError(error.message);
        }
      }
    }
  };

  const handleKeysOnSearchBox = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (showDropdown) {
      if (key === "Escape") {
        handleDropdownClose();
      }

      if (key === "Enter") {
        handleTagCreate();
      }
    } else {
      if (key === "Enter") {
        setShowDropdown(true);
      }
    }
  };

  return (
    <div>
      <label
        className={classNames(
          "p-form__label",
          { "is-required": required },
          labelClassName,
        )}
        htmlFor={inputId}
      >
        {label || "Tags"}
      </label>
      <div className="p-search-and-filter" ref={clickContainerRef}>
        <div
          className={classNames(
            "p-search-and-filter__search-container",
            classes.searchContainer,
          )}
          aria-expanded={showDropdown}
          ref={chipsContainerRef}
          onClick={() => setShowDropdown(true)}
        >
          <TagChips
            containerRef={chipsContainerRef}
            onDismiss={handleChipDismiss}
            onOverflowingItemsAmountChange={(amount) =>
              setOverflowingChipsAmount(amount)
            }
            tagData={tags}
          />
          <div className={classNames("p-search-and-filter__box", classes.box)}>
            <div className={classes.inputContainer}>
              <Input
                type="text"
                autoComplete="off"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Add tags"
                className="u-no-margin--bottom"
                onClick={() => setShowDropdown(true)}
                onKeyUp={handleKeysOnSearchBox}
                wrapperClassName={inputError ? "is-error" : ""}
                aria-errormessage={inputError ? `${inputId}-error` : undefined}
                aria-invalid={!!inputError}
              />
            </div>
          </div>
          {inputError && (
            <div className="is-error">
              <p
                className={classNames(
                  "p-form-validation__message",
                  classes.inputError,
                )}
                id={`${inputId}-error`}
              >
                <strong>Error: </strong>
                <span>{inputError}</span>
              </p>
            </div>
          )}
          <InfoBox
            isExpanded={showDropdown}
            overflowingChipsAmount={overflowingChipsAmount}
          />
        </div>
        {showDropdown && getAllInstanceTagsQueryLoading && <LoadingState />}
        {showDropdown && !getAllInstanceTagsQueryLoading && (
          <div className="p-search-and-filter__panel" style={dropdownStyles}>
            <TagPrompt onTagAdd={handleTagCreate} search={inputText} />

            <TagList onTagClick={handleTagAdd} tags={filteredTags} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TagMultiSelect;
