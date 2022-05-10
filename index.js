const { Tester } = require('@nickreese/seo-lint');
const { substituteVariables } = require('var-expansion');
const ansi = require('ansi-colors');

// aliases for error levels
ansi.theme({
    error:   ansi.red,
    warning: ansi.yellow,
});

function isFailure(threshold, level, priority) {
    const levels = ['warning', 'error'];

    if (typeof threshold == 'string') {
        return levels.indexOf(threshold) <= levels.indexOf(level);
    }

    return threshold <= priority;
}

function prettyPrint(level, priority, message) {
    return ansi[level](level) + ` (${priority}): ${message}`;
}

const siteRules = {
    orphanPages: {
        message: 'The following pages are orphaned:',
        output: orphanPages => '  ' + orphanPages.join('\n  ')
    },
    duplicateTitles: {
        message: 'The following pages have duplicate titles:',
        output: duplicates => duplicates.map(pair => '  ' + pair.join(' and ')).join('\n')
    },
    duplicateMetaDescriptions: {
        message: 'The following pages have duplicate meta descriptions:',
        output: duplicates => duplicates.map(pair => '  ' + pair.join(' and ')).join('\n')
    },
};

/**
 * Get the host parameter
 *
 * Normally, will be $URL (prod) or $DEPLOY_PRIME_URL.
 * Can be overridden in config, possibly using parameter expansion.
 */
function getHost(inputs) {
    if (inputs.host) {
        if (!inputs.hostExpansion) { return inputs.host; }

        const { value, error } = substituteVariables(inputs.host, {env: process.env});
        if (!error) { return value; }
        utils.build.failBuild(error);
    }

    return process.env[process.env.CONTEXT == 'production' ? 'URL' : 'DEPLOY_PRIME_URL'];
}

module.exports = {
    onPostBuild: async ({ constants, inputs, utils }) => {
        const tester = new Tester({
            siteWide:    true,
            host:        getHost(inputs),
            preferences: {
                internalLinksLowerCase:     inputs.internalLinksLowerCase,
                internalLinksTrailingSlash: inputs.internalLinksTrailingSlash,
            },
        });
        const { meta, ...results } = await tester.folder(constants.PUBLISH_DIR);
        let failures = [];

        Object.keys(results).forEach(path => {
            if (path[0] == '/') {
                console.log(path);

                results[path].forEach(issue => {
                    const level = issue.level.replace(/s$/, ''),
                        fail = isFailure(inputs.threshold, level, issue.priority);

                    if (inputs.verbose || fail) {
                        console.log('  ' + prettyPrint(level, issue.priority, issue.message));
                    }

                    failures.push(fail);
                });
            }
        });

        Object.keys(siteRules).forEach(siteRule => {
            if (results[siteRule]) {
                const ruleSpec = siteRules[siteRule],
                    level = ruleSpec.level || 'warning',
                    priority = ruleSpec.priority || 70,
                    fail = isFailure(inputs.threshold, level, priority);

                if (inputs.verbose || fail) {
                    console.log(prettyPrint(level, priority, ruleSpec.message));
                    console.log(ruleSpec.output(results[siteRule]));
                }

                failures.push(fail);
            }
        });

        if (failures.some(Boolean)) {
            utils.build.failBuild(`SEO issues exceeded your threshold of “${inputs.threshold}”`);
        }
    }
};
