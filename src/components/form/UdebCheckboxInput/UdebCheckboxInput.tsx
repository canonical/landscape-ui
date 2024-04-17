import { FormikContextType } from "formik";
import { CheckboxInput, Icon, Tooltip } from "@canonical/react-components";
import { UDEB_TOOLTIP } from "./constants";
import classes from "./UdebCheckboxInput.module.scss";

interface UdebCheckboxInputProps<T extends { include_udeb: boolean }> {
  formik: FormikContextType<T>;
}

const UdebCheckboxInput = <T extends { include_udeb: boolean }>({
  formik,
}: UdebCheckboxInputProps<T>) => {
  return (
    <CheckboxInput
      label={
        <>
          <span>Include .udeb packages </span>
          <Tooltip
            message={UDEB_TOOLTIP}
            positionElementClassName={classes.tooltipPositionElement}
          >
            <Icon name="help" aria-hidden />
            <span className="u-off-screen">Help</span>
          </Tooltip>
        </>
      }
      {...formik.getFieldProps("include_udeb")}
      checked={formik.values.include_udeb}
    />
  );
};

export default UdebCheckboxInput;
