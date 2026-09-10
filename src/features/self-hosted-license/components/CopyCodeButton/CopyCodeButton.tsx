import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

const COPIED_FEEDBACK_TIMEOUT = 3000;

interface CopyCodeButtonProps {
  readonly value: string;
  readonly className?: string;
}

const CopyCodeButton: FC<CopyCodeButtonProps> = ({ value, className }) => {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      window.clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await copy(value);
      setCopied(true);
      window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, COPIED_FEEDBACK_TIMEOUT);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      appearance="base"
      className={className}
      hasIcon
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={handleCopy}
      type="button"
    >
      <Icon name={copied ? "success" : "copy"} />
    </Button>
  );
};

export default CopyCodeButton;
