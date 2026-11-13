import useNotify from "@/hooks/useNotify";
import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import { Button, ConfirmationModal, Icon } from "@canonical/react-components";
import classNames from "classnames";
import { useState, type FC } from "react";
import { HEALTH_ACTION_META } from "../../helpers";
import useHealthAction from "../../hooks/useHealthAction";
import type { HealthActionKind } from "../../types";
import classes from "./HealthActions.module.scss";

// These change the instance, so they ask for confirmation first.
const DESTRUCTIVE_ACTIONS: ReadonlySet<HealthActionKind> = new Set([
  "reboot",
  "run-security-updates",
]);

const STATUS_FORBIDDEN = 403;
const STATUS_CONFLICT = 409;
const STATUS_NOT_IMPLEMENTED = 501;

interface HealthActionsProps {
  readonly instance: Pick<Instance | InstanceWithoutRelation, "id" | "title">;
  readonly actions: HealthActionKind[];
  readonly className?: string;
}

const HealthActions: FC<HealthActionsProps> = ({
  instance,
  actions,
  className,
}) => {
  const action = useHealthAction();
  const { notify } = useNotify();
  const [activeAction, setActiveAction] = useState<HealthActionKind | null>(
    null,
  );
  const [confirming, setConfirming] = useState<HealthActionKind | null>(null);

  const dispatch = (kind: HealthActionKind) => {
    const { label } = HEALTH_ACTION_META[kind];
    setActiveAction(kind);
    action.mutate(
      { computerId: instance.id, action: kind },
      {
        onSuccess: () => {
          notify.success({ message: `${label} dispatched.` });
        },
        onError: (error) => {
          const status = error.response?.status;
          const message =
            error.response?.data?.message ?? "Action failed unexpectedly.";
          if (status === STATUS_FORBIDDEN) {
            notify.error({
              title: "Permission required",
              message: `You don't have permission to ${label.toLowerCase()}.`,
              error,
            });
          } else if (status === STATUS_CONFLICT) {
            notify.error({ title: "Nothing to do", message, error });
          } else if (status === STATUS_NOT_IMPLEMENTED) {
            notify.error({
              title: "Not available yet",
              message:
                "This remediation is not available yet. Try one of the other actions.",
              error,
            });
          } else {
            notify.error({ title: `${label} failed`, message, error });
          }
        },
        onSettled: () => {
          setActiveAction(null);
          setConfirming(null);
        },
      },
    );
  };

  const requestAction = (kind: HealthActionKind) => {
    if (DESTRUCTIVE_ACTIONS.has(kind)) {
      setConfirming(kind);
      return;
    }
    dispatch(kind);
  };

  return (
    <>
      <ul className={classNames(classes.list, className)}>
        {actions.map((kind) => {
          const meta = HEALTH_ACTION_META[kind];
          const isBusy = action.isPending && activeAction === kind;
          return (
            <li key={kind} className={classes.item}>
              <div className={classes.body}>
                <strong>{meta.label}</strong>
                <span className={classes.description}>{meta.description}</span>
              </div>
              <Button
                type="button"
                className="u-no-margin--bottom"
                hasIcon
                onClick={() => {
                  requestAction(kind);
                }}
                disabled={action.isPending}
                aria-busy={isBusy}
                aria-label={meta.label}
              >
                <Icon name={isBusy ? "spinner" : meta.icon} />
                <span>{meta.cta}</span>
              </Button>
            </li>
          );
        })}
      </ul>

      {confirming && (
        <ConfirmationModal
          close={() => {
            setConfirming(null);
          }}
          title={`${HEALTH_ACTION_META[confirming].label}?`}
          onConfirm={() => {
            dispatch(confirming);
          }}
          confirmButtonLabel={HEALTH_ACTION_META[confirming].label}
          confirmButtonAppearance={
            confirming === "reboot" ? "negative" : "positive"
          }
          confirmButtonDisabled={action.isPending}
        >
          <p>
            {confirming === "reboot"
              ? `This will schedule an immediate reboot for ${instance.title}. In-flight work on the instance may be interrupted.`
              : `This will queue package upgrades for every open USN on ${instance.title}. Some services may restart as part of the upgrade.`}
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default HealthActions;
