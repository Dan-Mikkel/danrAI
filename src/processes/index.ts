import { DanraiBundle } from "../index";
import { ProcessRegistry } from "../ProcessRegistry";
import { bundle as InitBundle } from "./InitProcess";

export const bundle: DanraiBundle = {
  install(registry: ProcessRegistry) {
    InitBundle.install(registry);
  }
};
