import { FC, ReactNode } from "react";
import useNotify from "../../hooks/useNotify";
import AppNotification from "./AppNotification";
import useSidePanel from "../../hooks/useSidePanel";
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
};

const PageHeader: FC<PageHeaderProps> = (props) => {
  const notify = useNotify();
  const { isSidePanelOpen } = useSidePanel();

  return (
    <>
      <div className="p-panel__header">
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
      {notify && !isSidePanelOpen && (
        <div className="row">
          <AppNotification notify={notify} />
        </div>
      )}
    </>
  );
};

export default PageHeader;
