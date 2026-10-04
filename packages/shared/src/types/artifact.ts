export type TArtifact = {
  id: number;
  sessionId: number;
  processId?: number;
  name: string;
  uri: string;
  size: number;
  permissions?: string;
  fileSystem?: string;
  data?: string;
  hash: string;
};
