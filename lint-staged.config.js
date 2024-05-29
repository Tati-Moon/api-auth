module.exports = {
    // Lint then format JavaScript files
    'app/**/*.(js|jsx)': function lint(filenames) {
        return [
            `node ./node_modules/eslint/bin/eslint.js --fix ${filenames.join(
                ' ',
            )}`,
        ];
    },

    // Format CSS, SCSS, MarkDown and JSON
    'app/**/*.(scss|css|md|json)': function prettier(filenames) {
        return `node ./node_modules/prettier/index.js --write ${filenames.join(
            ' ',
        )} --config ./.prettierrc`;
    },
};
