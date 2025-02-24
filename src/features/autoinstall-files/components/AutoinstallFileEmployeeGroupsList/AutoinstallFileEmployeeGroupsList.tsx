import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import classes from "./AutoinstallFileEmployeeGroupsList.module.scss";

interface AutoinstallFileEmployeeGroupsListProps {
  readonly groupNames: readonly string[];
}

const AutoinstallFileEmployeeGroupsList: FC<
  AutoinstallFileEmployeeGroupsListProps
> = ({ groupNames }) => {
  const [hiddenGroupCount, setHiddenGroupCount] = useState<number | undefined>(
    undefined,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const divElementBoundingClientRect =
      containerRef.current.getBoundingClientRect();

    setHiddenGroupCount(
      [...containerRef.current.children].filter((element) => {
        return (
          element.getBoundingClientRect().right >
          divElementBoundingClientRect.right
        );
      }).length,
    );
  }, []);

  const [firstGroupName, ...lastGroupNames] = groupNames;

  return (
    <div className={classes.container}>
      <div className={classes.truncated} ref={containerRef}>
        <span>{firstGroupName}</span>

        {lastGroupNames.map((groupName, key) => {
          return <span key={key}>, {groupName}</span>;
        })}
      </div>

      {hiddenGroupCount ? (
        <span className="u-text--muted">+{hiddenGroupCount}</span>
      ) : null}
    </div>
  );
};

export default AutoinstallFileEmployeeGroupsList;
