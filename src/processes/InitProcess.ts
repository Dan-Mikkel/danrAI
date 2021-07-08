import { Process } from "../Process";
import { DanraiBundle, ProcessInfo } from "../index";
import { ProcessRegistry } from "../ProcessRegistry";

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
