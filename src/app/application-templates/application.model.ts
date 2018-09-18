export interface Application {
    id: string;
    title: string;
    image: string;
    description: string;
    ports: ApplicationPortMapping[];
    volumes: ApplicationVolumeMapping[];
}

export interface ApplicationVolumeMapping {
    containerPath: string;
    description: string;
}

export interface ApplicationPortMapping {
    containerPort: number;
    description: string;
}
