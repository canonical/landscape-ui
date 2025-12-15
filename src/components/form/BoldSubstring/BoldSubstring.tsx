import type { FC } from "react";

interface BoldSubstringProps {
  readonly text: string;
  readonly substring: string;
}

const BoldSubstring: FC<BoldSubstringProps> = ({ text, substring }) => {
  const lowerText = text.toLowerCase();
  const lowerSubstring = substring.toLowerCase();
  const index = lowerText.indexOf(lowerSubstring);
  if (index >= 0) {
    return (
      <>
        {text.substring(0, index)}
        <strong>{text.substring(index, index + substring.length)}</strong>
        {text.substring(index + substring.length)}
      </>
    );
  }
  return text;
};

export default BoldSubstring;
