---
"landscape-ui": minor
---

Migrate tab strips to Pragma navigational Tabs through a URL-backed `AppTabs` component.

- Page tab strips keep their `?tab=<id>` URLs. Strips inside side panels and the Overview tables add slot-scoped `?tab=<slot>:<id>` entries (for example `?tab=profiles&sidePath=view&name=x&tab=panel:activity-history`), so reloads, back/forward and shared links restore nested tab state.
- Tab strips are links inside a labelled `nav`; the active tab is marked with `aria-current="page"`. Rich labels such as counts and loading indicators are kept.
- Unknown tab values fall back to the strip's default tab. Tab switches replace the current history entry, and closing a side panel or changing the page tab clears the panel's tab state.
- Replaces the `tab-link-` id convention and the side panels' `initialTabId` prop with panel-slot deep links.
