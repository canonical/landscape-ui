import classNames from "classnames";
import { FC } from "react";
import { Button } from "@canonical/react-components";
import classes from "./TagList.module.scss";

interface TagListProps {
  onTagClick: (tag: string) => void;
  tags: string[];
}

const TagList: FC<TagListProps> = ({ onTagClick, tags }) => {
  if (!tags.length) {
    return null;
  }

  return (
    <div className={classes.container}>
      <p className="p-text--small-caps u-text--muted p-text--small">Tags</p>
      <ul
        className={classNames(
          "p-list--divided u-no-margin--bottom",
          classes.list,
        )}
      >
        {tags.map((tag) => (
          <li key={tag}>
            <div className={classes.listItem}>
              <Button
                type="button"
                appearance="base"
                className={classes.search}
                onClick={() => onTagClick(tag)}
              >
                {tag}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagList;
