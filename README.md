# netlify-plugin-seo-lint

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

* `host`: The host used to determine internal links. Defaults to Netlify's `URL` in `production` context, or `DEPLOY_PRIME_URL` in other contexts. See Netlify's [build environment variables](https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata) and [deploy contexts](https://docs.netlify.com/site-deploys/overview/#deploy-contexts).
* `hostExpansion`: Whether to run the `host` parameter through shell parameter expansion. Useful for using Netlify environment variables in the host. Defaults to `false`.
* `threshold`: The minimum priority that should be considered a build failure. Can be either `error` or `warning` which will be compared against the test's level, or an integer which will be compared against the test's priority. Defaults to `error`.
* `verbose`: Output all errors/warnings, even those below the threshold. Defaults to `true`.
* `internalLinksLowerCase`: Whether internal links should be checked to be lower case. Defaults to `true`.
* `internalLinksTrailingSlash`: Wether internal links should contain a trailing slash. Defaults to `true`.
