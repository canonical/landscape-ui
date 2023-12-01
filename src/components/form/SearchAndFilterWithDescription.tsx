import { FC } from "react";
import {
  SearchAndFilterChip,
  SearchAndFilterData,
} from "@canonical/react-components/dist/components/SearchAndFilter/types";
import { SearchAndFilter } from "@canonical/react-components";
import classes from "./SearchAndFilterWithDescription.module.scss";
import classNames from "classnames";

interface SearchAndFilterWithDescriptionProps {
  filterPanelData: SearchAndFilterData[];
  returnSearchData: (searchData: SearchAndFilterChip[]) => void;
  onClick: () => void;
  existingSearchData?: SearchAndFilterChip[];
}

const SearchAndFilterWithDescription: FC<
  SearchAndFilterWithDescriptionProps
> = ({ filterPanelData, returnSearchData, onClick, existingSearchData }) => {
  return (
    <div>
      <div className={classNames(classes.wrapper)}>
        <div className={classes.search}>
          <SearchAndFilter
            existingSearchData={existingSearchData}
            filterPanelData={filterPanelData}
            returnSearchData={returnSearchData}
          />
        </div>
        <div className={classes.buttonContainer}>
          <button onClick={onClick} className={classNames(classes.button)}>
            <i className={classNames("p-icon--help", classes.icon)} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilterWithDescription;
