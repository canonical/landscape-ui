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
