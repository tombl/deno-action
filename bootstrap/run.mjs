// Copyright 2024 tombl              All rights reserved. MIT license.
// Copyright 2019 the Deno authors.  All rights reserved. MIT license.

// From https://github.com/tombl/deno-action

// Based on https://github.com/denoland/deno_install
//          https://github.com/denoland/setup-deno
//          https://github.com/actions/toolkit

// Keep this easily auditable, with no external dependencies.

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

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

const VERSION_CACHE = join(
  process.env.RUNNER_TEMP,
  "deno-action-versions.json",
);

let versions;
try {
  versions = JSON.parse(readFileSync(VERSION_CACHE, "utf-8"));
} catch {
  versions = await (await fetch("https://deno.com/versions.json")).json();
  writeFileSync(VERSION_CACHE, JSON.stringify(versions));
}

// Versions are ordered from newest to oldest.
// Pick the newest major compatible version,
// excluding suffixed versions e.g. release candidates.
const version = versions.cli.find((v) =>
  v.startsWith("v1.") && !v.includes("-")
);

const url =
  `https://github.com/denoland/deno/releases/download/${version}/deno-${ARCH}-${OS}.zip`;

export default function run(file) {
  const child = spawnSync("bash", [
    "-c",
    `
set -e

cache="$RUNNER_TOOL_CACHE/deno-action/${version}/${process.arch}"
mkdir -p "$cache"
zip="$RUNNER_TEMP/deno-${version}.zip"

if [ ! -f "$cache.complete" ]; then
  echo "::debug::Downloading Deno ${version}"
  curl --silent --fail --location '${url}' --output "$zip"
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
}
