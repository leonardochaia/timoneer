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
