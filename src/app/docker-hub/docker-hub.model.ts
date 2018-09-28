export interface DockerHubRepository {
    name: string;
    namespace: string;
    repository_type: string;
    status: number;
    description: string;
    is_private: boolean;
    is_automated: boolean;
    can_edit: boolean;
    star_count: number;
    pull_count: number;
    last_updated: Date;
}

export interface DockerHubRepositoryResponse {
    count: number;
    next: string;
    previous?: any;
    results: DockerHubRepository[];
}
