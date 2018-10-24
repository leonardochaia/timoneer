
export interface FsLayer {
    blobSum: string;
}

export interface ImageLayerHistory {
    v1Compatibility: string;
}

export interface Jwk {
    crv: string;
    kid: string;
    kty: string;
    x: string;
    y: string;
}

export interface SignatureHeader {
    jwk: Jwk;
    alg: string;
}

export interface Signature {
    header: SignatureHeader;
    signature: string;
    protected: string;
}

export interface ImageManifest {
    schemaVersion: number;
    name: string;
    tag: string;
    architecture: string;
    fsLayers: FsLayer[];
    history: ImageLayerHistory[];
    signatures: Signature[];
}

export interface ImageHistoryContainerConfig {
    Hostname: string;
    Domainname: string;
    User: string;
    AttachStdin: boolean;
    AttachStdout: boolean;
    AttachStderr: boolean;
    ExposedPorts: { [key: string]: any };
    Tty: boolean;
    OpenStdin: boolean;
    StdinOnce: boolean;
    Env: string[];
    Cmd: string[];
    ArgsEscaped: boolean;
    Image: string;
    Volumes?: any;
    WorkingDir: string;
    Entrypoint: string[];
    OnBuild: any[];
    Labels: { [key: string]: string };
}

export interface ImageLayerHistoryV1Compatibility {
    architecture: string;
    config: ImageHistoryContainerConfig;
    container: string;
    container_config: ImageHistoryContainerConfig;
    created: string;
    docker_version: string;
    id: string;
    os: string;
    parent: string;
    throwaway?: boolean;
    author: string;
}
