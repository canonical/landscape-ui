---
"landscape-ui": patch
---

Fix saving package profile constraints that allow any version, including removing an existing version restriction.

Selecting the Any rule clears the version automatically, and invalid saves no longer leave the save action stuck loading.
