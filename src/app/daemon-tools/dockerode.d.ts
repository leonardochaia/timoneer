import 'dockerode';

declare module 'dockerode' {
    export interface ContainerInfo {
        /**
         * The ID of this container
         * @type {string}
         * @memberof ContainerInfo
         */
        Id: string;
        /**
         * The names that this container has been given
         * @type {Array&lt;string&gt;}
         * @memberof ContainerInfo
         */
        Names: Array<string>;
        /**
         * The name of the image used when creating this container
         * @type {string}
         * @memberof ContainerInfo
         */
        Image: string;
        /**
         * The ID of the image that this container was created from
         * @type {string}
         * @memberof ContainerInfo
         */
        ImageID: string;
        /**
         * Command to run when starting the container
         * @type {string}
         * @memberof ContainerInfo
         */
        Command: string;
        /**
         * When the container was created
         * @type {number}
         * @memberof ContainerInfo
         */
        Created: number;
        /**
         * The ports exposed by this container
         * @type {Array&lt;Port&gt;}
         * @memberof ContainerInfo
         */
        Ports: Array<Port>;
        /**
         * The size of files that have been created or changed by this container
         * @type {number}
         * @memberof ContainerInfo
         */
        SizeRw: number;
        /**
         * The total size of all the files in this container
         * @type {number}
         * @memberof ContainerInfo
         */
        SizeRootFs: number;
        /**
         * User-defined key/value metadata.
         * @type {{ [key: string]: string; }}
         * @memberof ContainerInfo
         */
        Labels: {
            [key: string]: string;
        };
        /**
         * The state of this container (e.g. `Exited`)
         * @type {string}
         * @memberof ContainerInfo
         */
        State: string;
        /**
         * Additional human-readable status of this container (e.g. `Exit 0`)
         * @type {string}
         * @memberof ContainerInfo
         */
        Status: string;
        /**
         *
         * @type {ContainerInfoHostConfig}
         * @memberof ContainerInfo
         */
        HostConfig: ContainerInfoHostConfig;

        /**
         *
         * @type {Array&lt;Mount&gt;}
         * @memberof ContainerInfo
         */
        Mounts: Array<Mount>;
    }

    /**
     *
     * @export
     * @interface ContainerInfoHostConfig
     */
    export interface ContainerInfoHostConfig {
        /**
         *
         * @type {string}
         * @memberof ContainerInfoHostConfig
         */
        NetworkMode: string;
    }

    /**
     * EndpointIPAMConfig represents an endpoint's IPAM configuration.
     * @export
     * @interface EndpointIPAMConfig
     */
    export interface EndpointIPAMConfig {
        /**
         *
         * @type {string}
         * @memberof EndpointIPAMConfig
         */
        IPv4Address: string;
        /**
         *
         * @type {string}
         * @memberof EndpointIPAMConfig
         */
        IPv6Address: string;
        /**
         *
         * @type {Array&lt;string&gt;}
         * @memberof EndpointIPAMConfig
         */
        LinkLocalIPs: Array<string>;
    }
    /**
     *
     * @export
     * @interface Mount
     */
    export interface Mount {
        /**
         * Container path.
         * @type {string}
         * @memberof Mount
         */
        Target: string;
        /**
         * Mount source (e.g. a volume name, a host path).
         * @type {string}
         * @memberof Mount
         */
        Source: string;
        /**
         * The mount type. Available types:  - `bind` Mounts a file or directory from the host into the container. Must exist prior to creating the container. - `volume` Creates a volume with the given name and options (or uses a pre-existing volume with the same name and options). These are **not** removed when the container is removed. - `tmpfs` Create a tmpfs with the given options. The mount source cannot be specified for tmpfs.
         * @type {string}
         * @memberof Mount
         */
        Type: Mount.TypeEnum;
        /**
         * Whether the mount should be read-only.
         * @type {boolean}
         * @memberof Mount
         */
        ReadOnly: boolean;
        /**
         * The consistency requirement for the mount: `default`, `consistent`, `cached`, or `delegated`.
         * @type {string}
         * @memberof Mount
         */
        Consistency: string;
        /**
         * Optional configuration for the `bind` type.
         * @type {any}
         * @memberof Mount
         */
        BindOptions: any;
        /**
         *
         * @type {MountVolumeOptions}
         * @memberof Mount
         */
        VolumeOptions: MountVolumeOptions;
        /**
         *
         * @type {MountTmpfsOptions}
         * @memberof Mount
         */
        TmpfsOptions: MountTmpfsOptions;
    }

    /**
     * Optional configuration for the `tmpfs` type.
     * @export
     * @interface MountTmpfsOptions
     */
    export interface MountTmpfsOptions {
        /**
         * The size for the tmpfs mount in bytes.
         * @type {number}
         * @memberof MountTmpfsOptions
         */
        SizeBytes: number;
        /**
         * The permission mode for the tmpfs mount in an integer.
         * @type {number}
         * @memberof MountTmpfsOptions
         */
        Mode: number;
    }
    /**
     * Optional configuration for the `volume` type.
     * @export
     * @interface MountVolumeOptions
     */
    export interface MountVolumeOptions {
        /**
         * Populate volume with data from the target.
         * @type {boolean}
         * @memberof MountVolumeOptions
         */
        NoCopy: boolean;
        /**
         * User-defined key/value metadata.
         * @type {{ [key: string]: string; }}
         * @memberof MountVolumeOptions
         */
        Labels: {
            [key: string]: string;
        };
        /**
         *
         * @type {MountVolumeOptionsDriverConfig}
         * @memberof MountVolumeOptions
         */
        DriverConfig: MountVolumeOptionsDriverConfig;
    }

    /**
     * Map of driver specific options
     * @export
     * @interface MountVolumeOptionsDriverConfig
     */
    export interface MountVolumeOptionsDriverConfig {
        /**
         * Name of the driver to use to create the volume.
         * @type {string}
         * @memberof MountVolumeOptionsDriverConfig
         */
        Name: string;
        /**
         * key/value map of driver specific options.
         * @type {{ [key: string]: string; }}
         * @memberof MountVolumeOptionsDriverConfig
         */
        Options: {
            [key: string]: string;
        };
    }
    /**
     * @export
     * @namespace Mount
     */
    export namespace Mount {
        /**
         * @export
         * @enum {string}
         */
        enum TypeEnum {
            Bind,
            Volume,
            Tmpfs,
        }
    }


    /**
     *
     * @export
     * @interface SystemInfo
     */
    export interface SystemInfo {
        /**
         * Unique identifier of the daemon.  <p><br /></p>  > **Note**: The format of the ID itself is not part of the API, and > should not be considered stable.
         * @type {string}
         * @memberof SystemInfo
         */
        ID?: string;
        /**
         * Total number of containers on the host.
         * @type {number}
         * @memberof SystemInfo
         */
        Containers?: number;
        /**
         * Number of containers with status `\"running\"`.
         * @type {number}
         * @memberof SystemInfo
         */
        ContainersRunning?: number;
        /**
         * Number of containers with status `\"paused\"`.
         * @type {number}
         * @memberof SystemInfo
         */
        ContainersPaused?: number;
        /**
         * Number of containers with status `\"stopped\"`.
         * @type {number}
         * @memberof SystemInfo
         */
        ContainersStopped?: number;
        /**
         * Total number of images on the host.  Both _tagged_ and _untagged_ (dangling) images are counted.
         * @type {number}
         * @memberof SystemInfo
         */
        Images?: number;
        /**
         * Name of the storage driver in use.
         * @type {string}
         * @memberof SystemInfo
         */
        Driver?: string;
        /**
         * Information specific to the storage driver, provided as \"label\" / \"value\" pairs.  This information is provided by the storage driver, and formatted in a way consistent with the output of `docker info` on the command line.  <p><br /></p>  > **Note**: The information returned in this field, including the > formatting of values and labels, should not be considered stable, > and may change without notice.
         * @type {Array&lt;Array&lt;string&gt;&gt;}
         * @memberof SystemInfo
         */
        DriverStatus?: Array<Array<string>>;
        /**
         * Root directory of persistent Docker state.  Defaults to `/var/lib/docker` on Linux, and `C:\\ProgramData\\docker` on Windows.
         * @type {string}
         * @memberof SystemInfo
         */
        DockerRootDir?: string;
        /**
         * Status information about this node (standalone Swarm API).  <p><br /></p>  > **Note**: The information returned in this field is only propagated > by the Swarm standalone API, and is empty (`null`) when using > built-in swarm mode.
         * @type {Array&lt;Array&lt;string&gt;&gt;}
         * @memberof SystemInfo
         */
        SystemStatus?: Array<Array<string>>;
        /**
         *
         * @type {PluginsInfo}
         * @memberof SystemInfo
         */
        Plugins?: PluginsInfo;
        /**
         * Indicates if the host has memory limit support enabled.
         * @type {boolean}
         * @memberof SystemInfo
         */
        MemoryLimit?: boolean;
        /**
         * Indicates if the host has memory swap limit support enabled.
         * @type {boolean}
         * @memberof SystemInfo
         */
        SwapLimit?: boolean;
        /**
         * Indicates if the host has kernel memory limit support enabled.
         * @type {boolean}
         * @memberof SystemInfo
         */
        KernelMemory?: boolean;
        /**
         * Indicates if CPU CFS(Completely Fair Scheduler) period is supported by the host.
         * @type {boolean}
         * @memberof SystemInfo
         */
        CpuCfsPeriod?: boolean;
        /**
         * Indicates if CPU CFS(Completely Fair Scheduler) quota is supported by the host.
         * @type {boolean}
         * @memberof SystemInfo
         */
        CpuCfsQuota?: boolean;
        /**
         * Indicates if CPU Shares limiting is supported by the host.
         * @type {boolean}
         * @memberof SystemInfo
         */
        CPUShares?: boolean;
        /**
         * Indicates if CPUsets (cpuset.cpus, cpuset.mems) are supported by the host.  See [cpuset(7)](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt)
         * @type {boolean}
         * @memberof SystemInfo
         */
        CPUSet?: boolean;
        /**
         * Indicates if OOM killer disable is supported on the host.
         * @type {boolean}
         * @memberof SystemInfo
         */
        OomKillDisable?: boolean;
        /**
         * Indicates IPv4 forwarding is enabled.
         * @type {boolean}
         * @memberof SystemInfo
         */
        IPv4Forwarding?: boolean;
        /**
         * Indicates if `bridge-nf-call-iptables` is available on the host.
         * @type {boolean}
         * @memberof SystemInfo
         */
        BridgeNfIptables?: boolean;
        /**
         * Indicates if `bridge-nf-call-ip6tables` is available on the host.
         * @type {boolean}
         * @memberof SystemInfo
         */
        BridgeNfIp6tables?: boolean;
        /**
         * Indicates if the daemon is running in debug-mode / with debug-level logging enabled.
         * @type {boolean}
         * @memberof SystemInfo
         */
        Debug?: boolean;
        /**
         * The total number of file Descriptors in use by the daemon process.  This information is only returned if debug-mode is enabled.
         * @type {number}
         * @memberof SystemInfo
         */
        NFd?: number;
        /**
         * The  number of goroutines that currently exist.  This information is only returned if debug-mode is enabled.
         * @type {number}
         * @memberof SystemInfo
         */
        NGoroutines?: number;
        /**
         * Current system-time in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
         * @type {string}
         * @memberof SystemInfo
         */
        SystemTime?: string;
        /**
         * The logging driver to use as a default for new containers.
         * @type {string}
         * @memberof SystemInfo
         */
        LoggingDriver?: string;
        /**
         * The driver to use for managing cgroups.
         * @type {string}
         * @memberof SystemInfo
         */
        CgroupDriver?: SystemInfo.CgroupDriverEnum;
        /**
         * Number of event listeners subscribed.
         * @type {number}
         * @memberof SystemInfo
         */
        NEventsListener?: number;
        /**
         * Kernel version of the host.  On Linux, this information obtained from `uname`. On Windows this information is queried from the <kbd>HKEY_LOCAL_MACHINE\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\</kbd> registry value, for example _\"10.0 14393 (14393.1198.amd64fre.rs1_release_sec.170427-1353)\"_.
         * @type {string}
         * @memberof SystemInfo
         */
        KernelVersion?: string;
        /**
         * Name of the host's operating system, for example: \"Ubuntu 16.04.2 LTS\" or \"Windows Server 2016 Datacenter\"
         * @type {string}
         * @memberof SystemInfo
         */
        OperatingSystem?: string;
        /**
         * Generic type of the operating system of the host, as returned by the Go runtime (`GOOS`).  Currently returned values are \"linux\" and \"windows\". A full list of possible values can be found in the [Go documentation](https://golang.org/doc/install/source#environment).
         * @type {string}
         * @memberof SystemInfo
         */
        OSType?: string;
        /**
         * Hardware architecture of the host, as returned by the Go runtime (`GOARCH`).  A full list of possible values can be found in the [Go documentation](https://golang.org/doc/install/source#environment).
         * @type {string}
         * @memberof SystemInfo
         */
        Architecture?: string;
        /**
         * The number of logical CPUs usable by the daemon.  The number of available CPUs is checked by querying the operating system when the daemon starts. Changes to operating system CPU allocation after the daemon is started are not reflected.
         * @type {number}
         * @memberof SystemInfo
         */
        NCPU?: number;
        /**
         * Total amount of physical memory available on the host, in kilobytes (kB).
         * @type {number}
         * @memberof SystemInfo
         */
        MemTotal?: number;
        /**
         * Address / URL of the index server that is used for image search, and as a default for user authentication for Docker Hub and Docker Cloud.
         * @type {string}
         * @memberof SystemInfo
         */
        IndexServerAddress?: string;
        /**
         *
         * @type {RegistryServiceConfig}
         * @memberof SystemInfo
         */
        RegistryConfig?: RegistryServiceConfig;
        /**
         *
         * @type {GenericResources}
         * @memberof SystemInfo
         */
        GenericResources?: GenericResources;
        /**
         * HTTP-proxy configured for the daemon. This value is obtained from the [`HTTP_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html) environment variable.  Containers do not automatically inherit this configuration.
         * @type {string}
         * @memberof SystemInfo
         */
        HttpProxy?: string;
        /**
         * HTTPS-proxy configured for the daemon. This value is obtained from the [`HTTPS_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html) environment variable.  Containers do not automatically inherit this configuration.
         * @type {string}
         * @memberof SystemInfo
         */
        HttpsProxy?: string;
        /**
         * Comma-separated list of domain extensions for which no proxy should be used. This value is obtained from the [`NO_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html) environment variable.  Containers do not automatically inherit this configuration.
         * @type {string}
         * @memberof SystemInfo
         */
        NoProxy?: string;
        /**
         * Hostname of the host.
         * @type {string}
         * @memberof SystemInfo
         */
        Name?: string;
        /**
         * User-defined labels (key/value metadata) as set on the daemon.  <p><br /></p>  > **Note**: When part of a Swarm, nodes can both have _daemon_ labels, > set through the daemon configuration, and _node_ labels, set from a > manager node in the Swarm. Node labels are not included in this > field. Node labels can be retrieved using the `/nodes/(id)` endpoint > on a manager node in the Swarm.
         * @type {Array&lt;string&gt;}
         * @memberof SystemInfo
         */
        Labels?: Array<string>;
        /**
         * Indicates if experimental features are enabled on the daemon.
         * @type {boolean}
         * @memberof SystemInfo
         */
        ExperimentalBuild?: boolean;
        /**
         * Version string of the daemon.  > **Note**: the [standalone Swarm API](https://docs.docker.com/swarm/swarm-api/) > returns the Swarm version instead of the daemon  version, for example > `swarm/1.2.8`.
         * @type {string}
         * @memberof SystemInfo
         */
        ServerVersion?: string;
        /**
         * URL of the distributed storage backend.   The storage backend is used for multihost networking (to store network and endpoint information) and by the node discovery mechanism.  <p><br /></p>  > **Note**: This field is only propagated when using standalone Swarm > mode, and overlay networking using an external k/v store. Overlay > networks with Swarm mode enabled use the built-in raft store, and > this field will be empty.
         * @type {string}
         * @memberof SystemInfo
         */
        ClusterStore?: string;
        /**
         * The network endpoint that the Engine advertises for the purpose of node discovery. ClusterAdvertise is a `host:port` combination on which the daemon is reachable by other hosts.  <p><br /></p>  > **Note**: This field is only propagated when using standalone Swarm > mode, and overlay networking using an external k/v store. Overlay > networks with Swarm mode enabled use the built-in raft store, and > this field will be empty.
         * @type {string}
         * @memberof SystemInfo
         */
        ClusterAdvertise?: string;
        /**
         * List of [OCI compliant](https://github.com/opencontainers/runtime-spec) runtimes configured on the daemon. Keys hold the \"name\" used to reference the runtime.  The Docker daemon relies on an OCI compliant runtime (invoked via the `containerd` daemon) as its interface to the Linux kernel namespaces, cgroups, and SELinux.  The default runtime is `runc`, and automatically configured. Additional runtimes can be configured by the user and will be listed here.
         * @type {{ [key: string]: Runtime; }}
         * @memberof SystemInfo
         */
        Runtimes?: {
            [key: string]: Runtime;
        };
        /**
         * Name of the default OCI runtime that is used when starting containers.  The default can be overridden per-container at create time.
         * @type {string}
         * @memberof SystemInfo
         */
        DefaultRuntime?: string;
        /**
         *
         * @type {SwarmInfo}
         * @memberof SystemInfo
         */
        Swarm?: SwarmInfo;
        /**
         * Indicates if live restore is enabled.  If enabled, containers are kept running when the daemon is shutdown or upon daemon start if running containers are detected.
         * @type {boolean}
         * @memberof SystemInfo
         */
        LiveRestoreEnabled?: boolean;
        /**
         * Represents the isolation technology to use as a default for containers. The supported values are platform-specific.  If no isolation value is specified on daemon start, on Windows client, the default is `hyperv`, and on Windows server, the default is `process`.  This option is currently not used on other platforms.
         * @type {string}
         * @memberof SystemInfo
         */
        Isolation?: SystemInfo.IsolationEnum;
        /**
         * Name and, optional, path of the the `docker-init` binary.  If the path is omitted, the daemon searches the host's `$PATH` for the binary and uses the first result.
         * @type {string}
         * @memberof SystemInfo
         */
        InitBinary?: string;
        /**
         *
         * @type {Commit}
         * @memberof SystemInfo
         */
        ContainerdCommit?: Commit;
        /**
         *
         * @type {Commit}
         * @memberof SystemInfo
         */
        RuncCommit?: Commit;
        /**
         *
         * @type {Commit}
         * @memberof SystemInfo
         */
        InitCommit?: Commit;
        /**
         * List of security features that are enabled on the daemon, such as apparmor, seccomp, SELinux, and user-namespaces (userns).  Additional configuration options for each security feature may be present, and are included as a comma-separated list of key/value pairs.
         * @type {Array&lt;string&gt;}
         * @memberof SystemInfo
         */
        SecurityOptions?: Array<string>;
    }

    /**
     * Commit holds the Git-commit (SHA1) that a binary was built from, as reported in the version-string of external tools, such as `containerd`, or `runC`.
     * @export
     * @interface Commit
     */
    export interface Commit {
        /**
         * Actual commit ID of external tool.
         * @type {string}
         * @memberof Commit
         */
        ID?: string;
        /**
         * Commit ID of external tool expected by dockerd as set at build time.
         * @type {string}
         * @memberof Commit
         */
        Expected?: string;
    }

    /**
     * Available plugins per type.  <p><br /></p>  > **Note**: Only unmanaged (V1) plugins are included in this list. > V1 plugins are \"lazily\" loaded, and are not returned in this list > if there is no resource using the plugin.
     * @export
     * @interface PluginsInfo
     */
    export interface PluginsInfo {
        /**
         * Names of available volume-drivers, and network-driver plugins.
         * @type {Array&lt;string&gt;}
         * @memberof PluginsInfo
         */
        Volume?: Array<string>;
        /**
         * Names of available network-drivers, and network-driver plugins.
         * @type {Array&lt;string&gt;}
         * @memberof PluginsInfo
         */
        Network?: Array<string>;
        /**
         * Names of available authorization plugins.
         * @type {Array&lt;string&gt;}
         * @memberof PluginsInfo
         */
        Authorization?: Array<string>;
        /**
         * Names of available logging-drivers, and logging-driver plugins.
         * @type {Array&lt;string&gt;}
         * @memberof PluginsInfo
         */
        Log?: Array<string>;
    }


    /**
     * IndexInfo contains information about a registry.
     * @export
     * @interface IndexInfo
     */
    export interface IndexInfo {
        /**
         * Name of the registry, such as \"docker.io\".
         * @type {string}
         * @memberof IndexInfo
         */
        Name?: string;
        /**
         * List of mirrors, expressed as URIs.
         * @type {Array&lt;string&gt;}
         * @memberof IndexInfo
         */
        Mirrors?: Array<string>;
        /**
         * Indicates if the the registry is part of the list of insecure registries.  If `false`, the registry is insecure. Insecure registries accept un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from unknown CAs) communication.  > **Warning**: Insecure registries can be useful when running a local > registry. However, because its use creates security vulnerabilities > it should ONLY be enabled for testing purposes. For increased > security, users should add their CA to their system's list of > trusted CAs instead of enabling this option.
         * @type {boolean}
         * @memberof IndexInfo
         */
        Secure?: boolean;
        /**
         * Indicates whether this is an official registry (i.e., Docker Hub / docker.io)
         * @type {boolean}
         * @memberof IndexInfo
         */
        Official?: boolean;
    }

    /**
     * RegistryServiceConfig stores daemon registry services configuration.
     * @export
     * @interface RegistryServiceConfig
     */
    export interface RegistryServiceConfig {
        /**
         * List of IP ranges to which nondistributable artifacts can be pushed, using the CIDR syntax [RFC 4632](https://tools.ietf.org/html/4632).  Some images (for example, Windows base images) contain artifacts whose distribution is restricted by license. When these images are pushed to a registry, restricted artifacts are not included.  This configuration override this behavior, and enables the daemon to push nondistributable artifacts to all registries whose resolved IP address is within the subnet described by the CIDR syntax.  This option is useful when pushing images containing nondistributable artifacts to a registry on an air-gapped network so hosts on that network can pull the images without connecting to another server.  > **Warning**: Nondistributable artifacts typically have restrictions > on how and where they can be distributed and shared. Only use this > feature to push artifacts to private registries and ensure that you > are in compliance with any terms that cover redistributing > nondistributable artifacts.
         * @type {Array&lt;string&gt;}
         * @memberof RegistryServiceConfig
         */
        AllowNondistributableArtifactsCIDRs?: Array<string>;
        /**
         * List of registry hostnames to which nondistributable artifacts can be pushed, using the format `<hostname>[:<port>]` or `<IP address>[:<port>]`.  Some images (for example, Windows base images) contain artifacts whose distribution is restricted by license. When these images are pushed to a registry, restricted artifacts are not included.  This configuration override this behavior for the specified registries.  This option is useful when pushing images containing nondistributable artifacts to a registry on an air-gapped network so hosts on that network can pull the images without connecting to another server.  > **Warning**: Nondistributable artifacts typically have restrictions > on how and where they can be distributed and shared. Only use this > feature to push artifacts to private registries and ensure that you > are in compliance with any terms that cover redistributing > nondistributable artifacts.
         * @type {Array&lt;string&gt;}
         * @memberof RegistryServiceConfig
         */
        AllowNondistributableArtifactsHostnames?: Array<string>;
        /**
         * List of IP ranges of insecure registries, using the CIDR syntax ([RFC 4632](https://tools.ietf.org/html/4632)). Insecure registries accept un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from unknown CAs) communication.  By default, local registries (`127.0.0.0/8`) are configured as insecure. All other registries are secure. Communicating with an insecure registry is not possible if the daemon assumes that registry is secure.  This configuration override this behavior, insecure communication with registries whose resolved IP address is within the subnet described by the CIDR syntax.  Registries can also be marked insecure by hostname. Those registries are listed under `IndexConfigs` and have their `Secure` field set to `false`.  > **Warning**: Using this option can be useful when running a local > registry, but introduces security vulnerabilities. This option > should therefore ONLY be used for testing purposes. For increased > security, users should add their CA to their system's list of trusted > CAs instead of enabling this option.
         * @type {Array&lt;string&gt;}
         * @memberof RegistryServiceConfig
         */
        InsecureRegistryCIDRs?: Array<string>;
        /**
         *
         * @type {{ [key: string]: IndexInfo; }}
         * @memberof RegistryServiceConfig
         */
        IndexConfigs?: {
            [key: string]: IndexInfo;
        };
        /**
         * List of registry URLs that act as a mirror for the official (`docker.io`) registry.
         * @type {Array&lt;string&gt;}
         * @memberof RegistryServiceConfig
         */
        Mirrors?: Array<string>;
    }


    /**
     * Represents a peer-node in the swarm
     * @export
     * @interface PeerNode
     */
    export interface PeerNode {
        /**
         * Unique identifier of for this node in the swarm.
         * @type {string}
         * @memberof PeerNode
         */
        NodeID?: string;
        /**
         * IP address and ports at which this node can be reached.
         * @type {string}
         * @memberof PeerNode
         */
        Addr?: string;
    }


    /**
     * Current local status of this node.
     * @export
     * @enum {string}
     */
    export enum LocalNodeState {
        Empty,
        Inactive,
        Pending,
        Active,
        Error,
        Locked,
    }

    /**
     * Represents generic information about swarm.
     * @export
     * @interface SwarmInfo
     */
    export interface SwarmInfo {
        /**
         * Unique identifier of for this node in the swarm.
         * @type {string}
         * @memberof SwarmInfo
         */
        NodeID?: string;
        /**
         * IP address at which this node can be reached by other nodes in the swarm.
         * @type {string}
         * @memberof SwarmInfo
         */
        NodeAddr?: string;
        /**
         *
         * @type {LocalNodeState}
         * @memberof SwarmInfo
         */
        LocalNodeState?: LocalNodeState;
        /**
         *
         * @type {boolean}
         * @memberof SwarmInfo
         */
        ControlAvailable?: boolean;
        /**
         *
         * @type {string}
         * @memberof SwarmInfo
         */
        Error?: string;
        /**
         * List of ID's and addresses of other managers in the swarm.
         * @type {Array&lt;PeerNode&gt;}
         * @memberof SwarmInfo
         */
        RemoteManagers?: Array<PeerNode>;
        /**
         * Total number of nodes in the swarm.
         * @type {number}
         * @memberof SwarmInfo
         */
        Nodes?: number;
        /**
         * Total number of managers in the swarm.
         * @type {number}
         * @memberof SwarmInfo
         */
        Managers?: number;
        /**
         *
         * @type {ClusterInfo}
         * @memberof SwarmInfo
         */
        Cluster?: ClusterInfo;
    }

    /**
     * The version number of the object such as node, service, etc. This is needed to avoid conflicting writes. The client must send the version number along with the modified specification when updating these objects. This approach ensures safe concurrency and determinism in that the change on the object may not be applied if the version number has changed from the last read. In other words, if two update requests specify the same base version, only one of the requests can succeed. As a result, two separate update requests that happen at the same time will not unintentionally overwrite each other.
     * @export
     * @interface ObjectVersion
     */
    export interface ObjectVersion {
        /**
         *
         * @type {number}
         * @memberof ObjectVersion
         */
        Index?: number;
    }

    /**
     * ClusterInfo represents information about the swarm as is returned by the \"/info\" endpoint. Join-tokens are not included.
     * @export
     * @interface ClusterInfo
     */
    export interface ClusterInfo {
        /**
         * The ID of the swarm.
         * @type {string}
         * @memberof ClusterInfo
         */
        ID?: string;
        /**
         *
         * @type {ObjectVersion}
         * @memberof ClusterInfo
         */
        Version?: ObjectVersion;
        /**
         * Date and time at which the swarm was initialised in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
         * @type {string}
         * @memberof ClusterInfo
         */
        CreatedAt?: string;
        /**
         * Date and time at which the swarm was last updated in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
         * @type {string}
         * @memberof ClusterInfo
         */
        UpdatedAt?: string;
        /**
         *
         * @type {SwarmSpec}
         * @memberof ClusterInfo
         */
        Spec?: SwarmSpec;
        /**
         *
         * @type {TLSInfo}
         * @memberof ClusterInfo
         */
        TLSInfo?: TLSInfo;
        /**
         * Whether there is currently a root CA rotation in progress for the swarm
         * @type {boolean}
         * @memberof ClusterInfo
         */
        RootRotationInProgress?: boolean;
    }


    /**
     * Information about the issuer of leaf TLS certificates and the trusted root CA certificate
     * @export
     * @interface TLSInfo
     */
    export interface TLSInfo {
        /**
         * The root CA certificate(s) that are used to validate leaf TLS certificates
         * @type {string}
         * @memberof TLSInfo
         */
        TrustRoot?: string;
        /**
         * The base64-url-safe-encoded raw subject bytes of the issuer
         * @type {string}
         * @memberof TLSInfo
         */
        CertIssuerSubject?: string;
        /**
         * The base64-url-safe-encoded raw public key bytes of the issuer
         * @type {string}
         * @memberof TLSInfo
         */
        CertIssuerPublicKey?: string;
    }

    /**
     * User modifiable swarm configuration.
     * @export
     * @interface SwarmSpec
     */
    export interface SwarmSpec {
        /**
         * Name of the swarm.
         * @type {string}
         * @memberof SwarmSpec
         */
        Name?: string;
        /**
         * User-defined key/value metadata.
         * @type {{ [key: string]: string; }}
         * @memberof SwarmSpec
         */
        Labels?: {
            [key: string]: string;
        };
        /**
         *
         * @type {SwarmSpecOrchestration}
         * @memberof SwarmSpec
         */
        Orchestration?: SwarmSpecOrchestration;
        /**
         *
         * @type {SwarmSpecRaft}
         * @memberof SwarmSpec
         */
        Raft?: SwarmSpecRaft;
        /**
         *
         * @type {SwarmSpecDispatcher}
         * @memberof SwarmSpec
         */
        Dispatcher?: SwarmSpecDispatcher;
        /**
         *
         * @type {SwarmSpecCAConfig}
         * @memberof SwarmSpec
         */
        CAConfig?: SwarmSpecCAConfig;
        /**
         *
         * @type {SwarmSpecEncryptionConfig}
         * @memberof SwarmSpec
         */
        EncryptionConfig?: SwarmSpecEncryptionConfig;
        /**
         *
         * @type {SwarmSpecTaskDefaults}
         * @memberof SwarmSpec
         */
        TaskDefaults?: SwarmSpecTaskDefaults;
    }
    /**
     * CA configuration.
     * @export
     * @interface SwarmSpecCAConfig
     */
    export interface SwarmSpecCAConfig {
        /**
         * The duration node certificates are issued for.
         * @type {number}
         * @memberof SwarmSpecCAConfig
         */
        NodeCertExpiry?: number;
        /**
         * Configuration for forwarding signing requests to an external certificate authority.
         * @type {Array&lt;SwarmSpecCAConfigExternalCAs&gt;}
         * @memberof SwarmSpecCAConfig
         */
        ExternalCAs?: Array<SwarmSpecCAConfigExternalCAs>;
        /**
         * The desired signing CA certificate for all swarm node TLS leaf certificates, in PEM format.
         * @type {string}
         * @memberof SwarmSpecCAConfig
         */
        SigningCACert?: string;
        /**
         * The desired signing CA key for all swarm node TLS leaf certificates, in PEM format.
         * @type {string}
         * @memberof SwarmSpecCAConfig
         */
        SigningCAKey?: string;
        /**
         * An integer whose purpose is to force swarm to generate a new signing CA certificate and key, if none have been specified in `SigningCACert` and `SigningCAKey`
         * @type {number}
         * @memberof SwarmSpecCAConfig
         */
        ForceRotate?: number;
    }
    /**
     *
     * @export
     * @interface SwarmSpecCAConfigExternalCAs
     */
    export interface SwarmSpecCAConfigExternalCAs {
        /**
         * Protocol for communication with the external CA (currently only `cfssl` is supported).
         * @type {string}
         * @memberof SwarmSpecCAConfigExternalCAs
         */
        Protocol?: SwarmSpecCAConfigExternalCAs.ProtocolEnum;
        /**
         * URL where certificate signing requests should be sent.
         * @type {string}
         * @memberof SwarmSpecCAConfigExternalCAs
         */
        URL?: string;
        /**
         * An object with key/value pairs that are interpreted as protocol-specific options for the external CA driver.
         * @type {{ [key: string]: string; }}
         * @memberof SwarmSpecCAConfigExternalCAs
         */
        Options?: {
            [key: string]: string;
        };
        /**
         * The root CA certificate (in PEM format) this external CA uses to issue TLS certificates (assumed to be to the current swarm root CA certificate if not provided).
         * @type {string}
         * @memberof SwarmSpecCAConfigExternalCAs
         */
        CACert?: string;
    }
    /**
     * @export
     * @namespace SwarmSpecCAConfigExternalCAs
     */
    export namespace SwarmSpecCAConfigExternalCAs {
        /**
         * @export
         * @enum {string}
         */
        enum ProtocolEnum {
            Cfssl,
        }
    }
    /**
     * Dispatcher configuration.
     * @export
     * @interface SwarmSpecDispatcher
     */
    export interface SwarmSpecDispatcher {
        /**
         * The delay for an agent to send a heartbeat to the dispatcher.
         * @type {number}
         * @memberof SwarmSpecDispatcher
         */
        HeartbeatPeriod?: number;
    }
    /**
     * Parameters related to encryption-at-rest.
     * @export
     * @interface SwarmSpecEncryptionConfig
     */
    export interface SwarmSpecEncryptionConfig {
        /**
         * If set, generate a key and use it to lock data stored on the managers.
         * @type {boolean}
         * @memberof SwarmSpecEncryptionConfig
         */
        AutoLockManagers?: boolean;
    }
    /**
     * Orchestration configuration.
     * @export
     * @interface SwarmSpecOrchestration
     */
    export interface SwarmSpecOrchestration {
        /**
         * The number of historic tasks to keep per instance or node. If negative, never remove completed or failed tasks.
         * @type {number}
         * @memberof SwarmSpecOrchestration
         */
        TaskHistoryRetentionLimit?: number;
    }
    /**
     * Raft configuration.
     * @export
     * @interface SwarmSpecRaft
     */
    export interface SwarmSpecRaft {
        /**
         * The number of log entries between snapshots.
         * @type {number}
         * @memberof SwarmSpecRaft
         */
        SnapshotInterval?: number;
        /**
         * The number of snapshots to keep beyond the current snapshot.
         * @type {number}
         * @memberof SwarmSpecRaft
         */
        KeepOldSnapshots?: number;
        /**
         * The number of log entries to keep around to sync up slow followers after a snapshot is created.
         * @type {number}
         * @memberof SwarmSpecRaft
         */
        LogEntriesForSlowFollowers?: number;
        /**
         * The number of ticks that a follower will wait for a message from the leader before becoming a candidate and starting an election. `ElectionTick` must be greater than `HeartbeatTick`.  A tick currently defaults to one second, so these translate directly to seconds currently, but this is NOT guaranteed.
         * @type {number}
         * @memberof SwarmSpecRaft
         */
        ElectionTick?: number;
        /**
         * The number of ticks between heartbeats. Every HeartbeatTick ticks, the leader will send a heartbeat to the followers.  A tick currently defaults to one second, so these translate directly to seconds currently, but this is NOT guaranteed.
         * @type {number}
         * @memberof SwarmSpecRaft
         */
        HeartbeatTick?: number;
    }
    /**
     * Defaults for creating tasks in this cluster.
     * @export
     * @interface SwarmSpecTaskDefaults
     */
    export interface SwarmSpecTaskDefaults {
        /**
         *
         * @type {SwarmSpecTaskDefaultsLogDriver}
         * @memberof SwarmSpecTaskDefaults
         */
        LogDriver?: SwarmSpecTaskDefaultsLogDriver;
    }
    /**
     * The log driver to use for tasks created in the orchestrator if unspecified by a service.  Updating this value only affects new tasks. Existing tasks continue to use their previously configured log driver until recreated.
     * @export
     * @interface SwarmSpecTaskDefaultsLogDriver
     */
    export interface SwarmSpecTaskDefaultsLogDriver {
        /**
         * The log driver to use as a default for new tasks.
         * @type {string}
         * @memberof SwarmSpecTaskDefaultsLogDriver
         */
        Name?: string;
        /**
         * Driver-specific options for the selectd log driver, specified as key/value pairs.
         * @type {{ [key: string]: string; }}
         * @memberof SwarmSpecTaskDefaultsLogDriver
         */
        Options?: {
            [key: string]: string;
        };
    }


    /**
     * @export
     * @namespace SystemInfo
     */
    export namespace SystemInfo {
        /**
         * @export
         * @enum {string}
         */
        enum CgroupDriverEnum {
            Cgroupfs,
            Systemd,
        }
        /**
         * @export
         * @enum {string}
         */
        enum IsolationEnum {
            Default,
            Hyperv,
            Process,
        }
    }


    /**
     * Runtime describes an [OCI compliant](https://github.com/opencontainers/runtime-spec) runtime.  The runtime is invoked by the daemon via the `containerd` daemon. OCI runtimes act as an interface to the Linux kernel namespaces, cgroups, and SELinux.
     * @export
     * @interface Runtime
     */
    export interface Runtime {
        /**
         * Name and, optional, path, of the OCI executable binary.  If the path is omitted, the daemon searches the host's `$PATH` for the binary and uses the first result.
         * @type {string}
         * @memberof Runtime
         */
        path?: string;
        /**
         * List of command-line arguments to pass to the runtime when invoked.
         * @type {Array&lt;string&gt;}
         * @memberof Runtime
         */
        runtimeArgs?: Array<string>;
    }


    /**
     * User-defined resources can be either Integer resources (e.g, `SSD=3`) or String resources (e.g, `GPU=UUID1`)
     * @export
     * @interface GenericResources
     */
    export interface GenericResources extends Array<GenericResourcesInner> {
    }

    /**
     *
     * @export
     * @interface GenericResourcesInner
     */
    export interface GenericResourcesInner {
        /**
         *
         * @type {GenericResourcesInnerNamedResourceSpec}
         * @memberof GenericResourcesInner
         */
        NamedResourceSpec?: GenericResourcesInnerNamedResourceSpec;
        /**
         *
         * @type {GenericResourcesInnerDiscreteResourceSpec}
         * @memberof GenericResourcesInner
         */
        DiscreteResourceSpec?: GenericResourcesInnerDiscreteResourceSpec;
    }
    /**
     *
     * @export
     * @interface GenericResourcesInnerDiscreteResourceSpec
     */
    export interface GenericResourcesInnerDiscreteResourceSpec {
        /**
         *
         * @type {string}
         * @memberof GenericResourcesInnerDiscreteResourceSpec
         */
        Kind?: string;
        /**
         *
         * @type {number}
         * @memberof GenericResourcesInnerDiscreteResourceSpec
         */
        Value?: number;
    }
    /**
     *
     * @export
     * @interface GenericResourcesInnerNamedResourceSpec
     */
    export interface GenericResourcesInnerNamedResourceSpec {
        /**
         *
         * @type {string}
         * @memberof GenericResourcesInnerNamedResourceSpec
         */
        Kind?: string;
        /**
         *
         * @type {string}
         * @memberof GenericResourcesInnerNamedResourceSpec
         */
        Value?: string;
    }

    export interface DockerEvent {
        /**
         * The type of object emitting the event
         * @type {string}
         * @memberof DockerEvent
         */
        Type?: string;
        /**
         * The type of event
         * @type {string}
         * @memberof DockerEvent
         */
        Action?: string;
        /**
         *
         * @type {DockerEventActor}
         * @memberof DockerEvent
         */
        Actor?: DockerEventActor;
        /**
         * Timestamp of event
         * @type {number}
         * @memberof DockerEvent
         */
        time?: number;
        /**
         * Timestamp of event, with nanosecond accuracy
         * @type {number}
         * @memberof DockerEvent
         */
        timeNano?: number;
    }

    /**
     *
     * @export
     * @interface DockerEventActor
     */
    export interface DockerEventActor {
        /**
         * The ID of the object emitting the event
         * @type {string}
         * @memberof DockerEventActor
         */
        ID?: string;
        /**
         * Various key/value attributes of the object, depending on its type
         * @type {{ [key: string]: string; }}
         * @memberof DockerEventActor
         */
        Attributes?: {
            [key: string]: string;
        };
    }
}