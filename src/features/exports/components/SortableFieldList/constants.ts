export const OVERLAY_CURSOR_OFFSET_PX = 12;
export const JUST_MOVED_HIGHLIGHT_MS = 150;
export const FLIP_TRANSITION_CLEANUP_MS = 300;

// A fully-transparent 1×1 GIF. Used as the native drag image so the browser
// doesn't draw its own ghost (on macOS Chrome an empty/detached canvas is
// ignored and a globe/link icon is shown instead). We render our own
// fully-opaque overlay for the dragged row.
export const TRANSPARENT_GIF_DATA_URI =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
