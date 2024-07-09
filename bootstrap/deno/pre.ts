import { restoreCache } from "npm:@actions/cache@^3";

const denoDir = Deno.env.get("DENO_DIR");
if (denoDir) {
  await restoreCache(
    [denoDir],
    `deno-action-${Deno.build.target}-${Deno.version.deno}`,
  );
}
