import { Distribution } from "../../../types/Distribution";
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
          <Button small>Edit</Button>
          <Button small>Remove</Button>
          <Button small>Create snapshot</Button>
          <Button small>New pocket</Button>
        </div>
      </div>
      <div className={classes.content}>
        <DistributionPocketList item={item} />
      </div>
    </div>
  );
};

export default DistributionCard;
