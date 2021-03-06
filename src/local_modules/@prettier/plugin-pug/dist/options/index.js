"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.CATEGORY_PUG = void 0;
const attribute_separator_1 = require("./attribute-separator");
const attribute_sorting_1 = require("./attribute-sorting");
const closing_bracket_position_1 = require("./closing-bracket-position");
const comment_preserve_spaces_1 = require("./comment-preserve-spaces");
const common_1 = require("./common");
const empty_attributes_1 = require("./empty-attributes");
const pug_class_notation_1 = require("./pug-class-notation");
const pug_id_notation_1 = require("./pug-id-notation");
const pug_single_file_component_indentation_1 = require("./pug-single-file-component-indentation");
const wrap_attributes_1 = require("./wrap-attributes");
exports.CATEGORY_PUG = 'Pug';
exports.options = {
    pugPrintWidth: common_1.PUG_PRINT_WIDTH_OPTION,
    pugSingleQuote: common_1.PUG_SINGLE_QUOTE_OPTION,
    pugTabWidth: common_1.PUG_TAB_WIDTH_OPTION,
    pugUseTabs: common_1.PUG_USE_TABS_OPTION,
    pugBracketSpacing: common_1.PUG_BRACKET_SPACING_OPTION,
    pugArrowParens: common_1.PUG_ARROW_PARENS_OPTION,
    pugSemi: common_1.PUG_SEMI_OPTION,
    attributeSeparator: attribute_separator_1.ATTRIBUTE_SEPARATOR_OPTION,
    pugAttributeSeparator: attribute_separator_1.PUG_ATTRIBUTE_SEPARATOR_OPTION,
    closingBracketPosition: closing_bracket_position_1.CLOSING_BRACKET_POSITION_OPTION,
    pugClosingBracketPosition: closing_bracket_position_1.PUG_CLOSING_BRACKET_POSITION_OPTION,
    commentPreserveSpaces: comment_preserve_spaces_1.COMMENT_PRESERVE_SPACES_OPTION,
    pugCommentPreserveSpaces: comment_preserve_spaces_1.PUG_COMMENT_PRESERVE_SPACES_OPTION,
    pugSortAttributes: attribute_sorting_1.PUG_SORT_ATTRIBUTES_OPTION,
    pugSortAttributesBeginning: attribute_sorting_1.PUG_SORT_ATTRIBUTES_BEGINNING_OPTION,
    pugSortAttributesEnd: attribute_sorting_1.PUG_SORT_ATTRIBUTES_END_OPTION,
    pugWrapAttributesThreshold: wrap_attributes_1.WRAP_ATTRIBUTES_THRESHOLD,
    pugWrapAttributesPattern: wrap_attributes_1.WRAP_ATTRIBUTES_PATTERN,
    pugEmptyAttributes: empty_attributes_1.PUG_EMPTY_ATTRIBUTES_OPTION,
    pugClassNotation: pug_class_notation_1.PUG_CLASS_NOTATION,
    pugIdNotation: pug_id_notation_1.PUG_ID_NOTATION,
    pugEmptyAttributesForceQuotes: empty_attributes_1.PUG_EMPTY_ATTRIBUTES_FORCE_QUOTES_OPTION,
    pugSingleFileComponentIndentation: pug_single_file_component_indentation_1.PUG_SINGLE_FILE_COMPONENT_INDENTATION
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvb3B0aW9ucy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwrREFBbUc7QUFFbkcsMkRBSTZCO0FBRTdCLHlFQUFrSDtBQUVsSCx1RUFBK0c7QUFFL0cscUNBUWtCO0FBRWxCLHlEQUEyRztBQUUzRyw2REFBMEQ7QUFFMUQsdURBQW9EO0FBQ3BELG1HQUFnRztBQUNoRyx1REFBdUY7QUFLMUUsUUFBQSxZQUFZLEdBQVcsS0FBSyxDQUFDO0FBNkM3QixRQUFBLE9BQU8sR0FBbUI7SUFDdEMsYUFBYSxFQUFFLCtCQUFzQjtJQUNyQyxjQUFjLEVBQUUsZ0NBQXVCO0lBQ3ZDLFdBQVcsRUFBRSw2QkFBb0I7SUFDakMsVUFBVSxFQUFFLDRCQUFtQjtJQUMvQixpQkFBaUIsRUFBRSxtQ0FBMEI7SUFDN0MsY0FBYyxFQUFFLGdDQUF1QjtJQUN2QyxPQUFPLEVBQUUsd0JBQWU7SUFDeEIsa0JBQWtCLEVBQUUsZ0RBQTBCO0lBQzlDLHFCQUFxQixFQUFFLG9EQUE4QjtJQUNyRCxzQkFBc0IsRUFBRSwwREFBK0I7SUFDdkQseUJBQXlCLEVBQUUsOERBQW1DO0lBQzlELHFCQUFxQixFQUFFLHdEQUE4QjtJQUNyRCx3QkFBd0IsRUFBRSw0REFBa0M7SUFDNUQsaUJBQWlCLEVBQUUsOENBQTBCO0lBQzdDLDBCQUEwQixFQUFFLHdEQUFvQztJQUNoRSxvQkFBb0IsRUFBRSxrREFBOEI7SUFDcEQsMEJBQTBCLEVBQUUsMkNBQXlCO0lBQ3JELHdCQUF3QixFQUFFLHlDQUF1QjtJQUNqRCxrQkFBa0IsRUFBRSw4Q0FBMkI7SUFDL0MsZ0JBQWdCLEVBQUUsdUNBQWtCO0lBQ3BDLGFBQWEsRUFBRSxpQ0FBZTtJQUM5Qiw2QkFBNkIsRUFBRSwyREFBd0M7SUFDdkUsaUNBQWlDLEVBQUUsNkVBQXFDO0NBQ3hFLENBQUMifQ==