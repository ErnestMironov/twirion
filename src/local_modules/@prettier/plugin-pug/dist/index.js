"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = exports.options = exports.printers = exports.parsers = exports.languages = exports.plugin = void 0;
const lex = require("pug-lexer");
const logger_1 = require("./logger");
const options_1 = require("./options");
const converge_1 = require("./options/converge");
const printer_1 = require("./printer");
const logger = logger_1.createLogger(console);
if (process.env.NODE_ENV === 'test') {
    logger.setLogLevel(logger_1.LogLevel.DEBUG);
}
exports.plugin = {
    languages: [
        {
            name: 'Pug',
            parsers: ['pug'],
            tmScope: 'text.jade',
            aceMode: 'jade',
            codemirrorMode: 'pug',
            codemirrorMimeType: 'text/x-pug',
            extensions: ['.jade', '.pug'],
            linguistLanguageId: 179,
            vscodeLanguageIds: ['jade', 'pug']
        }
    ],
    parsers: {
        pug: {
            parse(text, parsers, options) {
                logger.debug('[parsers:pug:parse]:', { text });
                let trimmedAndAlignedContent = text.replace(/^\s*\n/, '');
                const contentIndentation = /^\s*/.exec(trimmedAndAlignedContent);
                if (contentIndentation === null || contentIndentation === void 0 ? void 0 : contentIndentation[0]) {
                    const contentIndentationRegex = new RegExp(`(^|\\n)${contentIndentation[0]}`, 'g');
                    trimmedAndAlignedContent = trimmedAndAlignedContent.replace(contentIndentationRegex, '$1');
                }
                const content = trimmedAndAlignedContent;
                const tokens = lex(content);
                return { content, tokens };
            },
            astFormat: 'pug-ast',
            hasPragma(text) {
                return text.startsWith('//- @prettier\n') || text.startsWith('//- @format\n');
            },
            locStart(node) {
                logger.debug('[parsers:pug:locStart]:', { node });
                return 0;
            },
            locEnd(node) {
                logger.debug('[parsers:pug:locEnd]:', { node });
                return 0;
            },
            preprocess(text, options) {
                logger.debug('[parsers:pug:preprocess]:', { text });
                return text;
            }
        }
    },
    printers: {
        'pug-ast': {
            print(path, options, print) {
                const entry = path.stack[0];
                const { content, tokens } = entry;
                const pugOptions = converge_1.convergeOptions(options);
                const printer = new printer_1.PugPrinter(content, tokens, pugOptions);
                const result = printer.build();
                logger.debug('[printers:pug-ast:print]:', result);
                return result;
            },
            embed(path, print, textToDoc, options) {
                return null;
            },
            insertPragma(text) {
                return `//- @prettier\n${text}`;
            }
        }
    },
    options: options_1.options,
    defaultOptions: {}
};
exports.languages = exports.plugin.languages;
exports.parsers = exports.plugin.parsers;
exports.printers = exports.plugin.printers;
exports.options = exports.plugin.options;
exports.defaultOptions = exports.plugin.defaultOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBYUEsaUNBQWlDO0FBQ2pDLHFDQUEwRDtBQUUxRCx1Q0FBa0Q7QUFDbEQsaURBQXFEO0FBRXJELHVDQUF1QztBQUV2QyxNQUFNLE1BQU0sR0FBVyxxQkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssTUFBTSxFQUFFO0lBQ3BDLE1BQU0sQ0FBQyxXQUFXLENBQUMsaUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUNuQztBQU9ZLFFBQUEsTUFBTSxHQUFXO0lBQzdCLFNBQVMsRUFBRTtRQUNWO1lBQ0MsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDaEIsT0FBTyxFQUFFLFdBQVc7WUFDcEIsT0FBTyxFQUFFLE1BQU07WUFDZixjQUFjLEVBQUUsS0FBSztZQUNyQixrQkFBa0IsRUFBRSxZQUFZO1lBQ2hDLFVBQVUsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDN0Isa0JBQWtCLEVBQUUsR0FBRztZQUN2QixpQkFBaUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7U0FDbEM7S0FDRDtJQUNELE9BQU8sRUFBRTtRQUNSLEdBQUcsRUFBRTtZQUNKLEtBQUssQ0FBQyxJQUFZLEVBQUUsT0FBeUMsRUFBRSxPQUFzQjtnQkFDcEYsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBRS9DLElBQUksd0JBQXdCLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ2xFLE1BQU0sa0JBQWtCLEdBQTJCLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDekYsSUFBSSxrQkFB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