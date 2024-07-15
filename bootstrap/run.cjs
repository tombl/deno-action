// Copyright 2024 tombl              All rights reserved. MIT license.
// Copyright 2019 the Deno authors.  All rights reserved. MIT license.

// From https://github.com/tombl/deno-action

// Based on https://github.com/denoland/deno_install
//          https://github.com/denoland/setup-deno
//          https://github.com/actions/toolkit

// Keep this easily auditable, with no external dependencies.

const { spawnSync } = require("child_process");

const DENO_VERSION = "v1.44.4";

if (!process.env.RUNNER_TOOL_CACHE || !process.env.RUNNER_TEMP) {
  throw new Error("This file must be run in a GitHub Actions environment.");
}

module.exports = (file) => {
  const child = spawnSync("bash", [
    "-c",
    `
set -ex

cache="$RUNNER_TOOL_CACHE/deno-action/${DENO_VERSION}/${process.arch}"
mkdir -p "$cache"
zip="$RUNNER_TEMP/deno-${DENO_VERSION}.zip"

echo $(uname -sm) $RUNNER_OS

case $RUNNER_OS-$(uname -m); in
Windows-x86_64) target="x86_64-pc-windows-msvc" ;;
Darwin-x86_64)  target="x86_64-apple-darwin" ;;
Darwin-arm64)   target="aarch64-apple-darwin" ;;
Linux-aarch64)  target="aarch64-unknown-linux-gnu" ;;
Linux-x86_64)   target="x86_64-unknown-linux-gnu" ;;
*) echo "Unsupported os/architecture"; exit 1 ;;
esac

url="https://github.com/denoland/deno/releases/download/${DENO_VERSION}/deno-\${target}.zip"

if [ ! -f "$cache.complete" ]; then
  echo "Downloading Deno..."
  curl --silent --fail --location "$url" --output "$zip"
  unzip -q -o -d "$cache" "$zip"
  rm -f "$zip"
  touch "$cache.complete"
fi

export DENO_DIR="$RUNNER_TEMP/.deno"

chmod +x "$cache/deno"
exec "$cache/deno" run --quiet --no-prompt --allow-all '${file}'
    `,
  ], { stdio: "inherit" });
  if (child.error) throw child.error;
  process.exitCode = child.status;
};
