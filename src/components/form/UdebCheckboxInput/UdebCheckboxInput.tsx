import type { FormikContextType } from "formik";
import { UDEB_TOOLTIP } from "./constants";
import CheckboxInputWithHelp from "../CheckboxInputWithHelp";

interface UdebCheckboxInputProps<T extends { include_udeb: boolean }> {
  readonly formik: FormikContextType<T>;
}

const UdebCheckboxInput = <T extends { include_udeb: boolean }>({
  formik,
}: UdebCheckboxInputProps<T>) => {
  return (
    <CheckboxInputWithHelp
      label="Include .udeb packages"
      tooltipMessage={UDEB_TOOLTIP}
      {...formik.getFieldProps("include_udeb")}
      checked={formik.values.include_udeb}
    />
  );
};

export default UdebCheckboxInput;
