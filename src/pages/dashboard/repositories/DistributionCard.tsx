import { Distribution } from "../../../schemas/Distribution";
import { FC } from "react";
import DistributionPocketList from "./DistributionPocketList";
import classes from "./DistributionCard.module.scss";
import { Button } from "@canonical/react-components";

interface DistributionCardProps {
  item: Distribution;
}

const DistributionCard: FC<DistributionCardProps> = ({ item }) => {
  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <h2 className={classes.title}>{item.name}</h2>
        <div className={classes.cta}>
          <Button appearance="base">Edit</Button>
          <Button appearance="base">Remove</Button>
          <Button appearance="base">Create snapshot</Button>
          <Button appearance="base">New pocket</Button>
        </div>
      </div>
      <div>
        <DistributionPocketList item={item} />
      </div>
    </div>
  );
};

export default DistributionCard;
