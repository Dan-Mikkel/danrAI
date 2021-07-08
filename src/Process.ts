import { ProcessInfo, ProcessMemory } from "./index";

export abstract class Process {
  private pid: number;
  private name: string;
  private memory: ProcessMemory;
  private parentPid: number | undefined;

  protected constructor(pid: number, info: ProcessInfo) {
    this.pid = pid;
    this.name = info.name;
    this.memory = info.memory;
    this.parentPid = info.parentPid;
  }

  abstract run(): void;
}
