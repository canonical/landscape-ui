---
"landscape-ui": minor
---

Limit usage of submitButtonDisabled prop from SidePanelFormButtons. Most forms no longer disable submit based on validity and keep the button enabled except while loading, though some flows may still disable it after validation failures (for example, Import Repository Packages).
