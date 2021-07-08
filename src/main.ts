import { LogLevel, Logger } from "./Logger";
import { ErrorMapper } from "utils/ErrorMapper";
import { Kernel } from "./Kernel";
import { OSMemory } from "./index";
import { Scheduler } from "./Scheduler";
import { setCpuLimit } from "./utils/CpuLimitUtil";
import {ProcessRegistry} from "./ProcessRegistry";
import {bundle} from "./processes/index"

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
    logLevel: LogLevel;
    os: OSMemory;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      log: Logger;
    }
  }
}

// Initialize a logger which will be used in the entire project.
// Bootstrapping here
global.log = new Logger();
// Making a new process registry and installing the different processes we have available on it.
const processRegistry = new ProcessRegistry();
processRegistry.install(bundle);

const kernel = new Kernel(new Scheduler(processRegistry), setCpuLimit());
global.log.info("Bootstrapped the kernel!");

export const loop = ErrorMapper.wrapLoop(() => {
  // Start up the kernel
  kernel.init();
  // Run the kernel while possible
  kernel.tick();
  // Tear down the kernel
  kernel.shutdown();
});
