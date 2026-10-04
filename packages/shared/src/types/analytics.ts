export type TAnalytic = {
  sessionId: number;
  processId: number;
  runName: string;
  processName: string;
  realtime: number;
  cpuPercent: number;
  mem: number;
  rss: number;
  vmem: number;
  peakRss: number;
  peakVmem: number;
  memory?: number;
  rchar: number;
  wchar: number;
  readBytes: number;
  writeBytes: number;
};
