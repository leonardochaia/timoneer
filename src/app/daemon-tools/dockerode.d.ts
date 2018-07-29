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
}