export interface DockerStreamResponse {
    id?: string;
    status?: string;
    error?: string;
    progress?: string;
    progressDetail: {
        current: number;
        total: number;
    };
}

export interface ContainerCreationSuggestedPort {
    containerPort: number;
    description?: string;
}

export interface ContainerCreationSuggestedVolume {
    containerPath: string;
    description?: string;
}

export interface PortBinding {
    containerPort: number;
    hostPort?: number;
    description?: string;
    assignRandomPort?: boolean;
}

export interface VolumeBinding {
    containerPath?: string;
    hostPath?: string;
    volumeName?: string;
    description?: string;
    readonly?: boolean;
    type?: VolumeBindingType;
}

export enum VolumeBindingType {
    Bind = 'bind',
    Volume = 'volume'
}
