import {AxiosResponse} from 'axios';
import axios from 'src/libs/axios';
import {isNullOrUndefined} from 'src/libs/utils';

export enum RepositoryBuildPhase {
  ERROR = 'error',
  INTERNAL_ERROR = 'internalerror',
  BUILD_SCHEDULED = 'build-scheduled',
  UNPACKING = 'unpacking',
  PULLING = 'pulling',
  BUILDING = 'building',
  PUSHING = 'pushing',
  WAITING = 'waiting',
  COMPLETE = 'complete',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export interface RepositoryBuild {
  id: string;
  phase: RepositoryBuildPhase;
  started: string;
  display_name: string;
  subdirectory: string;
  dockerfile_path: string;
  context: string;
  tags: string[];
  manual_user: string;
  is_writer: boolean;
  trigger?: RepositoryBuildTrigger;
  trigger_metadata?: RepositoryBuildTriggerMetadata;
  resource_key: string;
  repository: {
    namespace: string;
    name: string;
  };
  archive_url: string;
  // Additional parameters that aren't currently used
  // pull_robot: any;
  // error: any;
  // status: any;
}

export interface RepositoryBuildTrigger {
  id: string;
  service: string;
  is_active: boolean;
  build_source?: string;
  repository_url?: string;
  config?: {
    build_source?: string;
    dockerfile_path?: string;
    context?: string;
    branchtag_regex?: string;
    default_tag_from_ref?: boolean;
    latest_for_default_branch?: boolean;
    tag_templates?: string[];
    credentials?: [
      {
        name: string;
        value: string;
      },
    ];
    deploy_key_id?: number;
    hook_id?: number;
    master_branch?: string;
  };
  can_invoke?: boolean;
  enabled?: boolean;
  disabled_reason?: string;
}

export interface RepositoryBuildTriggerMetadata {
  commit?: string;
  commit_sha?: string;
  ref?: string;
  default_branch?: string;
  git_url?: string;
  commit_info?: {
    url?: string;
    message?: string;
    date?: string;
    author?: {
      username?: string;
      url?: string;
      avatar_url?: string;
    };
    committer?: {
      username?: string;
      url?: string;
      avatar_url?: string;
    };
  };
}

interface RepositoryBuildsResponse {
  builds: RepositoryBuild[];
}

export async function fetchBuilds(
  org: string,
  repo: string,
  buildsSinceInSeconds = null,
  limit = 10,
) {
  const params = {limit: limit};
  if (!isNullOrUndefined(buildsSinceInSeconds)) {
    params['since'] = buildsSinceInSeconds;
  }
  const response: AxiosResponse<RepositoryBuildsResponse> = await axios.get(
    `/api/v1/repository/${org}/${repo}/build/`,
    {params: params},
  );
  return response.data.builds;
}
