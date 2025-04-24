import {
  Button,
  Icon,
  ICONS,
  MainTable,
  Modal,
} from "@canonical/react-components";
import { useState, type FC } from "react";
import CronExamplePart from "../CronExamplePart";
import classes from "./CronHelp.module.scss";

const CronHelp: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        appearance="base"
        className="u-no-margin--bottom"
        hasIcon
        onClick={openModal}
      >
        <Icon name={ICONS.help} />
      </Button>

      {isModalOpen && (
        <Modal title="Cron job format" close={closeModal}>
          <section>
            <h1 className="p-text--small-caps">Example</h1>

            <div className={classes.example}>
              <CronExamplePart label="Minute" value="1" />

              <CronExamplePart label="Hour" value="*" />

              <CronExamplePart
                label={
                  <>
                    Day
                    <br />
                    (month)
                  </>
                }
                value="2"
              />

              <CronExamplePart label="Month" value="1-3" />

              <CronExamplePart
                label={
                  <>
                    Day
                    <br />
                    (week)
                  </>
                }
                value="*"
              />
            </div>

            <p>
              &quot;At minute 1 on day-of-month 2 in every month from January
              through March&quot;
            </p>
          </section>

          <section>
            <h1 className="p-text--small-caps">Accepted values</h1>

            <MainTable
              className={classes.table}
              rows={[
                {
                  columns: [
                    {
                      content: "* (asterisk)",
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
                    },
                    {
                      content: "Step values",
                    },
                  ],
                },
              ]}
            />

            <MainTable
              className={classes.table}
              rows={[
                {
                  columns: [
                    {
                      content: "Minute",
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
                    },
                    {
                      content: "0-6 or SUN-SAT",
                    },
                  ],
                },
              ]}
            />
          </section>
        </Modal>
      )}
    </>
  );
};

export default CronHelp;
