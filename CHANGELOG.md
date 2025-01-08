## [1.11.1](https://github.com/canonical/landscape-dashboard/compare/v1.11.0...v1.11.1) (2025-01-07)


### Bug Fixes

* update react-components to 1.7.3 ([#153](https://github.com/canonical/landscape-dashboard/issues/153)) ([88b14fd](https://github.com/canonical/landscape-dashboard/commit/88b14fdf969651756c34c7fba6503a77a49afffd))

# [1.11.0](https://github.com/canonical/landscape-dashboard/compare/v1.10.0...v1.11.0) (2024-12-16)


### Bug Fixes

* add overview page lazy queries ([4375ebd](https://github.com/canonical/landscape-dashboard/commit/4375ebd33692ee736d5069ee76023c58c3a799ab))
* broken link in alerts notification page ([2b9504f](https://github.com/canonical/landscape-dashboard/commit/2b9504f02ed4f4ab21ad038af087d0011be2e5ea))
* change HTTP method to change organisation preferences ([868a812](https://github.com/canonical/landscape-dashboard/commit/868a812f9f35ceedfc7052b242cb5bd3dedd808f))
* remove access group dropdown from edit package profile form ([#155](https://github.com/canonical/landscape-dashboard/issues/155)) ([053e5b4](https://github.com/canonical/landscape-dashboard/commit/053e5b444cca5e6fb583e35bdc1045656e832067))
* show empty cell in activity table when activity has no related instance ([23ae288](https://github.com/canonical/landscape-dashboard/commit/23ae2888d8d17b3c3e6a174796fb4b3aaef5ecf6))
* unify empty state in profiles empty state ([5845267](https://github.com/canonical/landscape-dashboard/commit/584526757f52a7051a4a398290127e2bcdcb8796))


### Features

* add instances column to access groups ([#137](https://github.com/canonical/landscape-dashboard/issues/137)) ([9632989](https://github.com/canonical/landscape-dashboard/commit/96329896fb79bda873e5773b94afa3c77b7e8021))
* change event log page filter ([#139](https://github.com/canonical/landscape-dashboard/issues/139)) ([ace8ab6](https://github.com/canonical/landscape-dashboard/commit/ace8ab602c4cde7952a9f5108fedd11f75c2df37))
* hide 'View report' button on instances page ([2d762ad](https://github.com/canonical/landscape-dashboard/commit/2d762adeca680e30cb8974db5700af70da83a690))
* show organisation label instead of switch if user has only one ([#147](https://github.com/canonical/landscape-dashboard/issues/147)) ([0539efa](https://github.com/canonical/landscape-dashboard/commit/0539efac3190a831a2646d95211bbf7ff0d3f6cb))

# [1.10.0](https://github.com/canonical/landscape-dashboard/compare/v1.9.1...v1.10.0) (2024-12-05)


### Bug Fixes

* add loading state during first render ([5928f61](https://github.com/canonical/landscape-dashboard/commit/5928f61bb7357617d28a1fee40e8861142464351))
* instance distribution info can be null ([#142](https://github.com/canonical/landscape-dashboard/issues/142)) ([8536044](https://github.com/canonical/landscape-dashboard/commit/853604488bbce947b7ef80f25a56797066f19a9b))


### Features

* add search as a filter chip ([e6c118c](https://github.com/canonical/landscape-dashboard/commit/e6c118c501630f7149adadf27fcdd496e77d3f67))
* add welcome popup and info badge into sidebar ([#144](https://github.com/canonical/landscape-dashboard/issues/144)) ([0115e73](https://github.com/canonical/landscape-dashboard/commit/0115e7377459d6d7a5549ce29645dcd9a4bd281c))

## [1.9.1](https://github.com/canonical/landscape-dashboard/compare/v1.9.0...v1.9.1) (2024-12-02)


### Bug Fixes

* add component to render while redirecting ([89c8640](https://github.com/canonical/landscape-dashboard/commit/89c86409d42070dfdd61f44c519eee88e3d12f1a))

# [1.9.0](https://github.com/canonical/landscape-dashboard/compare/v1.8.1...v1.9.0) (2024-11-25)


### Bug Fixes

* change instance column filter ([f81e6b8](https://github.com/canonical/landscape-dashboard/commit/f81e6b822e6b40f11938b35fd57753eb241b5a0e))
* encode redirection path URL param ([2f31515](https://github.com/canonical/landscape-dashboard/commit/2f31515cd4b22bc0fb17cf567fe63e7c3683072f))


### Features

* add ability to assign access group for multiple instances ([#138](https://github.com/canonical/landscape-dashboard/issues/138)) ([a899f6d](https://github.com/canonical/landscape-dashboard/commit/a899f6d0a43007cff190d5e1fe63d46f3660f03e))
* add activities page filters ([#132](https://github.com/canonical/landscape-dashboard/issues/132)) ([e38c721](https://github.com/canonical/landscape-dashboard/commit/e38c721efadd136f300cc77e6bf4bf2a4161f6d3))
* add version number to sidebar ([7de1392](https://github.com/canonical/landscape-dashboard/commit/7de1392de85b148a16af0fa68a2c4b071395e6d0))

## [1.8.1](https://github.com/canonical/landscape-dashboard/compare/v1.8.0...v1.8.1) (2024-11-20)


### Bug Fixes

* add default supported provider ([aaece65](https://github.com/canonical/landscape-dashboard/commit/aaece65773c0337076ff610dd59460513b31fa2a))
* add environment context loading state ([62263fd](https://github.com/canonical/landscape-dashboard/commit/62263fd4a3b2d5ba53b6573bfa954bf1b7704550))
* kernel tab page crash for machines with no cve fixes, improve livepatch coverage info text ([c87d1d8](https://github.com/canonical/landscape-dashboard/commit/c87d1d8c85d4cea5dba573554e17cdfeb3cf83f9))

# [1.8.0](https://github.com/canonical/landscape-dashboard/compare/v1.7.6...v1.8.0) (2024-11-12)


### Features

* enable repository profiles, GPG keys and APT sources for SaaS ([b8ff2b1](https://github.com/canonical/landscape-dashboard/commit/b8ff2b1f6bbdc79d091ac73cdd4e91dc540ebef3))

## [1.7.6](https://github.com/canonical/landscape-dashboard/compare/v1.7.5...v1.7.6) (2024-11-08)


### Bug Fixes

* get instance OS from distribution info property ([cb4eedb](https://github.com/canonical/landscape-dashboard/commit/cb4eedb302a403d6d670bd174d2ffb0398d443da))
* show wsl profiles for self hosted only ([#130](https://github.com/canonical/landscape-dashboard/issues/130)) ([8bbf5f6](https://github.com/canonical/landscape-dashboard/commit/8bbf5f69f838bdfe2429ca5b687a1749adbf7ee5))

## [1.7.5](https://github.com/canonical/landscape-dashboard/compare/v1.7.4...v1.7.5) (2024-11-05)


### Bug Fixes

* update support link ([2d36c12](https://github.com/canonical/landscape-dashboard/commit/2d36c12c9fc4268497fc84d420a92b63b0671e96))

## [1.7.4](https://github.com/canonical/landscape-dashboard/compare/v1.7.3...v1.7.4) (2024-11-01)


### Bug Fixes

* handle request params for the old fetch if user is not presented ([c021434](https://github.com/canonical/landscape-dashboard/commit/c02143427304f77febad9cbacf65329aefac68ee))

## [1.7.3](https://github.com/canonical/landscape-dashboard/compare/v1.7.2...v1.7.3) (2024-10-31)


### Bug Fixes

* change link component import in alert notifications ([#125](https://github.com/canonical/landscape-dashboard/issues/125)) ([13726aa](https://github.com/canonical/landscape-dashboard/commit/13726aa8d2903e09a96cdaafffb156a81642769c))

## [1.7.2](https://github.com/canonical/landscape-dashboard/compare/v1.7.1...v1.7.2) (2024-10-30)


### Bug Fixes

* available package version not showing in package install form ([#124](https://github.com/canonical/landscape-dashboard/issues/124)) ([092fee0](https://github.com/canonical/landscape-dashboard/commit/092fee0abbc1cb9feb8d5383ab17417a84522b69))
* show 'no login methods' only when appropriate ([a1d4417](https://github.com/canonical/landscape-dashboard/commit/a1d4417bbfdf1638b0f914cd679d992640346341))

## [1.7.1](https://github.com/canonical/landscape-dashboard/compare/v1.7.0...v1.7.1) (2024-10-29)


### Bug Fixes

* allow selecting public GPG keys when adding a new APT source ([2b6a979](https://github.com/canonical/landscape-dashboard/commit/2b6a979c5c083263b240de023cf446d7be366494))
* kernel panel error when kernel status is undefined ([#123](https://github.com/canonical/landscape-dashboard/issues/123)) ([5ee63b4](https://github.com/canonical/landscape-dashboard/commit/5ee63b47410cb7e3d9fc1c5da9e6e8320f320c7b))

# [1.7.0](https://github.com/canonical/landscape-dashboard/compare/v1.6.0...v1.7.0) (2024-10-24)


### Bug Fixes

* add Kernel tab title and border above table section ([#122](https://github.com/canonical/landscape-dashboard/issues/122)) ([9bffb93](https://github.com/canonical/landscape-dashboard/commit/9bffb93b60f64659df9379f9049db38000fe444d))


### Features

* add endpoint to get auth state using http cookie, drop local storage using to store auth user ([eebf9db](https://github.com/canonical/landscape-dashboard/commit/eebf9dbb4895523ccbb2899077f39b4f0479fd11))

# [1.6.0](https://github.com/canonical/landscape-dashboard/compare/v1.5.0...v1.6.0) (2024-10-23)


### Bug Fixes

* change sign in form identity validation ([24f60ab](https://github.com/canonical/landscape-dashboard/commit/24f60aba52067c128ed631611afd91e543440fd0))
* handle trailing slash in root path, change default page redirect after signing in ([e8ac8e3](https://github.com/canonical/landscape-dashboard/commit/e8ac8e309cab6334f3f1d238cc1e0ab10079f484))


### Features

* add badge to Kernel tab ([#120](https://github.com/canonical/landscape-dashboard/issues/120)) ([103b45d](https://github.com/canonical/landscape-dashboard/commit/103b45dc54f88571262c0796981cedec1b8dd5c1))
* add standalone OIDC ([00ddfd6](https://github.com/canonical/landscape-dashboard/commit/00ddfd6ed3387332488e229350f3d90648593006))

# [1.5.0](https://github.com/canonical/landscape-dashboard/compare/v1.4.3...v1.5.0) (2024-10-15)


### Bug Fixes

* remove sign in form email validation, rename 'email' field into 'identity' ([9e529f9](https://github.com/canonical/landscape-dashboard/commit/9e529f975fb2da2f28caab6a13a48fdf74d43ddc))


### Features

* add availability zones to instances; change instance filters layout ([#104](https://github.com/canonical/landscape-dashboard/issues/104)) ([b2a8e1d](https://github.com/canonical/landscape-dashboard/commit/b2a8e1d3c36dac9bdb3ba9ea459d6b8b2c01625e))
* add dev PPA build to build workflow ([#109](https://github.com/canonical/landscape-dashboard/issues/109)) ([75af5f9](https://github.com/canonical/landscape-dashboard/commit/75af5f95c7b00670827a4f7f443bccad757b01fb))
* add Kernel tab in single instance view ([5244f93](https://github.com/canonical/landscape-dashboard/commit/5244f93b72dc91a48d9e98af6ee7e1261c70b3ed))

## [1.4.3](https://github.com/canonical/landscape-dashboard/compare/v1.4.2...v1.4.3) (2024-10-10)


### Bug Fixes

* close modal window after accepting or rejecting pending instances, style: change auth template styles ([e96df23](https://github.com/canonical/landscape-dashboard/commit/e96df232e078a08d2ed94b81b6f8063d31a8b2ab))

## [1.4.2](https://github.com/canonical/landscape-dashboard/compare/v1.4.1...v1.4.2) (2024-10-08)


### Bug Fixes

* repository profile showing for saas version ([9f8e205](https://github.com/canonical/landscape-dashboard/commit/9f8e205d7f2f2977dedcf556a165b395165183f4))

## [1.4.1](https://github.com/canonical/landscape-dashboard/compare/v1.4.0...v1.4.1) (2024-10-08)


### Bug Fixes

* secondary navigation not appearing for account settings ([846215a](https://github.com/canonical/landscape-dashboard/commit/846215ae426fd49baff64a76d574fbe61860491d))

# [1.4.0](https://github.com/canonical/landscape-dashboard/compare/v1.3.0...v1.4.0) (2024-10-07)


### Features

* add custom SSO providers: Okta and Ubuntu One ([03437ce](https://github.com/canonical/landscape-dashboard/commit/03437ce7bac8e055f848062251b19884f39a2930))

# [1.3.0](https://github.com/canonical/landscape-dashboard/compare/v1.2.1...v1.3.0) (2024-10-03)


### Bug Fixes

* use default icon for unknown alert type ([901e6b7](https://github.com/canonical/landscape-dashboard/commit/901e6b775b3c06cb77ad70455b575354b6921d5b))


### Features

* add new child instance alert ([5b2342b](https://github.com/canonical/landscape-dashboard/commit/5b2342b4b2004da55fdf1036a0dbbeef5e06c03a))

## [1.2.1](https://github.com/canonical/landscape-dashboard/compare/v1.2.0...v1.2.1) (2024-09-27)


### Bug Fixes

* bug causing switching organisations not to work ([89728bd](https://github.com/canonical/landscape-dashboard/commit/89728bdf2df276f4a7b6604f751b856e74fa0820))

# [1.2.0](https://github.com/canonical/landscape-dashboard/compare/v1.1.0...v1.2.0) (2024-09-23)


### Bug Fixes

* show "Reboot recommended" instance status correctly ([4c12910](https://github.com/canonical/landscape-dashboard/commit/4c12910eecf1e424e4b8565055b7699f9f138c84))


### Features

* implement WSL profiles page ([#108](https://github.com/canonical/landscape-dashboard/issues/108)) ([9336864](https://github.com/canonical/landscape-dashboard/commit/93368642f6b2e7226dff23a2a68e353a7378a2c5))

# [1.1.0](https://github.com/canonical/landscape-dashboard/compare/v1.0.0...v1.1.0) (2024-09-10)


### Features

* add changelog ([54cfcb2](https://github.com/canonical/landscape-dashboard/commit/54cfcb2b07b2dfae22ab07724c16ba7878a6924d))
