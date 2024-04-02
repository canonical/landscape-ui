import { Package } from "@/types/Package";
import { AvailableSnap, SelectedSnaps } from "@/types/Snap";
import { Key } from "react";

export const DEBOUNCE_DELAY = 200;

export const boldSubstring = (text: string, substring: string) => {
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

export const getItemKey = (
  item: Package | SelectedSnaps | AvailableSnap,
): Key => {
  if ("snap-id" in item) {
    return item["snap-id"] as string;
  }
  return `${item.name} ${item.version}`;
};
