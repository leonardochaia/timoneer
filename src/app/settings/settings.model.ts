export interface ApplicationSettings {
    registries: DockerRegistrySettings[];

    dockerDaemonSettings: {
        url: string;
    };

}

export interface DockerRegistrySettings {
    url: string;
    username: string;
    password: string;
    editable: boolean;
    allowsCatalog: boolean;
}
