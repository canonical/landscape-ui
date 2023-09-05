import { FC, ReactNode } from "react";
import classes from "./PageHeader.module.scss";
import classNames from "classnames";
import { SearchAndFilter } from "@canonical/react-components";
import {
  SearchAndFilterChip,
  SearchAndFilterData,
} from "@canonical/react-components/dist/components/SearchAndFilter/types";

type TitleVisibilityProps =
  | {
      hideTitle?: false;
    }
  | {
      hideTitle: true;
      visualTitle: string;
    };

type PageHeaderProps = TitleVisibilityProps & {
  title: string;
  actions?: ReactNode[];
  search?: {
    filterPanelData: SearchAndFilterData[];
    returnSearchData: (searchData: SearchAndFilterChip[]) => void;
  };
  className?: string;
};

const PageHeader: FC<PageHeaderProps> = (props) => {
  return (
    <>
      <div className={classNames("p-panel__header", props.className)}>
        {props.hideTitle ? (
          <>
            <h1 className="u-off-screen">{props.title}</h1>
            <h2 className={classNames("p-panel__title", classes.visualTitle)}>
              {props.visualTitle}
            </h2>
          </>
        ) : (
          <h1 className="p-panel__title">{props.title}</h1>
        )}
        {props.search && (
          <div className={classes.search}>
            <SearchAndFilter
              filterPanelData={props.search.filterPanelData}
              returnSearchData={props.search.returnSearchData}
            />
          </div>
        )}
        {props.actions && props.actions.length > 0 && (
          <div className={classNames("p-panel__controls", classes.controls)}>
            {props.actions}
          </div>
        )}
      </div>
    </>
  );
};

export default PageHeader;
