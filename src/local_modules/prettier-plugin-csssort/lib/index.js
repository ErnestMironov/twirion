const postcss = require('postcss');
const sorting = require('postcss-sorting');
const { parsers: cssParsers } = require('prettier/parser-postcss');

const config = require('./config');

/**
 * Takes the specified CSS text and sorts+groups the CSS
 * properties in each rule.
 */
function sortCSSProperties(text, options) {
    const result = postcss([sorting(config)]).process(text).css;
    return result;
}

/**
 * Wraps the pre-processor in our own pre-processor that sorts
 * the CSS properties.
 */
function wrapPreprocessor(preprocess) {
    if (!preprocess) {
        return sortCSSProperties;
    }

    return function(text, options) {
        return sortCSSProperties(preprocess(text, options), options);
    };
}

/**
 * Overrides each parser's pre-processor and wraps it in our
 * own pre-processor that sorts the CSS properties.
 *
 * If the parser defines a pre-processor, it gets run before
 * the properties get sorted.
 */
function overrideParsersPeprocess(parsers) {
    const overridenParsers = {};

    Object.keys(parsers).forEach(parserName => {
        const parser = parsers[parserName];

        overridenParsers[parserName] = {
            ...parser,
            preprocess: wrapPreprocessor(parser.preprocess),
        };
    });

    return overridenParsers;
}

module.exports = {
    parsers: overrideParsersPeprocess(cssParsers),
};
