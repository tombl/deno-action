import { saveCache } from "npm:@actions/cache@^3";

const denoDir = Deno.env.get("DENO_DIR");
if (denoDir) {
  await saveCache(
    [denoDir],
    `deno-action-${Deno.build.target}-${Deno.version.deno}`,
  );
}
