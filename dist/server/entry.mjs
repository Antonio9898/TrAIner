globalThis.process ??= {};
globalThis.process.env ??= {};
import "cloudflare:workers";
import { w } from "./chunks/worker-entry_BgfgFATI.mjs";
export {
  w as default
};
