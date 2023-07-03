import { FC } from "react";
import {
  Button,
  Icon,
  ICONS,
  MainTable,
  Spinner,
} from "@canonical/react-components";
import { APTSource } from "../../../../types/APTSource";
import useConfirm from "../../../../hooks/useConfirm";
import useDebug from "../../../../hooks/useDebug";
import useAPTSources from "../../../../hooks/useAPTSources";
import classes from "./APTSourcesList.module.scss";

interface APTSourcesListProps {
  items: APTSource[];
}

const APTSourcesList: FC<APTSourcesListProps> = ({ items }) => {
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { removeAPTSourceQuery } = useAPTSources();
  const debug = useDebug();

  const { mutateAsync: removeAPTSource, isLoading: isRemoving } =
    removeAPTSourceQuery;

  const headers = [
    { content: "Name" },
    { content: "Access group" },
    { content: "Line" },
    {},
  ];

  const rows = items.map((item) => {
    return {
      columns: [
        {
          content: item.name,
          role: "rowheader",
          "aria-label": "Name",
        },
        {
          content: item.access_group,
          "aria-label": "Access group",
        },
        {
          content: item.line,
          "aria-label": "Line",
        },
        {
          className: "u-align--right",
          content: (
            <Button
              small
              hasIcon
              appearance="base"
              className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
              aria-label={`Remove ${item.name} APT source`}
              onClick={() => {
                confirmModal({
                  body: "Are you sure? This action is permanent and can not be undone.",
                  title: "Deleting APT source",
                  buttons: [
                    <Button
                      key={`delete-key-${item.id}`}
                      appearance="negative"
                      hasIcon={true}
                      onClick={async () => {
                        try {
                          await removeAPTSource({ name: item.name });
                          closeConfirmModal();
                        } catch (error: unknown) {
                          debug(error);
                        }
                      }}
                    >
                      {isRemoving && <Spinner />}
                      Delete
                    </Button>,
                  ],
                });
              }}
            >
              <span className="p-tooltip__message">Delete</span>
              <Icon name={ICONS.delete} className="u-no-margin--left" />
            </Button>
          ),
        },
      ],
    };
  });

  return (
    <MainTable
      headers={headers}
      rows={rows}
      emptyStateMsg="No APT sources yet"
      className={classes.content}
    />
  );
};

export default APTSourcesList;
