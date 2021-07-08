import { Process } from "Process";
import { ProcessMemory, ProcessTable, SchedulerMemory } from "./index";
import { ProcessRegistry } from "./ProcessRegistry";

const MAX_PID = 9999999;

export class Scheduler {
  public constructor(private processRegistry: ProcessRegistry) {}

  public get memory(): SchedulerMemory {
    Memory.os.scheduler = Memory.os.scheduler || {};
    return Memory.os.scheduler;
  }

  public get processTable(): ProcessTable {
    this.memory.processTable = this.memory.processTable || {};
    return this.memory.processTable;
  }

  public get readyQueue(): number[] {
    this.memory.readyQueue = this.memory.readyQueue || [];
    return this.memory.readyQueue;
  }

  public get sleepingQueue(): number[] {
    this.memory.sleepingQueue = this.memory.sleepingQueue || [];
    return this.memory.sleepingQueue;
  }

  public get runningProcess(): number | boolean {
    this.memory.runningProcess = this.memory.runningProcess || false;
    return this.memory.runningProcess;
  }

  public set runningProcess(b) {
    this.memory.runningProcess = b;
  }

  public get completedProcesses(): number[] {
    this.memory.completedProcesses = this.memory.completedProcesses || [];
    return this.memory.completedProcesses;
  }

  public set completedProcesses(s: number[]) {
    this.memory.completedProcesses = s;
  }

  public launchProcess(name: string, memory: ProcessMemory, priority: number, parent?: number): number {
    global.log.debug(`Launching process with priority: ${priority} and name: ${name}`);
    const pid = this.getNextPid();
    this.processTable[pid] = {
      name,
      memory,
      priority,
      parentPid: parent
    };
    this.readyQueue.push(pid);
    return pid;
  }

  public getProcessCount(): number {
    return Object.keys(this.processTable).length;
  }

  public getNextProcess(): Process | undefined {
    if (this.runningProcess) {
      this.completedProcesses.push(this.runningProcess as number);
      this.runningProcess = false;
    }

    if (this.readyQueue.length === 0) return;

    const process = this.readyQueue.shift();

    if (!process) {
      this.runningProcess = false;
      return;
    }
    this.runningProcess = process;

    return this.processRegistry.getNewProcess(this.runningProcess, this.processTable[this.runningProcess]);
  }

  private getNextPid(): number {
    if (!this.memory.lastPid) this.memory.lastPid = 0;
    for (;;) {
      this.memory.lastPid++;
      if (this.memory.lastPid > MAX_PID) {
        this.memory.lastPid = 0;
      }
      if (this.readyQueue[this.memory.lastPid]) {
        continue;
      }
      return this.memory.lastPid;
    }
  }

  public shift(): void {
    const completed = _.shuffle(this.completedProcesses);
    let pid;
    for (pid of completed) {
      // If process is dead do not merge it back into the queue system.
      if (!this.processTable[pid]) {
        continue;
      }
      this.readyQueue.push(pid);
    }

    this.completedProcesses = [];
  }
}
