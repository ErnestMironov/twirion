"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PugPrinter = void 0;
const prettier_1 = require("prettier");
const util_1 = require("util");
const doctype_shortcut_registry_1 = require("./doctype-shortcut-registry");
const logger_1 = require("./logger");
const attribute_separator_1 = require("./options/attribute-separator");
const utils_1 = require("./options/attribute-sorting/utils");
const closing_bracket_position_1 = require("./options/closing-bracket-position");
const comment_preserve_spaces_1 = require("./options/comment-preserve-spaces");
const utils_2 = require("./options/empty-attributes/utils");
const angular_1 = require("./utils/angular");
const common_1 = require("./utils/common");
const vue_1 = require("./utils/vue");
const logger = logger_1.createLogger(console);
if (process.env.NODE_ENV === 'test') {
    logger.setLogLevel(logger_1.LogLevel.DEBUG);
}
class PugPrinter {
    constructor(content, tokens, options) {
        var _a, _b;
        this.content = content;
        this.tokens = tokens;
        this.options = options;
        this.result = '';
        this.currentIndex = -1;
        this.currentLineLength = 0;
        this.indentLevel = 0;
        this.currentTagPosition = 0;
        this.possibleIdPosition = 0;
        this.possibleClassPosition = 0;
        this.previousAttributeRemapped = false;
        this.wrapAttributes = false;
        this.pipelessText = false;
        this.pipelessComment = false;
        this.currentlyInPugInterpolation = false;
        this.indentString = options.pugUseTabs ? '\t' : ' '.repeat(options.pugTabWidth);
        if (options.pugSingleFileComponentIndentation) {
            this.indentLevel++;
        }
        this.quotes = this.options.pugSingleQuote ? "'" : '"';
        this.otherQuotes = this.options.pugSingleQuote ? '"' : "'";
        const attributeSeparator = attribute_separator_1.resolveAttributeSeparatorOption(options.attributeSeparator);
        this.alwaysUseAttributeSeparator = attributeSeparator === 'always';
        this.neverUseAttributeSeparator = attributeSeparator === 'none';
        this.closingBracketRemainsAtNewLine = closing_bracket_position_1.resolveClosingBracketPositionOption(options.closingBracketPosition);
        const wrapAttributesPattern = options.pugWrapAttributesPattern;
        this.wrapAttributesPattern = wrapAttributesPattern ? new RegExp(wrapAttributesPattern) : null;
        const codeSingleQuote = !options.pugSingleQuote;
        this.codeInterpolationOptions = {
            singleQuote: codeSingleQuote,
            bracketSpacing: (_a = options.pugBracketSpacing) !== null && _a !== void 0 ? _a : options.bracketSpacing,
            arrowParens: (_b = options.pugArrowParens) !== null && _b !== void 0 ? _b : options.arrowParens,
            printWidth: 9000,
            endOfLine: 'lf'
        };
    }
    build() {
        var _a, _b;
        if (logger.isDebugEnabled()) {
            logger.debug('[PugPrinter]:', JSON.stringify(this.tokens));
        }
        const results = [];
        if (((_a = this.tokens[0]) === null || _a === void 0 ? void 0 : _a.type) === 'text') {
            results.push('| ');
        }
        else if (((_b = this.tokens[0]) === null || _b === void 0 ? void 0 : _b.type) === 'eos') {
            return '';
        }
        let token = this.getNextToken();
        while (token) {
            logger.debug('[PugPrinter]:', JSON.stringify(token));
            try {
                switch (token.type) {
                    case 'attribute':
                    case 'class':
                    case 'end-attributes':
                    case 'id':
                    case 'eos':
                        this.result = results.join('');
                        this[token.type](token);
                        results.length = 0;
                        results.push(this.result);
                        break;
                    case 'tag':
                    case 'start-attributes':
                    case 'interpolation':
                    case 'call':
                    case ':':
                        this.result = results.join('');
                    default: {
                        if (typeof this[token.type] !== 'function') {
                            throw new Error('Unhandled token: ' + JSON.stringify(token));
                        }
                        results.push(this[token.type](token));
                        break;
                    }
                }
            }
            catch (error) {
                throw new Error(error);
            }
            token = this.getNextToken();
        }
        return results.join('');
    }
    get computedIndent() {
        var _a;
        switch ((_a = this.previousToken) === null || _a === void 0 ? void 0 : _a.type) {
            case 'newline':
            case 'outdent':
                return this.indentString.repeat(this.indentLevel);
            case 'indent':
                return this.indentString;
            case 'start-pug-interpolation':
                return '';
        }
        return this.options.pugSingleFileComponentIndentation ? this.indentString : '';
    }
    get previousToken() {
        return this.tokens[this.currentIndex - 1];
    }
    get nextToken() {
        return this.tokens[this.currentIndex + 1];
    }
    getNextToken() {
        var _a;
        this.currentIndex++;
        return (_a = this.tokens[this.currentIndex]) !== null && _a !== void 0 ? _a : null;
    }
    quoteString(val) {
        return `${this.quotes}${val}${this.quotes}`;
    }
    checkTokenType(token, possibilities, invert = false) {
        return !!token && possibilities.includes(token.type) !== invert;
    }
    tokenNeedsSeparator(token) {
        return this.neverUseAttributeSeparator
            ? false
            : this.alwaysUseAttributeSeparator || /^(\(|\[|:).*/.test(token.name);
    }
    getUnformattedContentLines(firstToken, lastToken) {
        const { start } = firstToken.loc;
        const { end } = lastToken.loc;
        const lines = this.content.split(/\r\n|\n|\r/);
        const startLine = start.line - 1;
        const endLine = end.line - 1;
        const parts = [];
        const firstLine = lines[startLine];
        if (firstLine !== undefined) {
            parts.push(firstLine.slice(start.column - 1));
        }
        for (let lineNumber = startLine + 1; lineNumber < endLine; lineNumber++) {
            const line = lines[lineNumber];
            if (line !== undefined) {
                parts.push(line);
            }
        }
        const lastLine = lines[endLine];
        if (lastLine !== undefined) {
            parts.push(lastLine.slice(0, end.column - 1));
        }
        return parts;
    }
    replaceTagWithLiteralIfPossible(search, replace) {
        const currentTagEnd = Math.max(this.possibleIdPosition, this.possibleClassPosition);
        const tag = this.result.slice(this.currentTagPosition, currentTagEnd);
        const replaced = tag.replace(search, replace);
        if (replaced !== tag) {
            const prefix = this.result.slice(0, this.currentTagPosition);
            const suffix = this.result.slice(currentTagEnd);
            this.result = `${prefix}${replaced}${suffix}`;
            const diff = tag.length - replaced.length;
            this.possibleIdPosition -= diff;
            this.possibleClassPosition -= diff;
        }
    }
    formatText(text) {
        let result = '';
        while (text) {
            const start = text.indexOf('{{');
            if (start !== -1) {
                result += text.slice(0, start);
                text = text.slice(start + 2);
                const end = text.indexOf('}}');
                if (end !== -1) {
                    let code = text.slice(0, end);
                    try {
                        const q1 = code.indexOf(this.quotes);
                        const q2 = code.indexOf(this.otherQuotes);
                        const qb = code.indexOf('`');
                        if (q1 >= 0 && q2 >= 0 && q2 > q1 && (qb < 0 || q1 < qb)) {
                            logger.log({
                                code,
                                quotes: this.quotes,
                                otherQuotes: this.otherQuotes,
                                q1,
                                q2,
                                qb
                            });
                            logger.warn('The following expression could not be formatted correctly. Please try to fix it yourself and if there is a problem, please open a bug issue:', code);
                            result += common_1.handleBracketSpacing(this.options.pugBracketSpacing, code);
                            text = text.slice(end + 2);
                            continue;
                        }
                        else {
                            code = prettier_1.format(code, { parser: '__ng_interpolation', ...this.codeInterpolationOptions });
                        }
                    }
                    catch (error) {
                        if (typeof error === 'string') {
                            if (error.includes('Unexpected token Lexer Error')) {
                                if (!error.includes('Unexpected character [`]')) {
                                    logger.debug('[PugPrinter:formatText]: Using fallback strategy');
                                }
                            }
                            else if (error.includes('Bindings cannot contain assignments')) {
                                logger.warn('[PugPrinter:formatText]: Bindings should not contain assignments:', `code: \`${code.trim()}\``);
                            }
                            else if (error.includes("Unexpected token '('")) {
                                logger.warn("[PugPrinter:formatText]: Found unexpected token '('. If you are using Vue, you can ignore this message.", `code: \`${code.trim()}\``);
                            }
                            else if (error.includes('Missing expected )')) {
                                logger.warn('[PugPrinter:formatText]: Missing expected ). If you are using Vue, you can ignore this message.', `code: \`${code.trim()}\``);
                            }
                            else if (error.includes('Missing expected :')) {
                                logger.warn('[PugPrinter:formatText]: Missing expected :. If you are using Vue, you can ignore this message.', `code: \`${code.trim()}\``);
                            }
                            else {
                                logger.warn('[PugPrinter:formatText]: ', error);
                            }
                        }
                        else {
                            logger.warn('[PugPrinter:formatText]: ', error);
                        }
                        try {
                            code = prettier_1.format(code, {
                                parser: 'babel',
                                ...this.codeInterpolationOptions,
                                semi: false
                            });
                            if (code[0] === ';') {
                                code = code.slice(1);
                            }
                        }
                        catch (error) {
                            logger.warn(error);
                        }
                    }
                    code = common_1.unwrapLineFeeds(code);
                    result += common_1.handleBracketSpacing(this.options.pugBracketSpacing, code);
                    text = text.slice(end + 2);
                }
                else {
                    result += '{{';
                    result += text;
                    text = '';
                }
            }
            else {
                result += text;
                text = '';
            }
        }
        return result;
    }
    formatDelegatePrettier(val, parser, { trimTrailingSemicolon = false } = {}) {
        val = val.trim();
        val = val.slice(1, -1);
        val = prettier_1.format(val, { parser, ...this.codeInterpolationOptions });
        val = common_1.unwrapLineFeeds(val);
        if (trimTrailingSemicolon && val[val.length - 1] === ';') {
            val = val.slice(0, -1);
        }
        return this.quoteString(val);
    }
    formatStyleAttribute(val) {
        return this.formatDelegatePrettier(val, 'css', { trimTrailingSemicolon: true });
    }
    formatVueEventBinding(val) {
        return this.formatDelegatePrettier(val, '__vue_event_binding', { trimTrailingSemicolon: true });
    }
    formatVueExpression(val) {
        return this.formatDelegatePrettier(val, '__vue_expression');
    }
    formatAngularBinding(val) {
        return this.formatDelegatePrettier(val, '__ng_binding');
    }
    formatAngularAction(val) {
        return this.formatDelegatePrettier(val, '__ng_action');
    }
    formatAngularDirective(val) {
        return this.formatDelegatePrettier(val, '__ng_directive');
    }
    formatAngularInterpolation(val) {
        val = val.slice(1, -1);
        val = val.slice(2, -2);
        val = val.trim();
        if (val.includes(`\\${this.otherQuotes}`)) {
            logger.warn('The following expression could not be formatted correctly. Please try to fix it yourself and if there is a problem, please open a bug issue:', val);
        }
        else {
            val = prettier_1.format(val, { parser: '__ng_interpolation', ...this.codeInterpolationOptions });
            val = common_1.unwrapLineFeeds(val);
        }
        val = common_1.handleBracketSpacing(this.options.pugBracketSpacing, val);
        return this.quoteString(val);
    }
    tag(token) {
        let val = token.val;
        if (val === 'div' && this.nextToken && (this.nextToken.type === 'class' || this.nextToken.type === 'id')) {
            val = '';
        }
        this.currentLineLength += val.length;
        const result = `${this.computedIndent}${val}`;
        logger.debug('tag', { result, val: token.val, length: token.val.length }, this.currentLineLength);
        this.currentTagPosition = this.result.length + this.computedIndent.length;
        this.possibleIdPosition = this.result.length + result.length;
        this.possibleClassPosition = this.result.length + result.length;
        return result;
    }
    ['start-attributes'](token) {
        var _a, _b, _c;
        let result = '';
        if (((_a = this.nextToken) === null || _a === void 0 ? void 0 : _a.type) === 'attribute') {
            this.previousAttributeRemapped = false;
            this.possibleClassPosition = this.result.length;
            result = '(';
            logger.debug(this.currentLineLength);
            let tempToken = this.nextToken;
            let tempIndex = this.currentIndex + 1;
            let hasLiteralAttributes = false;
            let numNormalAttributes = 0;
            while (tempToken.type === 'attribute') {
                if (!this.currentlyInPugInterpolation &&
                    !this.wrapAttributes && ((_b = this.wrapAttributesPattern) === null || _b === void 0 ? void 0 : _b.test(tempToken.name))) {
                    this.wrapAttributes = true;
                }
                switch (tempToken.name) {
                    case 'class':
                    case 'id': {
                        hasLiteralAttributes = true;
                        const val = tempToken.val.toString();
                        if (common_1.isQuoted(val)) {
                            this.currentLineLength -= 2;
                        }
                        this.currentLineLength += 1 + val.length;
                        logger.debug({ tokenName: tempToken.name, length: tempToken.name.length }, this.currentLineLength);
                        break;
                    }
                    default: {
                        this.currentLineLength += tempToken.name.length;
                        if (numNormalAttributes > 0) {
                            this.currentLineLength += 1;
                            if (this.tokenNeedsSeparator(tempToken)) {
                                this.currentLineLength += 1;
                            }
                        }
                        logger.debug({ tokenName: tempToken.name, length: tempToken.name.length }, this.currentLineLength);
                        const val = tempToken.val.toString();
                        if (val.length > 0 && val !== 'true') {
                            this.currentLineLength += 1 + val.length;
                            logger.debug({ tokenVal: val, length: val.length }, this.currentLineLength);
                        }
                        numNormalAttributes++;
                        break;
                    }
                }
                tempToken = this.tokens[++tempIndex];
            }
            logger.debug('after token', this.currentLineLength);
            if (hasLiteralAttributes) {
                if (((_c = this.previousToken) === null || _c === void 0 ? void 0 : _c.type) === 'tag' && this.previousToken.val === 'div') {
                    this.currentLineLength -= 3;
                }
            }
            if (numNormalAttributes > 0) {
                this.currentLineLength += 2;
            }
            logger.debug(this.currentLineLength);
            if (!this.currentlyInPugInterpolation &&
                !this.wrapAttributes &&
                (this.currentLineLength > this.options.pugPrintWidth ||
                    (this.options.pugWrapAttributesThreshold >= 0 &&
                        numNormalAttributes > this.options.pugWrapAttributesThreshold))) {
                this.wrapAttributes = true;
            }
            if (this.options.pugSortAttributes !== 'as-is' ||
                this.options.pugSortAttributesEnd.length > 0 ||
                this.options.pugSortAttributesBeginning.length > 0) {
                const startAttributesIndex = this.tokens.indexOf(token);
                const endAttributesIndex = tempIndex;
                if (endAttributesIndex - startAttributesIndex > 2) {
                    this.tokens = utils_1.partialSort(this.tokens, startAttributesIndex + 1, endAttributesIndex, (a, b) => utils_1.compareAttributeToken(a, b, this.options.pugSortAttributes, this.options.pugSortAttributesBeginning, this.options.pugSortAttributesEnd));
                }
            }
        }
        return result;
    }
    attribute(token) {
        var _a, _b;
        utils_2.formatEmptyAttribute(token, this.options.pugEmptyAttributes, this.options.pugEmptyAttributesForceQuotes);
        if (typeof token.val === 'string') {
            if (common_1.isQuoted(token.val)) {
                if (token.name === 'class' && this.options.pugClassNotation !== 'as-is') {
                    const val = token.val.slice(1, -1).trim();
                    const classes = val.split(/\s+/);
                    const specialClasses = [];
                    const normalClasses = [];
                    const validClassNameRegex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
                    for (const className of classes) {
                        if (!validClassNameRegex.test(className)) {
                            specialClasses.push(className);
                        }
                        else {
                            normalClasses.push(className);
                        }
                    }
                    if (normalClasses.length > 0) {
                        const position = this.possibleClassPosition;
                        this.result = [
                            this.result.slice(0, position),
                            '.',
                            normalClasses.join('.'),
                            this.result.slice(position)
                        ].join('');
                        this.possibleClassPosition += 1 + normalClasses.join('.').length;
                        this.replaceTagWithLiteralIfPossible(/div\./, '.');
                    }
                    if (specialClasses.length > 0) {
                        token.val = common_1.makeString(specialClasses.join(' '), this.quotes);
                        this.previousAttributeRemapped = false;
                    }
                    else {
                        this.previousAttributeRemapped = true;
                        return;
                    }
                }
                else if (token.name === 'id' && this.options.pugIdNotation !== 'as-is') {
                    let val = token.val;
                    val = val.slice(1, -1);
                    val = val.trim();
                    const validIdNameRegex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
                    if (!validIdNameRegex.test(val)) {
                        val = common_1.makeString(val, this.quotes);
                        this.result += 'id';
                        if (token.mustEscape === false) {
                            this.result += '!';
                        }
                        this.result += `=${val}`;
                        return;
                    }
                    const position = this.possibleIdPosition;
                    const literal = `#${val}`;
                    this.result = [this.result.slice(0, position), literal, this.result.slice(position)].join('');
                    this.possibleClassPosition += literal.length;
                    this.replaceTagWithLiteralIfPossible(/div#/, '#');
                    this.previousAttributeRemapped = true;
                    return;
                }
            }
        }
        const hasNormalPreviousToken = common_1.previousNormalAttributeToken(this.tokens, this.currentIndex);
        if (((_a = this.previousToken) === null || _a === void 0 ? void 0 : _a.type) === 'attribute' && (!this.previousAttributeRemapped || hasNormalPreviousToken)) {
            if (this.tokenNeedsSeparator(token)) {
                this.result += ',';
            }
            if (!this.wrapAttributes) {
                this.result += ' ';
            }
        }
        this.previousAttributeRemapped = false;
        if (this.wrapAttributes) {
            this.result += '\n';
            this.result += this.indentString.repeat(this.indentLevel + 1);
        }
        this.result += `${token.name}`;
        if (typeof token.val === 'boolean') {
            if (token.val !== true) {
                this.result += `=${token.val}`;
            }
        }
        else {
            let val = token.val;
            if (common_1.isMultilineInterpolation(val)) {
            }
            else if (vue_1.isVueVForWithOf(token.name, token.val)) {
                val = this.formatDelegatePrettier(val, 'vue');
            }
            else if (vue_1.isVueExpression(token.name)) {
                val = this.formatVueExpression(val);
            }
            else if (vue_1.isVueEventBinding(token.name)) {
                val = this.formatVueEventBinding(val);
            }
            else if (vue_1.isVueVOnExpression(token.name)) {
                val = this.formatDelegatePrettier(val, '__js_expression');
            }
            else if (angular_1.isAngularBinding(token.name)) {
                val = this.formatAngularBinding(val);
            }
            else if (angular_1.isAngularAction(token.name)) {
                val = this.formatAngularAction(val);
            }
            else if (angular_1.isAngularDirective(token.name)) {
                val = this.formatAngularDirective(val);
            }
            else if (angular_1.isAngularInterpolation(val)) {
                val = this.formatAngularInterpolation(val);
            }
            else if (common_1.isStyleAttribute(token.name, token.val)) {
                val = this.formatStyleAttribute(val);
            }
            else if (common_1.isQuoted(val)) {
                val = common_1.makeString(val.slice(1, -1), this.quotes);
            }
            else if (val === 'true') {
                return;
            }
            else if (token.mustEscape) {
                val = prettier_1.format(val, { parser: '__js_expression', ...this.codeInterpolationOptions });
                const lines = val.split('\n');
                const codeIndentLevel = this.wrapAttributes ? this.indentLevel + 1 : this.indentLevel;
                if (lines.length > 1) {
                    val = (_b = lines[0]) !== null && _b !== void 0 ? _b : '';
                    for (let index = 1; index < lines.length; index++) {
                        val += '\n';
                        val += this.indentString.repeat(codeIndentLevel);
                        val += lines[index];
                    }
                }
            }
            else {
                val = val.trim();
                val = val.replace(/\s\s+/g, ' ');
                if (val[0] === '{' && val[1] === ' ') {
                    val = `{${val.slice(2, val.length)}`;
                }
            }
            if (token.mustEscape === false) {
                this.result += '!';
            }
            this.result += `=${val}`;
        }
    }
    ['end-attributes'](token) {
        var _a, _b, _c;
        if (this.wrapAttributes && this.result[this.result.length - 1] !== '(') {
            if (this.closingBracketRemainsAtNewLine) {
                this.result += '\n';
            }
            this.result += this.indentString.repeat(this.indentLevel);
        }
        this.wrapAttributes = false;
        if (this.result[this.result.length - 1] === '(') {
            this.result = this.result.slice(0, -1);
        }
        else if (((_a = this.previousToken) === null || _a === void 0 ? void 0 : _a.type) === 'attribute') {
            if (!this.closingBracketRemainsAtNewLine) {
                this.result = this.result.trimRight();
            }
            this.result += ')';
        }
        if (((_b = this.nextToken) === null || _b === void 0 ? void 0 : _b.type) === 'text' || ((_c = this.nextToken) === null || _c === void 0 ? void 0 : _c.type) === 'path') {
            this.result += ' ';
        }
    }
    indent(token) {
        const result = `\n${this.indentString.repeat(this.indentLevel)}`;
        this.indentLevel++;
        this.currentLineLength = result.length - 1 + 1 + this.indentString.length;
        logger.debug('indent', { result, indentLevel: this.indentLevel }, this.currentLineLength);
        return result;
    }
    outdent(token) {
        let result = '';
        if (this.previousToken && this.previousToken.type !== 'outdent') {
            if (token.loc.start.line - this.previousToken.loc.end.line > 1) {
                result += '\n';
            }
            result += '\n';
        }
        this.indentLevel--;
        this.currentLineLength = 1 + this.indentString.repeat(this.indentLevel).length;
        logger.debug('outdent', { result, indentLevel: this.indentLevel }, this.currentLineLength);
        return result;
    }
    class(token) {
        var _a, _b;
        const val = `.${token.val}`;
        this.currentLineLength += val.length;
        logger.debug('class', { val, length: val.length }, this.currentLineLength);
        switch ((_a = this.previousToken) === null || _a === void 0 ? void 0 : _a.type) {
            case 'newline':
            case 'outdent':
            case 'indent': {
                this.possibleIdPosition = this.result.length + this.computedIndent.length;
                const result = `${this.computedIndent}${val}`;
                this.result += result;
                this.possibleClassPosition = this.result.length;
                break;
            }
            default: {
                const prefix = this.result.slice(0, this.possibleClassPosition);
                this.result = [prefix, val, this.result.slice(this.possibleClassPosition)].join('');
                this.possibleClassPosition += val.length;
                break;
            }
        }
        if (((_b = this.nextToken) === null || _b === void 0 ? void 0 : _b.type) === 'text') {
            this.currentLineLength += 1;
            this.result += ' ';
        }
    }
    eos(token) {
        while (this.result[this.result.length - 1] === '\n') {
            this.result = this.result.slice(0, -1);
        }
        this.result += '\n';
    }
    comment(commentToken) {
        var _a;
        let result = this.computedIndent;
        if (/^ prettier-ignore($|[: ])/.test(commentToken.val)) {
            let token = this.getNextToken();
            if (token) {
                let skipNewline = token.type === 'newline';
                let ignoreLevel = 0;
                while (token) {
                    const { type } = token;
                    if (type === 'newline' && ignoreLevel === 0) {
                        if (skipNewline) {
                            skipNewline = false;
                        }
                        else {
                            break;
                        }
                    }
                    else if (type === 'indent') {
                        ignoreLevel++;
                    }
                    else if (type === 'outdent') {
                        ignoreLevel--;
                        if (ignoreLevel === 0) {
                            break;
                        }
                    }
                    token = this.getNextToken();
                }
                if (token) {
                    const lines = this.getUnformattedContentLines(commentToken, token);
                    const lastLine = lines.pop();
                    if (lastLine !== undefined) {
                        lines.push(lastLine.trimRight());
                    }
                    result += lines.join('\n');
                }
            }
        }
        else {
            if (this.checkTokenType(this.previousToken, ['newline', 'indent', 'outdent'], true)) {
                result += ' ';
            }
            result += '//';
            if (!commentToken.buffer) {
                result += '-';
            }
            result += comment_preserve_spaces_1.formatCommentPreserveSpaces(commentToken.val, this.options.commentPreserveSpaces);
            if (((_a = this.nextToken) === null || _a === void 0 ? void 0 : _a.type) === 'start-pipeless-text') {
                this.pipelessComment = true;
            }
        }
        return result;
    }
    newline(token) {
        let result = '';
        if (this.previousToken && token.loc.start.line - this.previousToken.loc.end.line > 1) {
            result += '\n';
        }
        result += '\n';
        this.currentLineLength = 1 + this.indentString.repeat(this.indentLevel).length;
        logger.debug('newline', { result, indentLevel: this.indentLevel }, this.currentLineLength);
        return result;
    }
    text(token) {
        var _a, _b, _c;
        let result = '';
        let val = token.val;
        let needsTrailingWhitespace = false;
        if (this.pipelessText) {
            switch ((_a = this.previousToken) === null || _a === void 0 ? void 0 : _a.type) {
                case 'newline':
                    if (val.trim().length > 0) {
                        result += this.indentString.repeat(this.indentLevel + 1);
                    }
                    break;
                case 'start-pipeless-text':
                    result += this.indentString;
                    break;
            }
            if (this.pipelessComment) {
                val = comment_preserve_spaces_1.formatCommentPreserveSpaces(val, this.options.commentPreserveSpaces, true);
            }
        }
        else {
            if (this.nextToken && val[val.length - 1] === ' ') {
                switch (this.nextToken.type) {
                    case 'interpolated-code':
                    case 'start-pug-interpolation':
                        needsTrailingWhitespace = true;
                        break;
                }
            }
            val = val.replace(/\s\s+/g, ' ');
            switch ((_b = this.previousToken) === null || _b === void 0 ? void 0 : _b.type) {
                case 'newline':
                    result += this.indentString.repeat(this.indentLevel);
                    if (/^ .+$/.test(val)) {
                        result += '|\n';
                        result += this.indentString.repeat(this.indentLevel);
                    }
                    result += '|';
                    if (/.*\S.*/.test(token.val) || ((_c = this.nextToken) === null || _c === void 0 ? void 0 : _c.type) === 'start-pug-interpolation') {
                        result += ' ';
                    }
                    break;
                case 'indent':
                case 'outdent':
                    result += this.computedIndent;
                    if (/^ .+$/.test(val)) {
                        result += '|\n';
                        result += this.indentString.repeat(this.indentLevel);
                    }
                    result += '|';
                    if (/.*\S.*/.test(token.val)) {
                        result += ' ';
                    }
                    break;
                case 'interpolated-code':
                case 'end-pug-interpolation':
                    if (/^ .+$/.test(val)) {
                        result += ' ';
                    }
                    break;
            }
            val = val.trim();
            val = this.formatText(val);
            val = val.replace(/#(\{|\[)/g, '\\#$1');
        }
        if (this.checkTokenType(this.previousToken, ['tag', 'id', 'interpolation', 'call', '&attributes', 'filter'])) {
            val = ` ${val}`;
        }
        result += val;
        if (needsTrailingWhitespace) {
            result += ' ';
        }
        return result;
    }
    ['interpolated-code'](token) {
        var _a;
        let result = '';
        switch ((_a = this.previousToken) === null || _a === void 0 ? void 0 : _a.type) {
            case 'tag':
            case 'class':
            case 'id':
            case 'end-attributes':
                result = ' ';
                break;
            case 'start-pug-interpolation':
                result = '| ';
                break;
            case 'indent':
            case 'newline':
            case 'outdent':
                result = this.computedIndent;
                result += this.pipelessText ? this.indentString : '| ';
                break;
        }
        result += token.mustEscape ? '#' : '!';
        result += `{${token.val}}`;
        return result;
    }
    code(token) {
        let result = this.computedIndent;
        if (!token.mustEscape && token.buffer) {
            result += '!';
        }
        result += token.buffer ? '=' : '-';
        let useSemi = this.options.pugSemi;
        if (useSemi && (token.mustEscape || token.buffer)) {
            useSemi = false;
        }
        let val = token.val;
        try {
            const valBackup = val;
            val = prettier_1.format(val, {
                parser: 'babel',
                ...this.codeInterpolationOptions,
                semi: useSemi,
                endOfLine: 'lf'
            });
            val = val.slice(0, -1);
            if (val[0] === ';') {
                val = val.slice(1);
            }
            if (val.includes('\n')) {
                val = valBackup;
            }
        }
        catch (error) {
            logger.warn('[PugPrinter]:', error);
        }
        result += ` ${val}`;
        return result;
    }
    id(token) {
        var _a;
        const val = `#${token.val}`;
        this.currentLineLength += val.length;
        switch ((_a = this.previousToken) === null || _a === void 0 ? void 0 : _a.type) {
            case 'newline':
            case 'outdent':
            case 'indent': {
                const result = `${this.computedIndent}${val}`;
                this.result += result;
                this.possibleClassPosition = this.result.length;
                break;
            }
            default: {
                const prefix = this.result.slice(0, this.possibleIdPosition);
                this.possibleClassPosition += val.length;
                this.result = [prefix, val, this.result.slice(this.possibleIdPosition)].join('');
                break;
            }
        }
    }
    ['start-pipeless-text'](token) {
        var _a;
        this.pipelessText = true;
        let result = `\n${this.indentString.repeat(this.indentLevel)}`;
        if (((_a = this.previousToken) === null || _a === void 0 ? void 0 : _a.type) === 'dot') {
            const lastTagToken = common_1.previousTagToken(this.tokens, this.currentIndex);
            let parser;
            switch (lastTagToken === null || lastTagToken === void 0 ? void 0 : lastTagToken.val) {
                case 'script':
                    parser = 'babel';
                    break;
                case 'style':
                    parser = 'css';
                    break;
                default:
                    break;
            }
            if (parser) {
                let index = this.currentIndex + 1;
                let tok = this.tokens[index];
                let rawText = '';
                let usedInterpolatedCode = false;
                while (tok && (tok === null || tok === void 0 ? void 0 : tok.type) !== 'end-pipeless-text') {
                    switch (tok.type) {
                        case 'text':
                            rawText += tok.val;
                            break;
                        case 'newline':
                            rawText += '\n';
                            break;
                        case 'interpolated-code':
                            usedInterpolatedCode = true;
                            rawText += tok.mustEscape ? '#' : '!';
                            rawText += `{${tok.val}}`;
                            break;
                        default:
                            logger.warn('[PugPrinter:start-pipeless-text]:', 'Unhandled token for pipeless script tag:', JSON.stringify(tok));
                            break;
                    }
                    index++;
                    tok = this.tokens[index];
                }
                try {
                    result = prettier_1.format(rawText, { parser, ...this.codeInterpolationOptions });
                }
                catch (error) {
                    if (!usedInterpolatedCode) {
                        logger.error(error);
                        throw error;
                    }
                    const warningContext = [
                        '[PugPrinter:start-pipeless-text]:',
                        'The following expression could not be formatted correctly.',
                        'This is likely a syntax error or an issue caused by the missing execution context.',
                        'If you think this is a bug, please open a bug issue.'
                    ];
                    warningContext.push(`\ncode: \`${rawText.trim()}\``);
                    warningContext.push('\nYou used interpolated code in your pipeless script tag, so you may ignore this warning.');
                    if (util_1.types.isNativeError(error)) {
                        warningContext.push(`\nFound ${parser} ${error.name}: ${error.message}.`);
                    }
                    else {
                        logger.debug('typeof error:', typeof error);
                        warningContext.push(`\nUnexpected error for parser ${parser}.`, error);
                    }
                    logger.warn(...warningContext);
                    result = rawText;
                }
                result = result.trimRight();
                const indentString = this.indentString.repeat(this.indentLevel + 1);
                result = result
                    .split('\n')
                    .map((line) => (line ? indentString + line : ''))
                    .join('\n');
                result = `\n${result}`;
                tok = this.tokens[index - 1];
                if ((tok === null || tok === void 0 ? void 0 : tok.type) === 'text' && tok.val === '') {
                    result += `\n${this.indentString.repeat(this.indentLevel)}`;
                }
                this.currentIndex = index - 1;
            }
        }
        return result;
    }
    ['end-pipeless-text'](token) {
        this.pipelessText = false;
        this.pipelessComment = false;
        return '';
    }
    doctype(token) {
        let result = `${this.computedIndent}doctype`;
        if (token.val) {
            result += ` ${token.val}`;
        }
        return result;
    }
    dot(token) {
        return '.';
    }
    block(token) {
        let result = `${this.computedIndent}block `;
        if (token.mode !== 'replace') {
            result += `${token.mode} `;
        }
        result += token.val;
        return result;
    }
    extends(token) {
        const indent = this.options.pugSingleFileComponentIndentation ? this.indentString : '';
        return `${indent}extends `;
    }
    path(token) {
        let result = '';
        if (this.checkTokenType(this.previousToken, ['include', 'filter'])) {
            result += ' ';
        }
        result += token.val;
        return result;
    }
    ['start-pug-interpolation'](token) {
        var _a, _b;
        let result = '';
        if (((_a = this.tokens[this.currentIndex - 2]) === null || _a === void 0 ? void 0 : _a.type) === 'newline' &&
            ((_b = this.previousToken) === null || _b === void 0 ? void 0 : _b.type) === 'text' &&
            this.previousToken.val.trim().length === 0) {
            result += this.indentString.repeat(this.indentLevel + 1);
        }
        this.currentlyInPugInterpolation = true;
        result += '#[';
        return result;
    }
    ['end-pug-interpolation'](token) {
        this.currentlyInPugInterpolation = false;
        return ']';
    }
    interpolation(token) {
        const result = `${this.computedIndent}#{${token.val}}`;
        this.currentLineLength += result.length;
        this.possibleIdPosition = this.result.length + result.length;
        this.possibleClassPosition = this.result.length + result.length;
        return result;
    }
    include(token) {
        return `${this.computedIndent}include`;
    }
    filter(token) {
        return `${this.computedIndent}:${token.val}`;
    }
    call(token) {
        let result = `${this.computedIndent}+${token.val}`;
        let args = token.args;
        if (args) {
            args = args.trim();
            args = args.replace(/\s\s+/g, ' ');
            result += `(${args})`;
        }
        this.currentLineLength += result.length;
        this.possibleIdPosition = this.result.length + result.length;
        this.possibleClassPosition = this.result.length + result.length;
        return result;
    }
    mixin(token) {
        let result = `${this.computedIndent}mixin ${token.val}`;
        let args = token.args;
        if (args) {
            args = args.trim();
            args = args.replace(/\s\s+/g, ' ');
            result += `(${args})`;
        }
        return result;
    }
    if(token) {
        let result = this.computedIndent;
        const match = /^!\((.*)\)$/.exec(token.val);
        logger.debug('[PugPrinter]:', match);
        result += !match ? `if ${token.val}` : `unless ${match[1]}`;
        return result;
    }
    ['mixin-block'](token) {
        return `${this.computedIndent}block`;
    }
    else(token) {
        return `${this.computedIndent}else`;
    }
    ['&attributes'](token) {
        const result = `&attributes(${token.val})`;
        this.currentLineLength += result.length;
        return result;
    }
    ['text-html'](token) {
        const match = /^<(.*?)>(.*)<\/(.*?)>$/.exec(token.val);
        logger.debug('[PugPrinter]:', match);
        if (match) {
            return `${this.computedIndent}${match[1]} ${match[2]}`;
        }
        const entry = Object.entries(doctype_shortcut_registry_1.DOCTYPE_SHORTCUT_REGISTRY).find(([key]) => key === token.val.toLowerCase());
        if (entry) {
            return `${this.computedIndent}${entry[1]}`;
        }
        return `${this.computedIndent}${token.val}`;
    }
    each(token) {
        let result = `${this.computedIndent}each ${token.val}`;
        if (token.key !== null) {
            result += `, ${token.key}`;
        }
        result += ` in ${token.code}`;
        return result;
    }
    eachOf(token) {
        let value = token.value.trim();
        value = prettier_1.format(value, {
            parser: 'babel',
            ...this.codeInterpolationOptions,
            semi: false
        });
        if (value[0] === ';') {
            value = value.slice(1);
        }
        value = common_1.unwrapLineFeeds(value);
        const code = token.code.trim();
        return `${this.computedIndent}each ${value} of ${code}`;
    }
    while(token) {
        return `${this.computedIndent}while ${token.val}`;
    }
    case(token) {
        return `${this.computedIndent}case ${token.val}`;
    }
    when(token) {
        return `${this.computedIndent}when ${token.val}`;
    }
    [':'](token) {
        this.possibleIdPosition = this.result.length + 2;
        this.possibleClassPosition = this.result.length + 2;
        return ': ';
    }
    default(token) {
        return `${this.computedIndent}default`;
    }
    ['else-if'](token) {
        return `${this.computedIndent}else if ${token.val}`;
    }
    blockcode(token) {
        return `${this.computedIndent}-`;
    }
    yield(token) {
        return `${this.computedIndent}yield`;
    }
    slash(token) {
        return '/';
    }
}
exports.PugPrinter = PugPrinter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmludGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFrQztBQWlEbEMsK0JBQTZCO0FBRTdCLDJFQUF3RTtBQUV4RSxxQ0FBa0Q7QUFFbEQsdUVBQWdGO0FBRWhGLDZEQUF1RjtBQUV2RixpRkFBeUY7QUFFekYsK0VBQWdGO0FBR2hGLDREQUF3RTtBQUd4RSw2Q0FBZ0g7QUFDaEgsMkNBU3dCO0FBQ3hCLHFDQUFzRztBQUV0RyxNQUFNLE1BQU0sR0FBVyxxQkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssTUFBTSxFQUFFO0lBQ3BDLE1BQU0sQ0FBQyxXQUFXLENBQUMsaUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUNuQztBQThDRCxNQUFhLFVBQVU7SUF5Q3RCLFlBQ2tCLE9BQWUsRUFDeEIsTUFBZSxFQUNOLE9BQTBCOztRQUYxQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVM7UUFDTixZQUFPLEdBQVAsT0FBTyxDQUFtQjtRQTNDcEMsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQU1wQixpQkFBWSxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzFCLHNCQUFpQixHQUFXLENBQUMsQ0FBQztRQUc5QixnQkFBVyxHQUFXLENBQUMsQ0FBQztRQWdCeEIsdUJBQWtCLEdBQVcsQ0FBQyxDQUFDO1FBQy9CLHVCQUFrQixHQUFXLENBQUMsQ0FBQztRQUMvQiwwQkFBcUIsR0FBVyxDQUFDLENBQUM7UUFFbEMsOEJBQXlCLEdBQVksS0FBSyxDQUFDO1FBSTNDLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBRWhDLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBQzlCLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBQ2pDLGdDQUEyQixHQUFZLEtBQUssQ0FBQztRQU9wRCxJQUFJ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