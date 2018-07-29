export interface ApplicationSettings {
    registries: DockerRegistrySettings[];
    dockerClientSettings: DockerClientSettings;
}

export interface DockerClientSettings {
    url?: string;
    tlsVerify?: boolean;
    certPath?: string;
    fromEnvironment?: boolean;
}

export interface DockerRegistrySettings {
    url: string;
    username: string;
    password: string;
    editable: boolean;
    allowsCatalog: boolean;
}
