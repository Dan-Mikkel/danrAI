import { DanraiBundle, ProcessConstructor, ProcessInfo } from "./index";
import { Process } from "./Process";

export class ProcessRegistry {
  private registry: { [name: string]: ProcessConstructor } = {};

  public register(name: string, constructor: ProcessConstructor): boolean {
    if (this.registry.name) {
      global.log.error(`Name already registered: ${name}`, "ProcessRegistry");
      return false;
    }
    global.log.debug(`Registered ${name}`);
    this.registry[name] = constructor;
    return true;
  }

  public install(bundle: DanraiBundle): void {
    bundle.install(this);
  }

  public getNewProcess(pid: number, info: ProcessInfo): Process | undefined {
    if (!this.registry[info.name]) return;
    global.log.info(`Created ${info.name}`);
    return new this.registry[info.name](pid, info);
  }
}
