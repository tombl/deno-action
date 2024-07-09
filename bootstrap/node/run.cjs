// Copyright 2024 tombl              All rights reserved. MIT license.
// Copyright 2019 the Deno authors.  All rights reserved. MIT license.

// From https://github.com/tomblcode/deno-action

// Based on https://github.com/denoland/deno_install
//          https://github.com/denoland/setup-deno
//          https://github.com/actions/toolkit

// Keep this easily auditable, with no external dependencies.

const { spawnSync } = require("child_process");

const DENO_VERSION = "v1.44.4";

if (!process.env.RUNNER_TOOL_CACHE || !process.env.RUNNER_TEMP) {
  throw new Error("This file must be run in a GitHub Actions environment.");
}

Object.assign(process.env, {});

module.exports = (file) => {
  const [command, ...args] = process.platform === "win32"
    ? [
      "powershell",
      "-Command",
      `
$ErrorActionPreference = "Stop"

$cache = "$env:RUNNER_TOOL_CACHE\\deno-action\\${DENO_VERSION}\\${process.arch}"
New-Item -ItemType Directory -Force -Path $cache
$zip = "$env:RUNNER_TEMP\\deno-${DENO_VERSION}.zip"

$target = "x86_64-pc-windows-msvc"
$url = "https://github.com/denoland/deno/releases/download/v1.44.4/deno-$target.zip"

if (-not (Test-Path -Path "$cache.complete")) {
  echo "Downloading Deno..."
  curl.exe -L --progress-bar $url -o $zip
  tar.exe -xf $zip -C $cache
  Remove-Item -Force $zip
  New-Item -ItemType File -Force -Path "$cache.complete"
}

$env:DENO_DIR = "$env:RUNNER_TEMP\\.deno"

& "$cache\\deno.exe" run --allow-all '${file}'
exit $LastExitCode
    `,
    ]
    : [
      "sh",
      "-c",
      `
set -e

cache="$RUNNER_TOOL_CACHE/deno-action/${DENO_VERSION}/${process.arch}"
mkdir -p "$cache"
zip="$RUNNER_TEMP/deno-${DENO_VERSION}.zip"

case $(uname -sm) in
"Darwin x86_64")  target="x86_64-apple-darwin";;
"Darwin arm64")   target="aarch64-apple-darwin" ;;
"Linux aarch64")  target="aarch64-unknown-linux-gnu" ;;
"Linux x86_64")   target="x86_64-unknown-linux-gnu" ;;
*) echo "Unsupported os/architecture"; exit 1 ;;
esac
url="https://github.com/denoland/deno/releases/download/${DENO_VERSION}/deno-\${target}.zip"

if [ ! -f "$cache.complete" ]; then
  echo "Downloading Deno..."
  curl --fail --location --progress-bar "$url" --output "$zip"
  unzip -q -o -d "$cache" "$zip"
  rm -f "$zip"
  touch "$cache.complete"
fi

export DENO_DIR="$RUNNER_TEMP/.deno"

chmod +x "$cache/deno"
exec "$cache/deno" run --allow-all '${file}'
    `,
    ];

  const child = spawnSync(command, args, { stdio: "inherit" });
  if (child.error) throw child.error;
  process.exitCode = child.status;
};
