"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeString = exports.handleBracketSpacing = exports.isMultilineInterpolation = exports.isQuoted = exports.isStyleAttribute = exports.unwrapLineFeeds = exports.previousNormalAttributeToken = exports.previousTagToken = void 0;
function previousTagToken(tokens, index) {
    for (let i = index - 1; i >= 0; i--) {
        const token = tokens[i];
        if (!token) {
            return;
        }
        if (token.type === 'tag') {
            return token;
        }
    }
    return;
}
exports.previousTagToken = previousTagToken;
function previousNormalAttributeToken(tokens, index) {
    for (let i = index - 1; i > 0; i--) {
        const token = tokens[i];
        if (!token || token.type === 'start-attributes') {
            return;
        }
        if (token.type === 'attribute') {
            if (token.name !== 'class' && token.name !== 'id') {
                return token;
            }
        }
    }
    return;
}
exports.previousNormalAttributeToken = previousNormalAttributeToken;
function unwrapLineFeeds(value) {
    return value.includes('\n')
        ? value
            .split('\n')
            .map((part) => part.trim())
            .map((part) => (part[0] === '.' ? '' : ' ') + part)
            .join('')
            .trim()
        : value;
}
exports.unwrapLineFeeds = unwrapLineFeeds;
function isStyleAttribute(name, val) {
    return name === 'style' && isQuoted(val);
}
exports.isStyleAttribute = isStyleAttribute;
function isQuoted(val) {
    return /^["'](.*)["']$/.test(val);
}
exports.isQuoted = isQuoted;
function isMultilineInterpolation(val) {
    return /^`[\s\S]*`$/m.test(val) && val.includes('\n');
}
exports.isMultilineInterpolation = isMultilineInterpolation;
function handleBracketSpacing(bracketSpacing, code) {
    return bracketSpacing ? `{{ ${code} }}` : `{{${code}}}`;
}
exports.handleBracketSpacing = handleBracketSpacing;
function makeString(rawContent, enclosingQuote, unescapeUnnecessaryEscapes = false) {
    const otherQuote = enclosingQuote === '"' ? "'" : '"';
    const newContent = rawContent.replace(/\\([\s\S])|(['"])/g, (match, escaped, quote) => {
        if (escaped === otherQuote) {
            return escaped;
        }
        if (quote === enclosingQuote) {
            return `\\${quote}`;
        }
        if (quote) {
            return quote;
        }
        return unescapeUnnecessaryEscapes && /^[^\\nrvtbfux\r\n\u2028\u2029"'0-7]$/.test(escaped)
            ? escaped
            : `\\${escaped}`;
    });
    return enclosingQuote + newContent + enclosingQuote;
}
exports.makeString = makeString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxTQUFnQixnQkFBZ0IsQ0FBQyxNQUE0QixFQUFFLEtBQWE7SUFDM0UsS0FBSyxJQUFJLENBQUMsR0FBVyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDNUMsTUFBTSxLQUFLLEdBQXNCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1gsT0FBTztTQUNQO1FBQ0QsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtZQUN6QixPQUFPLEtBQUssQ0FBQztTQUNiO0tBQ0Q7SUFDRCxPQUFPO0FBQ1IsQ0FBQztBQVhELDRDQVdDO0FBUUQsU0FBZ0IsNEJBQTRCLENBQUMsTUFBNEIsRUFBRSxLQUFhO0lBQ3ZGLEtBQUssSUFBSSxDQUFDLEdBQVcsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzNDLE1BQU0sS0FBSyxHQUFzQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGtCQUFrQixFQUFFO1lBQ2hELE9BQU87U0FDUDtRQUNELElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDL0IsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDbEQsT0FBTyxLQUFLLENBQUM7YUFDYjtTQUNEO0tBQ0Q7SUFDRCxPQUFPO0FBQ1IsQ0FBQztBQWJELG9FQWFDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLEtBQWE7SUFDNUMsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMxQixDQUFDLENBQUMsS0FBSzthQUNKLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFDWCxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMxQixHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDbEQsSUFBSSxDQUFDLEVBQUUsQ0FBQzthQUNSLElBQUksRUFBRTtRQUNULENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDVixDQUFDO0FBVEQsMENBU0M7QUFtQkQsU0FBZ0IsZ0JBQWdCLENBQUMsSUFBWSxFQUFFLEdBQVc7SUFDekQsT0FBTyxJQUFJLEtBQUssT0FBTyxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRkQsNENBRUM7QUFxQ0QsU0FBZ0IsUUFBUSxDQUFDLEdBQVc7SUFDbkMsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUZELDRCQUVDO0FBRUQsU0FBZ0Isd0JBQXdCLENBQUMsR0FBVztJQUNuRCxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRkQsNERBRUM7QUFRRCxTQUFnQixvQkFBb0IsQ0FBQyxjQUF1QixFQUFFLElBQVk7SUFDekUsT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7QUFDekQsQ0FBQztBQUZELG9EQUVDO0FBR0QsU0FBZ0IsVUFBVSxDQUN6QixVQUFrQixFQUNsQixjQUF5QixFQUN6Qiw2QkFBc0MsS0FBSztJQUUzQyxNQUFNLFVBQVUsR0FBYyxjQUFjLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNqRSxNQUFNLFVBQVUsR0FBVyxVQUFVLENBQUMsT0FBTyxDQUM1QyxvQkFBb0IsRUFDcEIsQ0FBQyxLQUFLLEVBQUUsT0FBa0IsRUFBRSxLQUFnQixFQUFFLEVBQUU7UUFDL0MsSUFBSSxPQUFPLEtBQUssVUFBVSxFQUFFO1lBQzNCLE9BQU8sT0FBTyxDQUFDO1NBQ2Y7UUFDRCxJQUFJLEtBQUssS0FBSyxjQUFjLEVBQUU7WUFDN0IsT0FBTyxLQUFLLEtBQUssRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxLQUFLLEVBQUU7WUFDVixPQUFPLEtBQUssQ0FBQztTQUNiO1FBQ0QsT0FBTywwQkFBMEIsSUFBSSxzQ0FBc0MsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3hGLENBQUMsQ0FBQyxPQUFPO1lBQ1QsQ0FBQyxDQUFDLEtBQUssT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUNELENBQUM7SUFDRixPQUFPLGNBQWMsR0FBRyxVQUFVLEdBQUcsY0FBYyxDQUFDO0FBQ3JELENBQUM7QUF4QkQsZ0NBd0JDIn0=