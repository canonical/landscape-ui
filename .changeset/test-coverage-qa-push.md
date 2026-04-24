---
"landscape-ui": patch
---

test: push 5 components to 95%+ branch/statement coverage

- ScriptsVersionHistory: 50% → 100% branches
- ScriptVersionHistoryDetails: 75% → 100% branches (added error-path test; removed dead `|| ""`)
- ScriptDetails: 78% → 100% statements (removed 4 dead null-guards; replaced with non-null assertions)
- TagsAddForm: 88% → 96% branches (extracted `computeNewTags` helper; fixed duplicate MSW handler; added direct unit tests)
- PendingInstancesForm: 88% → 100% functions (mocked `useAuth` so `find` callback is exercised)
