import Blocks from "@/components/layout/Blocks";
import Chip from "@/components/layout/Chip";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import {
  getFeatures,
  InstanceStatus,
  InstanceTags,
} from "@/features/instances";
import date from "@/libs/date";
import classNames from "classnames";
import type { FC } from "react";
import { Fragment } from "react";
import { useGetStaffAccessGroups } from "../../api";
import type { SupportInstanceTabProps } from "../../types";
import classes from "./SupportInstanceInfo.module.scss";

const formatDate = (value: string | null | undefined): string | null =>
  value && date(value).isValid()
    ? date(value).format(DISPLAY_DATE_TIME_FORMAT)
    : null;

/** The Info tab of an instance in a support session: its details, read-only. */
const SupportInstanceInfo: FC<SupportInstanceTabProps> = ({
  name,
  instance,
}) => {
  const { staffAccessGroups, isGettingStaffAccessGroups } =
    useGetStaffAccessGroups(name);

  if (isGettingStaffAccessGroups) {
    return <LoadingState />;
  }

  const features = getFeatures(instance);
  const hardware = instance.grouped_hardware;

  return (
    <>
      <div className={classes.header}>
        <h2
          className={classNames(
            "p-heading--4 u-no-padding--top",
            classes.heading,
          )}
        >
          {instance.title}
        </h2>
        {instance.is_wsl_instance && <Chip value="WSL instance" />}
      </div>

      <Blocks spaced>
        <Blocks.Item title="Status">
          <InfoGrid>
            <InfoGrid.Item
              label="Status"
              value={<InstanceStatus instance={instance} />}
            />
            <InfoGrid.Item
              label="Last ping time"
              value={formatDate(instance.last_ping_time)}
            />
            <InfoGrid.Item
              label="Access group"
              value={
                staffAccessGroups.find(
                  ({ name: groupName }) => groupName === instance.access_group,
                )?.title || instance.access_group
              }
            />
            <InfoGrid.Item
              label="Tags"
              value={
                instance.tags.length > 0 ? (
                  <InstanceTags tags={instance.tags} />
                ) : undefined
              }
            />
            <InfoGrid.Item
              label="Profiles"
              value={
                instance.profiles?.map(({ title }) => title).join(", ") || null
              }
              type="truncated"
            />
          </InfoGrid>
        </Blocks.Item>
        <Blocks.Item title="Registration details">
          <InfoGrid>
            <InfoGrid.Item label="Hostname" value={instance.hostname} />
            <InfoGrid.Item label="ID" value={instance.id} />
            {features.hardware && (
              <InfoGrid.Item
                label="Serial number"
                value={hardware?.system.serial}
              />
            )}
            {features.hardware && (
              <InfoGrid.Item
                label="Product identifier"
                value={hardware?.system.model}
              />
            )}
            <InfoGrid.Item
              label="OS"
              value={instance.distribution_info?.description}
            />
            {features.hardware && (
              <InfoGrid.Item
                label="IP addresses"
                value={
                  Array.isArray(hardware?.network)
                    ? hardware.network.map(({ ip }) => ip).join(", ")
                    : null
                }
                type="truncated"
              />
            )}
            <InfoGrid.Item
              label="Registered"
              value={formatDate(instance.registered_at)}
            />
          </InfoGrid>
        </Blocks.Item>
        <Blocks.Item title="Other">
          <InfoGrid>
            <InfoGrid.Item
              label="Annotations"
              value={
                instance.annotations
                  ? Object.entries(instance.annotations).map(
                      ([key, value], index, array) => (
                        <Fragment key={key}>
                          <span>{`${key}: ${value}`}</span>
                          {index < array.length - 1 && <br />}
                        </Fragment>
                      ),
                    )
                  : null
              }
            />
            <InfoGrid.Item label="Comment" value={instance.comment} />
          </InfoGrid>
        </Blocks.Item>
      </Blocks>
    </>
  );
};

export default SupportInstanceInfo;
