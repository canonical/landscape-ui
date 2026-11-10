---
"landscape-ui": patch
---

Fix saving package profile constraints that allow any version, including removing an existing version restriction.

Selecting the Any rule clears the version automatically. Invalid saves no longer leave the save action stuck loading, and corrected fields can be saved directly without clicking away first.
