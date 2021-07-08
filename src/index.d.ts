import { Process } from "./Process";
import { ProcessRegistry } from "./ProcessRegistry";

/**
 * Contains info about all current processes
 */
declare interface ProcessTable {
  [pid: number]: ProcessInfo;
}

declare interface ProcessInfo {
  name: string;
  parentPid?: number;
  priority: number;
  memory: ProcessMemory;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare interface ProcessMemory {}

declare interface SchedulerMemory {
  processTable?: ProcessTable;
  readyQueue?: number[];
  sleepingQueue?: number[];
  completedProcesses?: number[];
  runningProcess?: number | boolean;
  lastPid?: number;
}

declare interface ProcessConstructor {
  new (pid: number, info: ProcessInfo): Process;
}

declare interface OSMemory {
  scheduler?: SchedulerMemory;
}

declare interface DanraiBundle {
  install(registry: ProcessRegistry): void;
}
