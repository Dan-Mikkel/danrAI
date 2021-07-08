import { Scheduler } from "./Scheduler";
import { Process } from "./Process";

export class Kernel {
  public scheduler: Scheduler;
  private readonly cpuLimit: number;

  public constructor(scheduler: Scheduler, cpuLimit: number) {
    this.scheduler = scheduler;
    this.cpuLimit = cpuLimit;
  }

  public init(): void {
    global.log.info(`Initializing Kernel for tick ${Game.time}`, "Kernel");
    if (!Memory.os) Memory.os = {};

    this.scheduler.shift();

    if (this.scheduler.getProcessCount() <= 0) this.scheduler.launchProcess("init", {}, 99);

    return;
  }

  public tick(): void {
    global.log.info("tick", "kernel");
    while (this.shouldRun() && this.isUnderCpuLimit()) {
      const runningProcess: Process | undefined = this.scheduler.getNextProcess();
      if (!runningProcess) return; // If process was returned, then we don't have anything left to do.
      runningProcess.run();
    }
    return;
  }

  public shutdown(): void {
    global.log.info("shutdown", "kernel");
    return;
  }

  private isUnderCpuLimit(): boolean {
    return Game.cpu.getUsed() < this.cpuLimit;
  }

  private shouldRun(): boolean {
    if (Game.rooms.sim) return true;

    return this.scheduler.getProcessCount() > 0;
  }
}
