import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import classes from "./AutoinstallFileEmployeeGroupsList.module.scss";

interface AutoinstallFileEmployeeGroupsListProps {
  readonly groups: string[];
}

const AutoinstallFileEmployeeGroupsList: FC<
  AutoinstallFileEmployeeGroupsListProps
> = ({ groups }) => {
  const [hiddenGroupCount, setHiddenGroupCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
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
    }
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.truncated} ref={containerRef}>
        {groups.map((group, key) => {
          return (
            <span key={key}>
              {group}
              {key < groups.length - 1 && ", "}
            </span>
          );
        })}
      </div>
      <span className="u-text--muted">
        {hiddenGroupCount > 0 && `+${hiddenGroupCount}`}
      </span>
    </div>
  );
};

export default AutoinstallFileEmployeeGroupsList;
