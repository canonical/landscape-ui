export interface SaveFilePickerHandle {
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  }>;
}

export interface SaveFilePickerWindow {
  showSaveFilePicker: (options?: {
    suggestedName?: string;
  }) => Promise<SaveFilePickerHandle>;
}

export const supportsNativeSave = (
  candidate: typeof window,
): candidate is typeof window & SaveFilePickerWindow =>
  "showSaveFilePicker" in candidate;

export const downloadBlob = (blob: Blob, filename: string): void => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};
