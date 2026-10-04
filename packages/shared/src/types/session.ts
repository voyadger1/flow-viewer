import { TProcessStatus } from './status';
import { TDBCreated } from './db/meta';

export type TSession = {
  id: number;
} & TSessionMeta &
  TSessionData &
  TDBCreated;

export type TSessionMeta = {
  status?: TProcessStatus;
  startTime?: number;
  completedTime?: number;
};

export type TSessionData = {
  uniqueId?: string;
  workflowName?: string;
  sessionInfo?: string;
  scriptName?: string;
  runName?: string;
  runBy?: string;
  profile?: string;
  ansiLog?: boolean;
  binDir?: string;
  bucketDir?: string;
  workDir?: string;
  commandLine?: string;
  commitId?: string;
  poolSize?: number;
  resolvedConfig?: string;
};
