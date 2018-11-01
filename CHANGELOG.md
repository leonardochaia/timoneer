# [0.6.0](https://github.com/leonardochaia/timoneer/compare/v0.5.1...v0.6.0) (2018-11-01)


### Bug Fixes

* fixes container list not being updated when a container is created ([929a639](https://github.com/leonardochaia/timoneer/commit/929a639))
* image selector not working for docker hub ([29554ad](https://github.com/leonardochaia/timoneer/commit/29554ad))
* log out from docker hub ([092b7c7](https://github.com/leonardochaia/timoneer/commit/092b7c7))
* test registry credentials only when needed ([30e2224](https://github.com/leonardochaia/timoneer/commit/30e2224))
* use v2/ instead of catalog for testing registries ([5b9c80b](https://github.com/leonardochaia/timoneer/commit/5b9c80b))


### Features

* added link to create a container in container list ([60c79a7](https://github.com/leonardochaia/timoneer/commit/60c79a7))
* adds a Retry button when a container fails to create ([6215aba](https://github.com/leonardochaia/timoneer/commit/6215aba))
* adds auto remove falg ([eebc027](https://github.com/leonardochaia/timoneer/commit/eebc027))
* adds registry cache and fallback to local daemon ([a88b6c5](https://github.com/leonardochaia/timoneer/commit/a88b6c5))
* adds registry image history view ([33c8948](https://github.com/leonardochaia/timoneer/commit/33c8948))
* adds Retry button when loading image list fails ([f30183a](https://github.com/leonardochaia/timoneer/commit/f30183a))
* centralized image view ([514ae08](https://github.com/leonardochaia/timoneer/commit/514ae08))
* centralized search public docker hub ([041bb20](https://github.com/leonardochaia/timoneer/commit/041bb20))
* clear cache on demand in settings page ([b352952](https://github.com/leonardochaia/timoneer/commit/b352952))
* clone containers ([f04901f](https://github.com/leonardochaia/timoneer/commit/f04901f))
* image info for docker hub images ([0ddfd75](https://github.com/leonardochaia/timoneer/commit/0ddfd75))
* improved container action buttons ([631771c](https://github.com/leonardochaia/timoneer/commit/631771c))
* use same header for container list and inspect ([9c9a23d](https://github.com/leonardochaia/timoneer/commit/9c9a23d))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/leonardochaia/timoneer/compare/v0.5.0...v0.5.1) (2018-10-16)


### Bug Fixes

* do not append latest tag to what you type ([5017762](https://github.com/leonardochaia/timoneer/commit/5017762))
* fixes registries not being saved ([67b75e8](https://github.com/leonardochaia/timoneer/commit/67b75e8))
* include Material icon with Timoneer installation to support offline ([db02124](https://github.com/leonardochaia/timoneer/commit/db02124))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/leonardochaia/timoneer/compare/v0.4.1...v0.5.0) (2018-09-29)


### Bug Fixes

* fixed registry settings subscriptions ([139767a](https://github.com/leonardochaia/timoneer/commit/139767a))
* fixes copy/paste on MacOs, closes [#26](https://github.com/leonardochaia/timoneer/issues/26) ([d91282a](https://github.com/leonardochaia/timoneer/commit/d91282a))
* fixes Docker Hub private repo authentication ([6620f44](https://github.com/leonardochaia/timoneer/commit/6620f44))
* improved non tty container attach ([40fb899](https://github.com/leonardochaia/timoneer/commit/40fb899))


### Features

* added better docker logs support. Still room for improvements ([569cca4](https://github.com/leonardochaia/timoneer/commit/569cca4))
* list Docker Hub public and private images ([96f2b38](https://github.com/leonardochaia/timoneer/commit/96f2b38))
* list own Docker Hub images ([c73311f](https://github.com/leonardochaia/timoneer/commit/c73311f))
* open image logs modal when pulling ([5483436](https://github.com/leonardochaia/timoneer/commit/5483436))
* test registry credentials ([6394ccd](https://github.com/leonardochaia/timoneer/commit/6394ccd))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/leonardochaia/timoneer/compare/v0.4.0...v0.4.1) (2018-09-26)


### Bug Fixes

* fixed docker data usage not being calculated correctly ([a8fdc66](https://github.com/leonardochaia/timoneer/commit/a8fdc66))
* fixed filesize calculation ([b9c9a13](https://github.com/leonardochaia/timoneer/commit/b9c9a13))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/leonardochaia/timoneer/compare/v0.3.0...v0.4.0) (2018-09-19)


### Bug Fixes

* docker events bindings now have a throttle of 500ms ([2456551](https://github.com/leonardochaia/timoneer/commit/2456551))
* fix prod build with jobs by disabling optimization on ng build ([3536ff3](https://github.com/leonardochaia/timoneer/commit/3536ff3))
* fixed container naming on lists ([0d68fcf](https://github.com/leonardochaia/timoneer/commit/0d68fcf))
* fixes pull image jobs ([8a1a614](https://github.com/leonardochaia/timoneer/commit/8a1a614))


### Features

* allow to edit a JSON for Quick Templates ([b5645cd](https://github.com/leonardochaia/timoneer/commit/b5645cd))
* force remove running containers ([aa8a70c](https://github.com/leonardochaia/timoneer/commit/aa8a70c))
* load Quick Templates from json file ([6356e26](https://github.com/leonardochaia/timoneer/commit/6356e26))
* select first tag when selecting an image ([e06fdfb](https://github.com/leonardochaia/timoneer/commit/e06fdfb))
* show current attached container info below terminal ([6ebceca](https://github.com/leonardochaia/timoneer/commit/6ebceca))
* show port mappings on container list hover ([460ca3e](https://github.com/leonardochaia/timoneer/commit/460ca3e))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/leonardochaia/timoneer/compare/v0.2.1...v0.3.0) (2018-09-12)


### Features

* added DeveloperTools menu ([4a8d541](https://github.com/leonardochaia/timoneer/commit/4a8d541))
* added jobs ([7460503](https://github.com/leonardochaia/timoneer/commit/7460503))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/leonardochaia/timoneer/compare/v0.2.0...v0.2.1) (2018-08-12)


### Bug Fixes

* fixed differential updates not working ([0a5ab95](https://github.com/leonardochaia/timoneer/commit/0a5ab95))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/leonardochaia/timoneer/compare/v0.1.0...v0.2.0) (2018-08-12)


### Bug Fixes

* added loading to system view ([5864acd](https://github.com/leonardochaia/timoneer/commit/5864acd))
* disable text selection ([db0f246](https://github.com/leonardochaia/timoneer/commit/db0f246))
* fixed tags when no registries are configured ([bc680a9](https://github.com/leonardochaia/timoneer/commit/bc680a9))
* improved list refreshing logics ([fe58996](https://github.com/leonardochaia/timoneer/commit/fe58996))
* list not updating after os sleep ([63f9dfd](https://github.com/leonardochaia/timoneer/commit/63f9dfd))
* set host port and container port when adding suggesting port ([e440f9a](https://github.com/leonardochaia/timoneer/commit/e440f9a))
* show container name instead of id when attaching ([ab4c620](https://github.com/leonardochaia/timoneer/commit/ab4c620))
* storage driver not being shown ([a0ef3fa](https://github.com/leonardochaia/timoneer/commit/a0ef3fa))


### Features

* added all container listing ([97a915e](https://github.com/leonardochaia/timoneer/commit/97a915e))
* added application menu ([844efb2](https://github.com/leonardochaia/timoneer/commit/844efb2))
* added ctrl+shift+t shortcut for new container ([37b6524](https://github.com/leonardochaia/timoneer/commit/37b6524))
* added tab shortcuts ([5b2e77c](https://github.com/leonardochaia/timoneer/commit/5b2e77c))
* added Tabs support ([ca2d35b](https://github.com/leonardochaia/timoneer/commit/ca2d35b))
* added volume listing and remotion ([c6a9305](https://github.com/leonardochaia/timoneer/commit/c6a9305))
* create volumes ([e95ae7d](https://github.com/leonardochaia/timoneer/commit/e95ae7d))
* remove docker images ([c57877e](https://github.com/leonardochaia/timoneer/commit/c57877e))
* show which containers are using a volume ([5d313c8](https://github.com/leonardochaia/timoneer/commit/5d313c8))
* suggest volume names when creating containers ([7ecead8](https://github.com/leonardochaia/timoneer/commit/7ecead8))
* support mapping to docker volumes ([b402c83](https://github.com/leonardochaia/timoneer/commit/b402c83))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/leonardochaia/timoneer/compare/v0.0.2...v0.1.0) (2018-08-01)


### Features

* provide changelog auto-generated by commits ([520b02e](https://github.com/leonardochaia/timoneer/commit/520b02e))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/leonardochaia/timoneer/compare/v0.0.1...v0.0.2) (2018-07-31)



<a name="0.0.1"></a>
## [0.0.1](https://github.com/leonardochaia/timoneer/compare/v0.0.0...v0.0.1) (2018-07-30)



<a name="0.0.0"></a>
# 0.0.0 (2018-07-30)



