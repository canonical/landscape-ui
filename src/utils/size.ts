// Sizes travel through the API in bytes; people read and write them in
// binary kilobytes and megabytes.

const BYTES_UNIT = { value: "bytes", label: "bytes", bytes: 1 } as const;

/** Largest first, so a search for an exact unit finds the most readable one. */
export const SIZE_UNITS = [
  { value: "MB", label: "MB", bytes: 1024 * 1024 },
  { value: "KB", label: "KB", bytes: 1024 },
  BYTES_UNIT,
] as const;

export type SizeUnit = (typeof SIZE_UNITS)[number]["value"];

export interface ReadableSize {
  value: number;
  unit: SizeUnit;
}

export const getUnitBytes = (unit: SizeUnit): number =>
  SIZE_UNITS.find((sizeUnit) => sizeUnit.value === unit)?.bytes ??
  BYTES_UNIT.bytes;

/** `bytes` in the largest unit that represents it exactly, so nothing is rounded. */
export const toReadableSize = (bytes: number): ReadableSize => {
  const unit =
    SIZE_UNITS.find((sizeUnit) => bytes % sizeUnit.bytes === 0) ?? BYTES_UNIT;

  return { value: bytes / unit.bytes, unit: unit.value };
};

export const toBytes = ({ value, unit }: ReadableSize): number =>
  value * getUnitBytes(unit);

/** `bytes` as text in its largest exact unit, e.g. "2 MB" or "1,500 bytes". */
export const formatSize = (bytes: number): string => {
  const { value, unit } = toReadableSize(bytes);

  return `${value.toLocaleString("en")} ${unit}`;
};
