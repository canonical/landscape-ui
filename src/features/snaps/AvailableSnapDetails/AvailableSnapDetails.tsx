import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import { useSnaps } from "@/hooks/useSnaps";
import { SelectedSnaps } from "@/types/Snap";
import { Button, Form, Select } from "@canonical/react-components";
import classNames from "classnames";
import { FC, useEffect, useMemo, useState } from "react";
import classes from "./AvailableSnapDetails.module.scss";

interface AvailableSnapDetailsProps {
  name: string;
  handleDeleteToBeConfirmedItem: () => void;
  handleAddToSelectedItems: (item: SelectedSnaps) => void;
  instanceId: number;
}

const AvailableSnapDetails: FC<AvailableSnapDetailsProps> = ({
  name,
  handleDeleteToBeConfirmedItem,
  handleAddToSelectedItems,
  instanceId,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string>("");

  const { getAvailableSnapInfo } = useSnaps();
  const debug = useDebug();
  const {
    data: availableSnapInfo,
    isLoading,
    error,
  } = getAvailableSnapInfo({
    instance_id: instanceId,
    name: name,
  });

  if (error) {
    debug(error);
  }

  const item = availableSnapInfo?.data;

  const CHANNEL_OPTIONS = useMemo(() => {
    return item
      ? item["channel-map"]
          .sort((a, b) =>
            a.channel.architecture.localeCompare(b.channel.architecture),
          )
          .map((channel) => ({
            label: `${channel.channel.name} - ${channel.channel.architecture}`,
            value: `${channel.channel.name} - ${channel.channel.architecture}`,
          }))
      : [];
  }, [item]);

  const handleSelectChannel = (channel: string) => {
    setSelectedChannel(channel);
  };

  useEffect(() => {
    if (CHANNEL_OPTIONS.length > 0) {
      setSelectedChannel(CHANNEL_OPTIONS[0].value);
    }
  }, [CHANNEL_OPTIONS]);

  return (
    <>
      {isLoading && <LoadingState />}
      {item && (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddToSelectedItems({
              "snap-id": item["snap-id"],
              name: item.name,
              snap: item.snap,
              revision: item["channel-map"]
                .find(
                  (channel) =>
                    `${channel.channel.name} - ${channel.channel.architecture}` ===
                    selectedChannel,
                )!
                .revision.toString(),
              channel: item["channel-map"].find(
                (channel) =>
                  `${channel.channel.name} - ${channel.channel.architecture}` ===
                  selectedChannel,
              )!.channel.name,
            });
          }}
        >
          <li
            className={classNames(
              "p-autocomplete__result p-list__item p-card u-no-margin--bottom u-no-padding--bottom",
              classes.toBeConfirmedCard,
            )}
          >
            <div className={classes.bold}>{item.name}</div>
            <span>
              <small className="u-text--muted p-text--small">
                {item.snap.publisher["display-name"]}
              </small>
            </span>
            <Select
              label={
                <span className="u-text--muted p-text--small">Release</span>
              }
              required
              value={selectedChannel}
              options={CHANNEL_OPTIONS}
              onChange={(event) =>
                handleSelectChannel(event.currentTarget.value)
              }
              help={
                item["channel-map"].find(
                  (channel) => channel.revision.toString() === selectedChannel,
                )?.confinement === "classic" ? (
                  <span>
                    <i className="p-icon--warning" />
                    This release requires classic permission.{" "}
                    <a
                      href="https://snapcraft.io/docs"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learn more
                      <i className="p-icon--external-link" />
                    </a>
                  </span>
                ) : undefined
              }
            />
            <div className={classes.toBeConfirmedCard__buttons}>
              <Button
                small
                className={classes.toBeConfirmedCard__confirmButton}
                type="submit"
                appearance="positive"
              >
                Add
              </Button>
              <Button
                small
                type="button"
                appearance="base"
                onClick={() => handleDeleteToBeConfirmedItem()}
              >
                Cancel
              </Button>
            </div>
          </li>
        </Form>
      )}
    </>
  );
};

export default AvailableSnapDetails;
