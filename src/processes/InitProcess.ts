import { DanraiBundle, ProcessInfo } from "../index";
import { Process } from "../Process";
import { ProcessRegistry } from "../ProcessRegistry";

/**
 * The first process that gets launched.
 * It will be in charge of initializing the other processes that this AI will use
 */
export class InitProcess extends Process {
  public constructor(pid: number, info: ProcessInfo) {
    super(pid, info);
  }
  public run(): void {
    global.log.info("Hello from InitProcess, for real this time!", "InitProcess");
  }
}

export const bundle: DanraiBundle = {
  install(registry: ProcessRegistry) {
    registry.register("init", InitProcess);
  }
};
