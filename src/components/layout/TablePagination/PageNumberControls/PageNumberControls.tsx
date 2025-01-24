import { Button, Icon } from "@canonical/react-components";
import PageNumberInputWithError from "../PageNumberInputWithError";
import classes from "./PageNumberControls.module.scss";

const PageNumberControls = ({
  currentPage,
  max,
  min = 1,
  setCurrentPage,
}: {
  currentPage: number;
  max: number;
  min?: number;
  setCurrentPage: (page: number) => void;
}) => {
  return (
    <>
      <Button
        aria-label="Previous page"
        appearance="link"
        className="p-pagination__link--previous u-no-margin--right u-no-margin--bottom u-no-padding--top"
        disabled={currentPage <= min}
        onClick={() => setCurrentPage(currentPage - 1)}
        type="button"
      >
        <Icon name="chevron-down" className={classes.icon} />
      </Button>

      <strong>Page </strong>

      <PageNumberInputWithError
        currentPage={currentPage}
        max={max}
        min={min}
        setCurrentPage={setCurrentPage}
      />

      <strong className={classes.noWrap}>of {Math.max(max, 1)}</strong>

      <Button
        aria-label="Next page"
        appearance="link"
        className="p-pagination__link--next u-no-margin--bottom u-no-padding--top"
        disabled={currentPage >= max}
        onClick={() => setCurrentPage(currentPage + 1)}
        type="button"
      >
        <Icon name="chevron-down" className={classes.icon} />
      </Button>
    </>
  );
};

export default PageNumberControls;
