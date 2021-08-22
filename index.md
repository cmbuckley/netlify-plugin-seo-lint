---
layout: showcase
title: netlify-plugin-seo-lint
npm: netlify-plugin-seo-lint
---

This plugin adds SEO checks to the files generated in your Netlify build, using [@nickreese/seo-lint](https://www.npmjs.com/package/@nickreese/seo-lint).

## Installation

Add the plugin to your `netlify.toml`:

```toml
[[plugins]]
package = "netlify-plugin-seo-lint"

  [plugins.inputs]
  threshold = "warning"
```

Install to your `devDependencies` with npm:

```bash
npm i -D netlify-plugin-seo-lint
```

The plugin will run as part of your build, running SEO lint checks against the [publish directory](https://docs.netlify.com/configure-builds/get-started/#definitions). The build will fail if any linting issues exceed the configured `threshold`.

## Configuration

The following configuration options can be used:

* **host**: The host used to determine internal links. Defaults to Netlify's [`DEPLOY_PRIME_URL`](https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata).
* **threshold**: The minimum priority that should be considered a build failure. Can be either `error` or `warning` which will be compared against the test's level, or an integer which will be compared against the test's priority. Defaults to `error`.
* **verbose**: Output all errors/warnings, even those below the threshold. Defaults to `true`.
