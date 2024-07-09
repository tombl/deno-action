# Create a Github Action using Deno

Use this template to write a Github Action with Deno.

A minimal and more secure alternative to
[GitHub's TypeScript action template](https://github.com/actions/typescript-action).

## Why?

The current state of Actions is a security nightmare. Almost every custom
JavaScript action either pushes their `node_modules` or their bundled code
straight to their repo.
[This practice is even endorsed by GitHub](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github).
Unless you're pinning and vetting every action you depend on, you could be
vulnerable to a supply chain attack.

Because Deno fetches dependencies on-demand and directly executes TypeScript, it
sidesteps this problem entirely.

## How?

In the bootstrap directory, you'll find a ~100 line script that will download,
cache, and execute Deno.

[Use this repo as a template](https://github.com/new?template_name=deno-action&template_owner=tombl)
to create your own GitHub Actions.

## Limitations

By fetching dependencies on-demand, the first execution of your action will be
slightly slower than if you bundled them into the action. However, this is
mostly balanced out by the fact that there's less of your action to clone.

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
