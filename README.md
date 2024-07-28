# Create a Github Action using Deno

Use this template to write a Github Action with Deno.

A minimal and more secure alternative to
[GitHub's TypeScript action template](https://github.com/actions/typescript-action).

## Why?

The current Actions ecosystem is a supply chain attack waiting to happen. Almost
every custom JavaScript action pushes their `node_modules` or their bundled code
straight to their repo.
[This practice is even recommended by GitHub](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github).

Because Deno fetches dependencies on-demand and directly executes TypeScript, it
sidesteps this problem entirely.

## How?

In the bootstrap directory, you'll find a small script that will download,
cache, and execute Deno.

[Use this repo as a template](https://github.com/new?template_name=deno-action&template_owner=tombl)
to create your own GitHub Actions, and you'll be able to use Deno instead of
Node.

## Limitations

By fetching dependencies on-demand instead of bundling them, the first execution
of your action will be slightly slower. However, this is mostly balanced out
because there's less of your action to clone.

Also, Deno only currently supports the following platforms:

- Linux x86_64
- Linux aarch64
- macOS x86_64
- macOS aarch64
- Windows x86_64

If you expect your actions to run on other runners (like
[Windows aarch64](https://github.com/denoland/deno/issues/13331)), you'll want
to avoid this template.

## Publishing a release

You're welcome to copy
[the release script](https://github.com/actions/typescript-action/blob/main/script/release)
from GitHub's template, but if we're here for security, you should probably
recommend your users use a pinned version of the action.

## License

This template, with the exception of the `bootstrap/` directory, is published
under the 0BSD license, reproduced below. The `bootstrap/` directory contains
code vaguely derived from Deno's installer, and is made available under the same
MIT license.

```
BSD Zero Clause License

Copyright (c) 2024 tombl

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```
