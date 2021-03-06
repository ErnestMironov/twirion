"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convergeOptions = void 0;
function convergeOptions(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        printWidth: options.printWidth,
        pugPrintWidth: options.pugPrintWidth !== -1 ? options.pugPrintWidth : options.printWidth,
        singleQuote: options.singleQuote,
        pugSingleQuote: (_a = options.pugSingleQuote) !== null && _a !== void 0 ? _a : options.singleQuote,
        tabWidth: options.tabWidth,
        pugTabWidth: options.pugTabWidth !== -1 ? options.pugTabWidth : options.tabWidth,
        useTabs: options.useTabs,
        pugUseTabs: (_b = options.pugUseTabs) !== null && _b !== void 0 ? _b : options.useTabs,
        bracketSpacing: options.bracketSpacing,
        pugBracketSpacing: (_c = options.pugBracketSpacing) !== null && _c !== void 0 ? _c : options.bracketSpacing,
        arrowParens: options.arrowParens,
        pugArrowParens: (_d = options.pugArrowParens) !== null && _d !== void 0 ? _d : options.arrowParens,
        semi: options.semi,
        pugSemi: (_e = options.pugSemi) !== null && _e !== void 0 ? _e : options.semi,
        attributeSeparator: (_f = options.pugAttributeSeparator) !== null && _f !== void 0 ? _f : options.attributeSeparator,
        closingBracketPosition: (_g = options.pugClosingBracketPosition) !== null && _g !== void 0 ? _g : options.closingBracketPosition,
        commentPreserveSpaces: (_h = options.pugCommentPreserveSpaces) !== null && _h !== void 0 ? _h : options.commentPreserveSpaces,
        pugSortAttributes: options.pugSortAttributes,
        pugSortAttributesBeginning: options.pugSortAttributesBeginning,
        pugSortAttributesEnd: options.pugSortAttributesEnd,
        pugWrapAttributesThreshold: options.pugWrapAttributesThreshold,
        pugWrapAttributesPattern: options.pugWrapAttributesPattern,
        pugClassNotation: options.pugClassNotation,
        pugIdNotation: options.pugIdNotation,
        pugEmptyAttributes: options.pugEmptyAttributes,
        pugEmptyAttributesForceQuotes: options.pugEmptyAttributesForceQuotes,
        pugSingleFileComponentIndentation: options.pugSingleFileComponentIndentation && options.embeddedInHtml
    };
}
exports.convergeOptions = convergeOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVyZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvb3B0aW9ucy9jb252ZXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFTQSxTQUFnQixlQUFlLENBQUMsT0FBeUM7O0lBQ3hFLE9BQU87UUFDTixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7UUFDOUIsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVO1FBQ3hGLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztRQUNoQyxjQUFjLFFBQUUsT0FBTyxDQUFDLGNBQWMsbUNBQUksT0FBTyxDQUFDLFdBQVc7UUFDN0QsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1FBQzFCLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUTtRQUNoRixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87UUFDeEIsVUFBVSxRQUFFLE9BQU8sQ0FBQyxVQUFVLG1DQUFJLE9BQU8sQ0FBQyxPQUFPO1FBQ2pELGNBQWMsRUFBRSxPQUFPLENBQUMsY0FBYztRQUN0QyxpQkFBaUIsUUFBRSxPQUFPLENBQUMsaUJBQWlCLG1DQUFJLE9BQU8sQ0FBQyxjQUFjO1FBQ3RFLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztRQUNoQyxjQUFjLFFBQUUsT0FBTyxDQUFDLGNBQWMsbUNBQUksT0FBTyxDQUFDLFdBQVc7UUFDN0QsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1FBQ2xCLE9BQU8sUUFBRSxPQUFPLENBQUMsT0FBTyxtQ0FBSSxPQUFPLENBQUMsSUFBSTtRQUN4QyxrQkFBa0IsUUFBRSxPQUFPLENBQUMscUJBQXFCLG1DQUFJLE9BQU8sQ0FBQyxrQkFBa0I7UUFDL0Usc0JBQXNCLFFBQUUsT0FBTyxDQUFDLHlCQUF5QixtQ0FBSSxPQUFPLENBQUMsc0JBQXNCO1FBQzNGLHFCQUFxQixRQUFFLE9BQU8sQ0FBQyx3QkFBd0IsbUNBQUksT0FBTyxDQUFDLHFCQUFxQjtRQUN4RixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCO1FBQzVDLDBCQUEwQixFQUFFLE9BQU8sQ0FBQywwQkFBMEI7UUFDOUQsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLG9CQUFvQjtRQUNsRCwwQkFBMEIsRUFBRSxPQUFPLENBQUMsMEJBQTBCO1FBQzlELHdCQUF3QixFQUFFLE9BQU8sQ0FBQyx3QkFBd0I7UUFDMUQsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQjtRQUMxQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWE7UUFDcEMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLGtCQUFrQjtRQUM5Qyw2QkFBNkIsRUFBRSxPQUFPLENBQUMsNkJBQTZCO1FBQ3BFLGlDQUFpQyxFQUFFLE9BQU8sQ0FBQyxpQ0FBaUMsSUFBSSxPQUFPLENBQUMsY0FBYztLQUN0RyxDQUFDO0FBQ0gsQ0FBQztBQTlCRCwwQ0E4QkMifQ==