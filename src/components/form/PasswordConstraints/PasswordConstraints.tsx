import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { MAX_PASSWORD_LENGTH } from "@/constants";
import classes from "./PasswordConstraints.module.scss";
import { getIconName } from "./helpers";

interface PasswordConstraint {
  label: string;
  passed: boolean;
}

interface PasswordConstraintsProps {
  readonly password: string;
  readonly touched: boolean;
  readonly hasError: boolean;
  readonly className?: string;
}

const PasswordConstraints: FC<PasswordConstraintsProps> = ({
  password,
  touched,
  hasError,
  className,
}) => {
  const constraints: PasswordConstraint[] = [
    {
      label: "8-50 characters",
      passed: password.length >= 8 && password.length <= MAX_PASSWORD_LENGTH,
    },
    {
      label: "Lower case letters (a-z)",
      passed: /[a-z]/.test(password),
    },
    {
      label: "Upper case letters (A-Z)",
      passed: /[A-Z]/.test(password),
    },
    {
      label: "Numbers (0-9)",
      passed: /[0-9]/.test(password),
    },
  ];

  return (
    <div className={className}>
      <p className="u-text--muted p-text--small">Password must contain</p>
      <div>
        {constraints.map((constraint) => (
          <span
            key={constraint.label}
            className={classNames("p-text--small", classes.constraint, {
              [classes.passed]: constraint.passed,
              [classes.default]: !constraint.passed && !touched,
              [classes.failed]: !constraint.passed && hasError && touched,
            })}
          >
            <Icon name={getIconName(constraint.passed, hasError, touched)} />
            {constraint.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PasswordConstraints;
