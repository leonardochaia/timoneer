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

export interface DockerHubPaginationResponse<T> {
    count: number;
    next: string;
    previous?: any;
    results: T[];
}

export interface DockerHubRepositoryResponse
    extends DockerHubPaginationResponse<RepositoryInfo> { }

export interface RepositoryInfo {
    user: string;
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
    has_starred: boolean;
    full_description: string;
    affiliation?: any;
    permissions: {
        read: boolean;
        write: boolean;
        admin: boolean;
    };
}

export interface RepositoryTagImage {
    size: number;
    architecture: string;
    variant?: any;
    features?: any;
    os: string;
    os_version?: any;
    os_features?: any;
}

export interface RepositoryTag {
    name: string;
    full_size: number;
    images: RepositoryTagImage[];
    id: number;
    repository: number;
    creator: number;
    last_updater: number;
    last_updated: Date;
    image_id?: any;
    v2: boolean;
}

export interface DockerHubRepositoryTagResponse
    extends DockerHubPaginationResponse<RepositoryTag> { }

