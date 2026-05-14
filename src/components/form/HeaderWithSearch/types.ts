import type { ReactNode } from "react";
import type { SearchBoxProps } from "@canonical/react-components";

interface BaseHeaderWithSearchProps extends Omit<
  SearchBoxProps,
  | "onSearch"
  | "externallyControlled"
  | "shouldRefocusAfterReset"
  | "value"
  | "onClear"
  | "onChange"
  | "ref"
> {
  actions?: ReactNode;
}

interface HeaderWithSearchPropsWithOnSearch extends BaseHeaderWithSearchProps {
  onSearch: (searchText: string) => void;
  searchText: string;
  afterSearch?: never;
}

interface HeaderWithSearchPropsWithAfterSearch extends BaseHeaderWithSearchProps {
  afterSearch: () => void;
  searchText?: never;
  onSearch?: never;
}

interface HeaderWithSearchPropsWithoutHandlers extends BaseHeaderWithSearchProps {
  onSearch?: never;
  searchText?: never;
  afterSearch?: never;
}

export type HeaderWithSearchProps =
  | HeaderWithSearchPropsWithOnSearch
  | HeaderWithSearchPropsWithAfterSearch
  | HeaderWithSearchPropsWithoutHandlers;

export interface FormProps {
  inputText: string;
}
