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
        Type: string;
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
        CgroupDriver?: string;
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
        Isolation?: string;
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
        LocalNodeState?: string;
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
        Protocol?: string;
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

    export interface SystemDfResponse {
        /**
         *
         * @type {number}
         * @memberof SystemDfResponse
         */
        LayersSize?: number;
        /**
         *
         * @type {Array&lt;ImageSummary&gt;}
         * @memberof SystemDfResponse
         */
        Images?: Array<ImageSummary>;
        /**
         *
         * @type {Array&lt;ContainerSummary&gt;}
         * @memberof SystemDfResponse
         */
        Containers?: Array<ContainerInfo>;
        /**
         *
         * @type {Array&lt;Volume&gt;}
         * @memberof SystemDfResponse
         */
        Volumes?: Array<VolumeInfo>;
        /**
         *
         * @type {number}
         * @memberof SystemDfResponse
         */
        BuilderSize?: number;
    }


    /**
     *
     * @export
     * @interface ImageSummary
     */
    export interface ImageSummary {
        /**
         *
         * @type {string}
         * @memberof ImageSummary
         */
        Id: string;
        /**
         *
         * @type {string}
         * @memberof ImageSummary
         */
        ParentId: string;
        /**
         *
         * @type {Array&lt;string&gt;}
         * @memberof ImageSummary
         */
        RepoTags: Array<string>;
        /**
         *
         * @type {Array&lt;string&gt;}
         * @memberof ImageSummary
         */
        RepoDigests: Array<string>;
        /**
         *
         * @type {number}
         * @memberof ImageSummary
         */
        Created: number;
        /**
         *
         * @type {number}
         * @memberof ImageSummary
         */
        Size: number;
        /**
         *
         * @type {number}
         * @memberof ImageSummary
         */
        SharedSize: number;
        /**
         *
         * @type {number}
         * @memberof ImageSummary
         */
        VirtualSize: number;
        /**
         *
         * @type {{ [key: string]: string; }}
         * @memberof ImageSummary
         */
        Labels: {
            [key: string]: string;
        };
        /**
         *
         * @type {number}
         * @memberof ImageSummary
         */
        Containers: number;
    }


    /**
     *
     * @export
     * @interface VolumeInfo
     */
    export interface VolumeInfo {
        /**
         * Name of the volume.
         * @type {string}
         * @memberof VolumeInfo
         */
        Name: string;
        /**
         * Name of the volume driver used by the volume.
         * @type {string}
         * @memberof VolumeInfo
         */
        Driver: string;
        /**
         * Mount path of the volume on the host.
         * @type {string}
         * @memberof VolumeInfo
         */
        Mountpoint: string;
        /**
         * Date/Time the volume was created.
         * @type {string}
         * @memberof VolumeInfo
         */
        CreatedAt?: string;
        /**
         * Low-level details about the volume, provided by the volume driver. Details are returned as a map with key/value pairs: `{\"key\":\"value\",\"key2\":\"value2\"}`.  The `Status` field is optional, and is omitted if the volume driver does not support this feature.
         * @type {{ [key: string]: any; }}
         * @memberof VolumeInfo
         */
        Status?: {
            [key: string]: any;
        };
        /**
         * User-defined key/value metadata.
         * @type {{ [key: string]: string; }}
         * @memberof VolumeInfo
         */
        Labels: {
            [key: string]: string;
        };
        /**
         * The level at which the volume exists. Either `global` for cluster-wide, or `local` for machine level.
         * @type {string}
         * @memberof VolumeInfo
         */
        Scope: string;
        /**
         * The driver specific options used when creating the volume.
         * @type {{ [key: string]: string; }}
         * @memberof VolumeInfo
         */
        Options: {
            [key: string]: string;
        };
        /**
         *
         * @type {VolumeUsageData}
         * @memberof VolumeInfo
         */
        UsageData?: VolumeUsageData;
    }

    /**
     * Usage details about the volume. This information is used by the `GET /system/df` endpoint, and omitted in other endpoints.
     * @export
     * @interface VolumeUsageData
     */
    export interface VolumeUsageData {
        /**
         * Amount of disk space used by the volume (in bytes). This information is only available for volumes created with the `\"local\"` volume driver. For volumes created with other volume drivers, this field is set to `-1` (\"not available\")
         * @type {number}
         * @memberof VolumeUsageData
         */
        Size: number;
        /**
         * The number of containers referencing this volume. This field is set to `-1` if the reference-count is not available.
         * @type {number}
         * @memberof VolumeUsageData
         */
        RefCount: number;
    }

    /**
     *
     * @export
     * @interface ExecConfig
     */
    export interface ExecConfig {
        /**
         * Attach to `stdin` of the exec command.
         * @type {boolean}
         * @memberof ExecConfig
         */
        AttachStdin?: boolean;
        /**
         * Attach to `stdout` of the exec command.
         * @type {boolean}
         * @memberof ExecConfig
         */
        AttachStdout?: boolean;
        /**
         * Attach to `stderr` of the exec command.
         * @type {boolean}
         * @memberof ExecConfig
         */
        AttachStderr?: boolean;
        /**
         * Override the key sequence for detaching a container. Format is a single character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
         * @type {string}
         * @memberof ExecConfig
         */
        DetachKeys?: string;
        /**
         * Allocate a pseudo-TTY.
         * @type {boolean}
         * @memberof ExecConfig
         */
        Tty?: boolean;
        /**
         * A list of environment variables in the form `[\"VAR=value\", ...]`.
         * @type {Array&lt;string&gt;}
         * @memberof ExecConfig
         */
        Env?: Array<string>;
        /**
         * Command to run, as a string or array of strings.
         * @type {Array&lt;string&gt;}
         * @memberof ExecConfig
         */
        Cmd?: Array<string>;
        /**
         * Runs the exec process with extended privileges.
         * @type {boolean}
         * @memberof ExecConfig
         */
        Privileged?: boolean;
        /**
         * The user, and optionally, group to run the exec process inside the container. Format is one of: `user`, `user:group`, `uid`, or `uid:gid`.
         * @type {string}
         * @memberof ExecConfig
         */
        User?: string;
    }

    /**
     *
     * @export
     * @interface ContainerCreateBody
     */
    export interface ContainerCreateBody {
        /**
         * The hostname to use for the container, as a valid RFC 1123 hostname.
         * @type {string}
         * @memberof ContainerCreateBody
         */
        Hostname?: string;
        /**
         * The domain name to use for the container.
         * @type {string}
         * @memberof ContainerCreateBody
         */
        Domainname?: string;
        /**
         * The user that commands are run as inside the container.
         * @type {string}
         * @memberof ContainerCreateBody
         */
        User?: string;
        /**
         * Whether to attach to `stdin`.
         * @type {boolean}
         * @memberof ContainerCreateBody
         */
        AttachStdin?: boolean;
        /**
         * Whether to attach to `stdout`.
         * @type {boolean}
         * @memberof ContainerCreateBody
         */
        AttachStdout?: boolean;
        /**
         * Whether to attach to `stderr`.
         * @type {boolean}
         * @memberof ContainerCreateBody
         */
        AttachStderr?: boolean;
        /**
         * An object mapping ports to an empty object in the form:  `{\"<port>/<tcp|udp>\": {}}`
         * @type {{ [key: string]: any; }}
         * @memberof ContainerCreateBody
         */
        ExposedPorts?: {
            [key: string]: any;
        };
        /**
         * Attach standard streams to a TTY, including `stdin` if it is not closed.
         * @type {boolean}
         * @memberof ContainerCreateBody
         */
        Tty?: boolean;
        /**
         * Open `stdin`
         * @type {boolean}
         * @memberof ContainerCreateBody
         */
        OpenStdin?: boolean;
        /**
         * Close `stdin` after one attached client disconnects
         * @type {boolean}
         * @memberof ContainerCreateBody
         */
        StdinOnce?: boolean;
        /**
         * A list of environment variables to set inside the container in the form `[\"VAR=value\", ...]`. A variable without `=` is removed from the environment, rather than to have an empty value.
         * @type {Array&lt;string&gt;}
         * @memberof ContainerCreateBody
         */
        Env?: Array<string>;
        /**
         * Command to run specified as a string or an array of strings.
         * @type {Array&lt;string&gt;}
         * @memberof ContainerCreateBody
         */
        Cmd?: Array<string>;
        /**
         *
         * @type {HealthConfig}
         * @memberof ContainerCreateBody
         */
        Healthcheck?: HealthConfig;
        /**
         * Command is already escaped (Windows only)
         * @type {boolean}
         * @memberof ContainerCreateBody
         */
        ArgsEscaped?: boolean;
        /**
         * The name of the image to use when creating the container
         * @type {string}
         * @memberof ContainerCreateBody
         */
        Image?: string;
        /**
         *
         * @type {ContainerConfigVolumes}
         * @memberof ContainerCreateBody
         */
        Volumes?: ContainerConfigVolumes;
        /**
         * The working directory for commands to run in.
         * @type {string}
         * @memberof ContainerCreateBody
         */
        WorkingDir?: string;
        /**
         * The entry point for the container as a string or an array of strings.  If the array consists of exactly one empty string (`[\"\"]`) then the entry point is reset to system default (i.e., the entry point used by docker when there is no `ENTRYPOINT` instruction in the `Dockerfile`).
         * @type {Array&lt;string&gt;}
         * @memberof ContainerCreateBody
         */
        Entrypoint?: Array<string>;
        /**
         * Disable networking for the container.
         * @type {boolean}
         * @memberof ContainerCreateBody
         */
        NetworkDisabled?: boolean;
        /**
         * MAC address of the container.
         * @type {string}
         * @memberof ContainerCreateBody
         */
        MacAddress?: string;
        /**
         * `ONBUILD` metadata that were defined in the image's `Dockerfile`.
         * @type {Array&lt;string&gt;}
         * @memberof ContainerCreateBody
         */
        OnBuild?: Array<string>;
        /**
         * User-defined key/value metadata.
         * @type {{ [key: string]: string; }}
         * @memberof ContainerCreateBody
         */
        Labels?: {
            [key: string]: string;
        };
        /**
         * Signal to stop a container as a string or unsigned integer.
         * @type {string}
         * @memberof ContainerCreateBody
         */
        StopSignal?: string;
        /**
         * Timeout to stop a container in seconds.
         * @type {number}
         * @memberof ContainerCreateBody
         */
        StopTimeout?: number;
        /**
         * Shell for when `RUN`, `CMD`, and `ENTRYPOINT` uses a shell.
         * @type {Array&lt;string&gt;}
         * @memberof ContainerCreateBody
         */
        Shell?: Array<string>;
        /**
         *
         * @type {HostConfig}
         * @memberof ContainerCreateBody
         */
        HostConfig?: ContainerCreateBodyHostConfig;
        /**
         *
         * @type {ContainerCreateBodyNetworkingConfig}
         * @memberof ContainerCreateBody
         */
        NetworkingConfig?: ContainerCreateBodyNetworkingConfig;

        /** Container Name */
        name?: string
    }

    /**
     * An object mapping mount point paths inside the container to empty objects.
     * @export
     * @interface ContainerConfigVolumes
     */
    export interface ContainerConfigVolumes {
        /**
         *
         * @type {any}
         * @memberof ContainerConfigVolumes
         */
        additionalProperties?: any;
    }

    /**
     * A test to perform to check that the container is healthy.
     * @export
     * @interface HealthConfig
     */
    export interface HealthConfig {
        /**
         * The test to perform. Possible values are:  - `[]` inherit healthcheck from image or parent image - `[\"NONE\"]` disable healthcheck - `[\"CMD\", args...]` exec arguments directly - `[\"CMD-SHELL\", command]` run command with system's default shell
         * @type {Array&lt;string&gt;}
         * @memberof HealthConfig
         */
        Test?: Array<string>;
        /**
         * The time to wait between checks in nanoseconds. It should be 0 or at least 1000000 (1 ms). 0 means inherit.
         * @type {number}
         * @memberof HealthConfig
         */
        Interval?: number;
        /**
         * The time to wait before considering the check to have hung. It should be 0 or at least 1000000 (1 ms). 0 means inherit.
         * @type {number}
         * @memberof HealthConfig
         */
        Timeout?: number;
        /**
         * The number of consecutive failures needed to consider a container as unhealthy. 0 means inherit.
         * @type {number}
         * @memberof HealthConfig
         */
        Retries?: number;
        /**
         * Start period for the container to initialize before starting health-retries countdown in nanoseconds. It should be 0 or at least 1000000 (1 ms). 0 means inherit.
         * @type {number}
         * @memberof HealthConfig
         */
        StartPeriod?: number;
    }

    /**
     * This container's networking configuration.
     * @export
     * @interface ContainerCreateBodyNetworkingConfig
     */
    export interface ContainerCreateBodyNetworkingConfig {
        /**
         * A mapping of network name to endpoint configuration for that network.
         * @type {{ [key: string]: EndpointSettings; }}
         * @memberof ContainerCreateBodyNetworkingConfig
         */
        EndpointsConfig?: {
            [key: string]: EndpointSettings;
        };
    }

    /**
     * Configuration for a network endpoint.
     * @export
     * @interface EndpointSettings
     */
    export interface EndpointSettings {
        /**
         *
         * @type {EndpointIPAMConfig}
         * @memberof EndpointSettings
         */
        IPAMConfig?: EndpointIPAMConfig;
        /**
         *
         * @type {Array&lt;string&gt;}
         * @memberof EndpointSettings
         */
        Links?: Array<string>;
        /**
         *
         * @type {Array&lt;string&gt;}
         * @memberof EndpointSettings
         */
        Aliases?: Array<string>;
        /**
         * Unique ID of the network.
         * @type {string}
         * @memberof EndpointSettings
         */
        NetworkID?: string;
        /**
         * Unique ID for the service endpoint in a Sandbox.
         * @type {string}
         * @memberof EndpointSettings
         */
        EndpointID?: string;
        /**
         * Gateway address for this network.
         * @type {string}
         * @memberof EndpointSettings
         */
        Gateway?: string;
        /**
         * IPv4 address.
         * @type {string}
         * @memberof EndpointSettings
         */
        IPAddress?: string;
        /**
         * Mask length of the IPv4 address.
         * @type {number}
         * @memberof EndpointSettings
         */
        IPPrefixLen?: number;
        /**
         * IPv6 gateway address.
         * @type {string}
         * @memberof EndpointSettings
         */
        IPv6Gateway?: string;
        /**
         * Global IPv6 address.
         * @type {string}
         * @memberof EndpointSettings
         */
        GlobalIPv6Address?: string;
        /**
         * Mask length of the global IPv6 address.
         * @type {number}
         * @memberof EndpointSettings
         */
        GlobalIPv6PrefixLen?: number;
        /**
         * MAC address for the endpoint on this network.
         * @type {string}
         * @memberof EndpointSettings
         */
        MacAddress?: string;
        /**
         * DriverOpts is a mapping of driver options and values. These options are passed directly to the driver and are driver specific.
         * @type {{ [key: string]: string; }}
         * @memberof EndpointSettings
         */
        DriverOpts?: {
            [key: string]: string;
        };
    }

    /**
     * Container configuration that depends on the host we are running on
     * @export
     * @interface HostConfig
     */
    export interface ContainerCreateBodyHostConfig {
        /**
         * An integer value representing this container's relative CPU weight versus other containers.
         * @type {number}
         * @memberof HostConfig
         */
        CpuShares?: number;
        /**
         * Memory limit in bytes.
         * @type {number}
         * @memberof HostConfig
         */
        Memory?: number;
        /**
         * Path to `cgroups` under which the container's `cgroup` is created. If the path is not absolute, the path is considered to be relative to the `cgroups` path of the init process. Cgroups are created if they do not already exist.
         * @type {string}
         * @memberof HostConfig
         */
        CgroupParent?: string;
        /**
         * Block IO weight (relative weight).
         * @type {number}
         * @memberof HostConfig
         */
        BlkioWeight?: number;
        /**
         * Block IO weight (relative device weight) in the form `[{\"Path\": \"device_path\", \"Weight\": weight}]`.
         * @type {Array&lt;ResourcesBlkioWeightDevice&gt;}
         * @memberof HostConfig
         */
        BlkioWeightDevice?: Array<ResourcesBlkioWeightDevice>;
        /**
         * Limit read rate (bytes per second) from a device, in the form `[{\"Path\": \"device_path\", \"Rate\": rate}]`.
         * @type {Array&lt;ThrottleDevice&gt;}
         * @memberof HostConfig
         */
        BlkioDeviceReadBps?: Array<ThrottleDevice>;
        /**
         * Limit write rate (bytes per second) to a device, in the form `[{\"Path\": \"device_path\", \"Rate\": rate}]`.
         * @type {Array&lt;ThrottleDevice&gt;}
         * @memberof HostConfig
         */
        BlkioDeviceWriteBps?: Array<ThrottleDevice>;
        /**
         * Limit read rate (IO per second) from a device, in the form `[{\"Path\": \"device_path\", \"Rate\": rate}]`.
         * @type {Array&lt;ThrottleDevice&gt;}
         * @memberof HostConfig
         */
        BlkioDeviceReadIOps?: Array<ThrottleDevice>;
        /**
         * Limit write rate (IO per second) to a device, in the form `[{\"Path\": \"device_path\", \"Rate\": rate}]`.
         * @type {Array&lt;ThrottleDevice&gt;}
         * @memberof HostConfig
         */
        BlkioDeviceWriteIOps?: Array<ThrottleDevice>;
        /**
         * The length of a CPU period in microseconds.
         * @type {number}
         * @memberof HostConfig
         */
        CpuPeriod?: number;
        /**
         * Microseconds of CPU time that the container can get in a CPU period.
         * @type {number}
         * @memberof HostConfig
         */
        CpuQuota?: number;
        /**
         * The length of a CPU real-time period in microseconds. Set to 0 to allocate no time allocated to real-time tasks.
         * @type {number}
         * @memberof HostConfig
         */
        CpuRealtimePeriod?: number;
        /**
         * The length of a CPU real-time runtime in microseconds. Set to 0 to allocate no time allocated to real-time tasks.
         * @type {number}
         * @memberof HostConfig
         */
        CpuRealtimeRuntime?: number;
        /**
         * CPUs in which to allow execution (e.g., `0-3`, `0,1`)
         * @type {string}
         * @memberof HostConfig
         */
        CpusetCpus?: string;
        /**
         * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only effective on NUMA systems.
         * @type {string}
         * @memberof HostConfig
         */
        CpusetMems?: string;
        /**
         * A list of devices to add to the container.
         * @type {Array&lt;DeviceMapping&gt;}
         * @memberof HostConfig
         */
        Devices?: Array<DeviceMapping>;
        /**
         * a list of cgroup rules to apply to the container
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        DeviceCgroupRules?: Array<string>;
        /**
         * Disk limit (in bytes).
         * @type {number}
         * @memberof HostConfig
         */
        DiskQuota?: number;
        /**
         * Kernel memory limit in bytes.
         * @type {number}
         * @memberof HostConfig
         */
        KernelMemory?: number;
        /**
         * Memory soft limit in bytes.
         * @type {number}
         * @memberof HostConfig
         */
        MemoryReservation?: number;
        /**
         * Total memory limit (memory + swap). Set as `-1` to enable unlimited swap.
         * @type {number}
         * @memberof HostConfig
         */
        MemorySwap?: number;
        /**
         * Tune a container's memory swappiness behavior. Accepts an integer between 0 and 100.
         * @type {number}
         * @memberof HostConfig
         */
        MemorySwappiness?: number;
        /**
         * CPU quota in units of 10<sup>-9</sup> CPUs.
         * @type {number}
         * @memberof HostConfig
         */
        NanoCPUs?: number;
        /**
         * Disable OOM Killer for the container.
         * @type {boolean}
         * @memberof HostConfig
         */
        OomKillDisable?: boolean;
        /**
         * Tune a container's pids limit. Set -1 for unlimited.
         * @type {number}
         * @memberof HostConfig
         */
        PidsLimit?: number;
        /**
         * A list of resource limits to set in the container. For example: `{\"Name\": \"nofile\", \"Soft\": 1024, \"Hard\": 2048}`\"
         * @type {Array&lt;ResourcesUlimits&gt;}
         * @memberof HostConfig
         */
        Ulimits?: Array<ResourcesUlimits>;
        /**
         * The number of usable CPUs (Windows only).  On Windows Server containers, the processor resource controls are mutually exclusive. The order of precedence is `CPUCount` first, then `CPUShares`, and `CPUPercent` last.
         * @type {number}
         * @memberof HostConfig
         */
        CpuCount?: number;
        /**
         * The usable percentage of the available CPUs (Windows only).  On Windows Server containers, the processor resource controls are mutually exclusive. The order of precedence is `CPUCount` first, then `CPUShares`, and `CPUPercent` last.
         * @type {number}
         * @memberof HostConfig
         */
        CpuPercent?: number;
        /**
         * Maximum IOps for the container system drive (Windows only)
         * @type {number}
         * @memberof HostConfig
         */
        IOMaximumIOps?: number;
        /**
         * Maximum IO in bytes per second for the container system drive (Windows only)
         * @type {number}
         * @memberof HostConfig
         */
        IOMaximumBandwidth?: number;
        /**
         * A list of volume bindings for this container. Each volume binding is a string in one of these forms:  
         * - `host-src:container-dest` to bind-mount a host path into the container. 
         * Both `host-src`, and `container-dest` must be an _absolute_ path. - `host-src:container-dest:ro` 
         * to make the bind mount read-only inside the container. Both `host-src`, and `container-dest` 
         * must be an _absolute_ path. - `volume-name:container-dest` to bind-mount a volume managed by 
         * a volume driver into the container. `container-dest` must be an _absolute_ path.
         *  - `volume-name:container-dest:ro` to mount the volume read-only inside the container. 
         *  `container-dest` must be an _absolute_ path.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        Binds?: Array<string>;
        /**
         * Path to a file where the container ID is written
         * @type {string}
         * @memberof HostConfig
         */
        ContainerIDFile?: string;
        /**
         *
         * @type {HostConfigLogConfig}
         * @memberof HostConfig
         */
        LogConfig?: HostConfigLogConfig;
        /**
         * Network mode to use for this container. Supported standard values are: `bridge`, `host`, 
         * `none`, and `container:<name|id>`. Any other value is taken as a custom network's 
         * name to which this container should connect to.
         * @type {string}
         * @memberof HostConfig
         */
        NetworkMode?: string;
        /**
         * A map of exposed container ports and the host port they should map to.
         * @type {{ [key: string]: HostConfigPortBindings; }}
         * @memberof HostConfig
         */
        PortBindings?: {
            [key: string]: HostConfigPortBindings;
        };
        /**
         *
         * @type {RestartPolicy}
         * @memberof HostConfig
         */
        RestartPolicy?: RestartPolicy;
        /**
         * Automatically remove the container when the container's process exits. This has no effect if `RestartPolicy` is set.
         * @type {boolean}
         * @memberof HostConfig
         */
        AutoRemove?: boolean;
        /**
         * Driver that this container uses to mount volumes.
         * @type {string}
         * @memberof HostConfig
         */
        VolumeDriver?: string;
        /**
         * A list of volumes to inherit from another container, specified in the form `<container name>[:<ro|rw>]`.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        VolumesFrom?: Array<string>;
        /**
         * Specification for mounts to be added to the container.
         * @type {Array&lt;Mount&gt;}
         * @memberof HostConfig
         */
        Mounts?: Array<ContainerCreateBodyMount>;
        /**
         * A list of kernel capabilities to add to the container.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        CapAdd?: Array<string>;
        /**
         * A list of kernel capabilities to drop from the container.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        CapDrop?: Array<string>;
        /**
         * A list of DNS servers for the container to use.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        Dns?: Array<string>;
        /**
         * A list of DNS options.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        DnsOptions?: Array<string>;
        /**
         * A list of DNS search domains.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        DnsSearch?: Array<string>;
        /**
         * A list of hostnames/IP mappings to add to the container's `/etc/hosts` file. Specified in the form `[\"hostname:IP\"]`.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        ExtraHosts?: Array<string>;
        /**
         * A list of additional groups that the container process will run as.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        GroupAdd?: Array<string>;
        /**
         * IPC sharing mode for the container. Possible values are:  - `\"none\"`: own private IPC namespace, with /dev/shm not mounted - `\"private\"`: own private IPC namespace - `\"shareable\"`: own private IPC namespace, with a possibility to share it with other containers - `\"container:<name|id>\"`: join another (shareable) container's IPC namespace - `\"host\"`: use the host system's IPC namespace  If not specified, daemon default is used, which can either be `\"private\"` or `\"shareable\"`, depending on daemon version and configuration.
         * @type {string}
         * @memberof HostConfig
         */
        IpcMode?: string;
        /**
         * Cgroup to use for the container.
         * @type {string}
         * @memberof HostConfig
         */
        Cgroup?: string;
        /**
         * A list of links for the container in the form `container_name:alias`.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        Links?: Array<string>;
        /**
         * An integer value containing the score given to the container in order to tune OOM killer preferences.
         * @type {number}
         * @memberof HostConfig
         */
        OomScoreAdj?: number;
        /**
         * Set the PID (Process) Namespace mode for the container. It can be either:  - `\"container:<name|id>\"`: joins another container's PID namespace - `\"host\"`: use the host's PID namespace inside the container
         * @type {string}
         * @memberof HostConfig
         */
        PidMode?: string;
        /**
         * Gives the container full access to the host.
         * @type {boolean}
         * @memberof HostConfig
         */
        Privileged?: boolean;
        /**
         * Allocates a random host port for all of a container's exposed ports.
         * @type {boolean}
         * @memberof HostConfig
         */
        PublishAllPorts?: boolean;
        /**
         * Mount the container's root filesystem as read only.
         * @type {boolean}
         * @memberof HostConfig
         */
        ReadonlyRootfs?: boolean;
        /**
         * A list of string values to customize labels for MLS systems, such as SELinux.
         * @type {Array&lt;string&gt;}
         * @memberof HostConfig
         */
        SecurityOpt?: Array<string>;
        /**
         * Storage driver options for this container, in the form `{\"size\": \"120G\"}`.
         * @type {{ [key: string]: string; }}
         * @memberof HostConfig
         */
        StorageOpt?: {
            [key: string]: string;
        };
        /**
         * A map of container directories which should be replaced by tmpfs mounts, and their corresponding mount options. For example: `{ \"/run\": \"rw,noexec,nosuid,size=65536k\" }`.
         * @type {{ [key: string]: string; }}
         * @memberof HostConfig
         */
        Tmpfs?: {
            [key: string]: string;
        };
        /**
         * UTS namespace to use for the container.
         * @type {string}
         * @memberof HostConfig
         */
        UTSMode?: string;
        /**
         * Sets the usernamespace mode for the container when usernamespace remapping option is enabled.
         * @type {string}
         * @memberof HostConfig
         */
        UsernsMode?: string;
        /**
         * Size of `/dev/shm` in bytes. If omitted, the system uses 64MB.
         * @type {number}
         * @memberof HostConfig
         */
        ShmSize?: number;
        /**
         * A list of kernel parameters (sysctls) to set in the container. For example: `{\"net.ipv4.ip_forward\": \"1\"}`
         * @type {{ [key: string]: string; }}
         * @memberof HostConfig
         */
        Sysctls?: {
            [key: string]: string;
        };
        /**
         * Runtime to use with this container.
         * @type {string}
         * @memberof HostConfig
         */
        Runtime?: string;
        /**
         * Initial console size, as an `[height, width]` array. (Windows only)
         * @type {Array&lt;number&gt;}
         * @memberof HostConfig
         */
        ConsoleSize?: Array<number>;
        /**
         * Isolation technology of the container. (Windows only)
         * @type {string}
         * @memberof HostConfig
         */
        Isolation?: string;
    }
    /**
     *
     * @export
     * @interface ResourcesBlkioWeightDevice
     */
    export interface ResourcesBlkioWeightDevice {
        /**
         *
         * @type {string}
         * @memberof ResourcesBlkioWeightDevice
         */
        Path?: string;
        /**
         *
         * @type {number}
         * @memberof ResourcesBlkioWeightDevice
         */
        Weight?: number;
    }


    /**
     *
     * @export
     * @interface ThrottleDevice
     */
    export interface ThrottleDevice {
        /**
         * Device path
         * @type {string}
         * @memberof ThrottleDevice
         */
        Path?: string;
        /**
         * Rate
         * @type {number}
         * @memberof ThrottleDevice
         */
        Rate?: number;
    }


    /**
     * A device mapping between the host and container
     * @export
     * @interface DeviceMapping
     */
    export interface DeviceMapping {
        /**
         *
         * @type {string}
         * @memberof DeviceMapping
         */
        PathOnHost?: string;
        /**
         *
         * @type {string}
         * @memberof DeviceMapping
         */
        PathInContainer?: string;
        /**
         *
         * @type {string}
         * @memberof DeviceMapping
         */
        CgroupPermissions?: string;
    }

    /**
     * The logging configuration for this container
     * @export
     * @interface HostConfigLogConfig
     */
    export interface HostConfigLogConfig {
        /**
         *
         * @type {string}
         * @memberof HostConfigLogConfig
         */
        Type?: string;
        /**
         *
         * @type {{ [key: string]: string; }}
         * @memberof HostConfigLogConfig
         */
        Config?: {
            [key: string]: string;
        };
    }


    /**
     * The behavior to apply when the container exits. The default is not to restart.  An ever increasing delay (double the previous delay, starting at 100ms) is added before each restart to prevent flooding the server.
     * @export
     * @interface RestartPolicy
     */
    export interface RestartPolicy {
        /**
         * - Empty string means not to restart - `always` Always restart - `unless-stopped` Restart always except when the user has manually stopped the container - `on-failure` Restart only when the container exit code is non-zero
         * @type {string}
         * @memberof RestartPolicy
         */
        Name?: string;
        /**
         * If `on-failure` is used, the number of times to retry before giving up
         * @type {number}
         * @memberof RestartPolicy
         */
        MaximumRetryCount?: number;
    }

    /**
     *
     * @export
     * @interface HostConfigPortBindings
     */
    export interface HostConfigPortBindings {
        /**
         * The host IP address
         * @type {string}
         * @memberof HostConfigPortBindings
         */
        HostIp?: string;
        /**
         * The host port number, as a string
         * @type {string}
         * @memberof HostConfigPortBindings
         */
        HostPort?: string;
    }

    /**
     *
     * @export
     * @interface ResourcesUlimits
     */
    export interface ResourcesUlimits {
        /**
         * Name of ulimit
         * @type {string}
         * @memberof ResourcesUlimits
         */
        Name?: string;
        /**
         * Soft limit
         * @type {number}
         * @memberof ResourcesUlimits
         */
        Soft?: number;
        /**
         * Hard limit
         * @type {number}
         * @memberof ResourcesUlimits
         */
        Hard?: number;
    }

    /**
     *
     * @export
     * @interface Mount
     */
    export interface ContainerCreateBodyMount {
        /**
         * Container path.
         * @type {string}
         * @memberof Mount
         */
        Target?: string;
        /**
         * Mount source (e.g. a volume name, a host path).
         * @type {string}
         * @memberof Mount
         */
        Source?: string;
        /**
         * The mount type. Available types:  - `bind` Mounts a file or directory from the host into the container. Must exist prior to creating the container. - `volume` Creates a volume with the given name and options (or uses a pre-existing volume with the same name and options). These are **not** removed when the container is removed. - `tmpfs` Create a tmpfs with the given options. The mount source cannot be specified for tmpfs.
         * @type {string}
         * @memberof Mount
         */
        Type?: string;
        /**
         * Whether the mount should be read-only.
         * @type {boolean}
         * @memberof Mount
         */
        ReadOnly?: boolean;
        /**
         * The consistency requirement for the mount: `default`, `consistent`, `cached`, or `delegated`.
         * @type {string}
         * @memberof Mount
         */
        Consistency?: string;
        /**
         * Optional configuration for the `bind` type.
         * @type {any}
         * @memberof Mount
         */
        BindOptions?: any;
        /**
         *
         * @type {MountVolumeOptions}
         * @memberof Mount
         */
        VolumeOptions?: MountVolumeOptions;
        /**
         *
         * @type {MountTmpfsOptions}
         * @memberof Mount
         */
        TmpfsOptions?: MountTmpfsOptions;
    }
}