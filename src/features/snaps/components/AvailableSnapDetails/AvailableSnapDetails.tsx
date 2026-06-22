import LoadingState from "@/components/layout/LoadingState";
import { Button, Form, Icon, ICONS, Select } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { useGetSnapInfo } from "../../api";
import type { SelectedSnaps } from "../../types";
import classes from "./AvailableSnapDetails.module.scss";

interface AvailableSnapDetailsProps {
  readonly name: string;
  readonly handleDeleteToBeConfirmedItem: () => void;
  readonly handleAddToSelectedItems: (item: SelectedSnaps) => void;
  readonly instanceId: number;
}

const AvailableSnapDetails: FC<AvailableSnapDetailsProps> = ({
  name,
  handleDeleteToBeConfirmedItem,
  handleAddToSelectedItems,
  instanceId,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const { snapInfo: item, isSnapInfoLoading: isLoading } = useGetSnapInfo({
    instance_id: instanceId,
    name: name,
  });

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

  const effectiveChannel = selectedChannel ?? CHANNEL_OPTIONS[0]?.value ?? "";

  return (
    <li
      className={classNames(
        "p-autocomplete__result p-list__item p-card u-no-margin--bottom u-no-padding--bottom",
        classes.toBeConfirmedCard,
      )}
    >
      {isLoading && <LoadingState />}
      {item && (
        <Form
          name="add-snap"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddToSelectedItems({
              "snap-id": item["snap-id"],
              name: item.name,
              snap: item.snap,
              revision:
                item["channel-map"]
                  .find(
                    (channel) =>
                      `${channel.channel.name} - ${channel.channel.architecture}` ===
                      effectiveChannel,
                  )
                  ?.revision.toString() ?? "Unknown revision",
              channel:
                item["channel-map"].find(
                  (channel) =>
                    `${channel.channel.name} - ${channel.channel.architecture}` ===
                    effectiveChannel,
                )?.channel.name ?? "Unknown channel",
            });
          }}
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
            value={effectiveChannel}
            options={CHANNEL_OPTIONS}
            onChange={(event) => {
              handleSelectChannel(event.currentTarget.value);
            }}
            help={
              item["channel-map"].find(
                (channel) =>
                  `${channel.channel.name} - ${channel.channel.architecture}` ===
                  effectiveChannel,
              )?.confinement === "classic" ? (
                <span>
                  <Icon name={ICONS.warning} />
                  This release requires classic permission.{" "}
                  <a
                    href="https://snapcraft.io/docs"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    Learn more
                  </a>
                </span>
              ) : undefined
            }
          />
          <div className={classes.toBeConfirmedCard__buttons}>
            <Button
              small
              type="button"
              appearance="base"
              onClick={() => {
                handleDeleteToBeConfirmedItem();
              }}
            >
              Cancel
            </Button>
            <Button
              small
              className={classes.toBeConfirmedCard__confirmButton}
              type="submit"
              appearance="positive"
            >
              Add
            </Button>
          </div>
        </Form>
      )}
    </li>
  );
};

export default AvailableSnapDetails;
