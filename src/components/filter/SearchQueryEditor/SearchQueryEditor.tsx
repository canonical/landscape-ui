import type { FC } from "react";
import type { Monaco } from "@monaco-editor/react";
import { useCallback } from "react";
import CodeEditor from "@/components/form/CodeEditor";

interface SearchQueryEditorProps {
  readonly label: string;
  readonly value: string | undefined;
  readonly onChange?: (value: string | undefined) => void;
  readonly onBlur?: () => void;
  readonly error?: string | false;
  readonly required?: boolean;
  readonly className?: string;
  readonly labelClassName?: string;
  readonly headerContent?: React.ReactNode;
  readonly options?: React.ComponentProps<typeof CodeEditor>["options"];
  readonly languageId: string;
  readonly terms: string[];
  readonly configureSearchLanguage: (
    monaco: Monaco,
    languageId: string,
    terms: string[],
  ) => void;
}

const SearchQueryEditor: FC<SearchQueryEditorProps> = ({
  label,
  value,
  onChange,
  onBlur,
  error = false,
  required = false,
  className,
  labelClassName,
  headerContent,
  options,
  languageId,
  terms,
  configureSearchLanguage,
}) => {
  const monacoBeforeMount = useCallback(
    (monaco: Monaco) => {
      if (terms.length > 0) {
        configureSearchLanguage(monaco, languageId, terms);
      }
    },
    [languageId, terms, configureSearchLanguage],
  );

  return (
    <CodeEditor
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      required={required}
      className={className}
      labelClassName={labelClassName}
      headerContent={headerContent}
      language={languageId}
      monacoBeforeMount={monacoBeforeMount}
      options={{
        fixedOverflowWidgets: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        ...options,
      }}
    />
  );
};

export default SearchQueryEditor;
