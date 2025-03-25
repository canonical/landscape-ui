import {
  Button,
  Icon,
  ICONS,
  MainTable,
  Modal,
  Switch,
} from "@canonical/react-components";
import type { FormikContextType } from "formik";
import { useState } from "react";
import type { ScheduleBlockFormProps } from "../../types";
import RecurringScheduleBlockBase from "../RecurringScheduleBlockBase";
import classes from "./RecurringScheduleBlock.module.scss";

interface RecurringScheduleBlock<T extends ScheduleBlockFormProps> {
  readonly currentDate: string;
  readonly formik: FormikContextType<T>;
}

const RecurringScheduleBlock = <T extends ScheduleBlockFormProps>({
  currentDate,
  formik,
}: RecurringScheduleBlock<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Switch
        label={
          <>
            Use Cron job format
            <Button
              type="button"
              appearance="base"
              className="u-no-margin--bottom"
              hasIcon
              onClick={openModal}
            >
              <Icon name={ICONS.help} />
            </Button>
          </>
        }
        {...formik.getFieldProps("is_cron")}
        required
      />

      <RecurringScheduleBlockBase currentDate={currentDate} formik={formik} />

      {isModalOpen && (
        <Modal title="Cron job format" close={closeModal}>
          <p className="p-text--small-caps">Example</p>

          <div className={classes.example}>
            <div>
              <p className="p-heading--1 u-no-padding--top u-no-margin--bottom">
                1
              </p>

              <p className="p-text-small u-text--muted u-no-margin--bottom">
                Minute
              </p>
            </div>

            <div>
              <p className="p-heading--1 u-no-padding--top u-no-margin--bottom">
                *
              </p>

              <p className="p-text-small u-text--muted u-no-margin--bottom">
                Hour
              </p>
            </div>

            <div>
              <p className="p-heading--1 u-no-padding--top u-no-margin--bottom">
                2
              </p>

              <p className="p-text-small u-text--muted u-no-margin--bottom">
                Day
                <br />
                (month)
              </p>
            </div>

            <div>
              <p className="p-heading--1 u-no-padding--top u-no-margin--bottom">
                1-3
              </p>

              <p className="p-text-small u-text--muted u-no-margin--bottom">
                Month
              </p>
            </div>

            <div>
              <p className="p-heading--1 u-no-padding--top u-no-margin--bottom">
                *
              </p>

              <p className="p-text-small u-text--muted u-no-margin--bottom">
                Day
                <br />
                (week)
              </p>
            </div>
          </div>

          <p>
            At minute 1 on day-of-month 2 in every month from January through
            March.
          </p>

          <p className="p-text--small-caps">Accepted values</p>

          <MainTable
            rows={[
              {
                columns: [
                  {
                    content: "* (asterisk)",
                    role: "rowheader",
                  },
                  {
                    content: "Any value",
                  },
                ],
              },
              {
                columns: [
                  {
                    content: ", (comma)",
                    role: "rowheader",
                  },
                  {
                    content: "List separator",
                  },
                ],
              },
              {
                columns: [
                  {
                    content: "- (dash)",
                    role: "rowheader",
                  },
                  {
                    content: "Range",
                  },
                ],
              },
              {
                columns: [
                  {
                    content: "/ (slash)",
                    role: "rowheader",
                  },
                  {
                    content: "Step values",
                  },
                ],
              },
            ]}
          />

          <MainTable
            rows={[
              {
                columns: [
                  {
                    content: "Minute",
                    role: "rowheader",
                  },
                  {
                    content: "0-59",
                  },
                ],
              },
              {
                columns: [
                  {
                    content: "Hour",
                    role: "rowheader",
                  },
                  {
                    content: "0-23",
                  },
                ],
              },
              {
                columns: [
                  {
                    content: "Day of the month",
                    role: "rowheader",
                  },
                  {
                    content: "1-31",
                  },
                ],
              },
              {
                columns: [
                  {
                    content: "Month",
                    role: "rowheader",
                  },
                  {
                    content: "1-12 or JAN-DEC",
                  },
                ],
              },
              {
                columns: [
                  {
                    content: "Day of the week",
                    role: "rowheader",
                  },
                  {
                    content: "0-6 or SUN-SAT",
                  },
                ],
              },
            ]}
          />
        </Modal>
      )}
    </>
  );
};

export default RecurringScheduleBlock;
