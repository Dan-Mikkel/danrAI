import { ProcessInfo, ProcessMemory } from "./index";
import { kernel } from "./main";

/**
 * The base class that all processes will use.
 */
export abstract class Process {
  private readonly pid: number;
  private name: string;
  private memory: ProcessMemory;
  private parentPid: number | undefined;

  /**
   * @param pid The process id for the process
   * @param info The process metadata
   */
  protected constructor(pid: number, info: ProcessInfo) {
    this.pid = pid;
    this.name = info.name;
    this.memory = info.memory;
    this.parentPid = info.parentPid;
  }

  /**
   * The actual program that will be run.
   * The children needs to implement their wanted logic.
   */
  abstract run(): void;

  /**
   * Launches a child process of this process.
   * Will get killed if the parent process is killed
   * @param label This process internal label for it's child
   * @param name The name of the process to be run
   * @param memory Process information
   * @param priority The priority this process has
   */
  public launchChildProcess(label: string, name: string, memory: ProcessMemory, priority: number): boolean {
    if (!this.memory.children) {
      this.memory.children = {};
    }
    if (this.memory.children[label]) {
      return true;
    }

    this.memory.children[label] = kernel.scheduler.launchProcess(name, memory, priority, this.pid);
    return true;
  }
}
