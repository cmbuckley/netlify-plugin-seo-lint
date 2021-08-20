const { Tester } = require('@nickreese/seo-lint');

function isFailure(threshold, level, priority) {
    const levels = ['warning', 'error'];

    if (typeof threshold == 'string') {
        return levels.indexOf(threshold) <= levels.indexOf(level);
    }

    return threshold <= priority;
}

module.exports = {
    onPostBuild: async ({ constants, inputs, utils }) => {
        const tester = new Tester({ siteWide: true, host: inputs.host || process.env.DEPLOY_PRIME_URL });
        const results = await tester.folder(constants.PUBLISH_DIR);
        let failures = [];

        Object.keys(results).forEach(path => {
            if (path[0] == '/') {
                console.log(path);

                results[path].forEach(issue => {
                    const level = issue.level.replace(/s$/, '');
                    console.log(`  ${level} (${issue.priority}): ${issue.message}`);
                    failures.push(isFailure(inputs.threshold, level, issue.priority));
                });
            }
        });

        if (failures.some(Boolean)) {
            utils.build.failBuild(`SEO issues exceeded your threshold of “${inputs.threshold}”`);
        }
    }
};
