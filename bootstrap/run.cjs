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

const ARCH = {
  arm64: "aarch64",
  x64: "x86_64",
}[process.arch];
const OS = {
  win32: "pc-windows-msvc",
  darwin: "apple-darwin",
  linux: "unknown-linux-gnu",
}[process.platform];

if (!ARCH) throw new Error(`Unsupported architecture: ${process.arch}`);
if (!OS) throw new Error(`Unsupported OS: ${process.platform}`);

const URL =
  `https://github.com/denoland/deno/releases/download/${DENO_VERSION}/deno-${ARCH}-${OS}.zip`;

module.exports = (file) => {
  const child = spawnSync("bash", [
    "-c",
    `
set -e

cache="$RUNNER_TOOL_CACHE/deno-action/${DENO_VERSION}/${process.arch}"
mkdir -p "$cache"
zip="$RUNNER_TEMP/deno-${DENO_VERSION}.zip"

if [ ! -f "$cache.complete" ]; then
  echo "Downloading Deno..."
  curl --silent --fail --location '${URL}' --output "$zip"
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
