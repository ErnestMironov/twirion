"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEmptyAttribute = void 0;
const EMPTY_VALUES = [true, '""', "''"];
function formatEmptyAttribute(token, pugEmptyAttributes, pugEmptyAttributesForceQuotes) {
    const { val, name } = token;
    const forceQuotesPatterns = pugEmptyAttributesForceQuotes.map((pattern) => new RegExp(pattern));
    const isForced = forceQuotesPatterns.some((pattern) => pattern.test(name));
    if (isForced) {
        if (token.val === true) {
            token.val = '""';
        }
        return;
    }
    if (pugEmptyAttributes === 'as-is' || !EMPTY_VALUES.includes(val)) {
        return;
    }
    switch (pugEmptyAttributes) {
        case 'all': {
            if (token.val === true) {
                token.val = '""';
            }
            break;
        }
        case 'none': {
            if (token.val === '""' || token.val === "''") {
                token.val = true;
            }
            break;
        }
    }
}
exports.formatEmptyAttribute = formatEmptyAttribute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvb3B0aW9ucy9lbXB0eS1hdHRyaWJ1dGVzL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLE1BQU0sWUFBWSxHQUE4QixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFTbkUsU0FBZ0Isb0JBQW9CLENBQ25DLEtBQXFCLEVBQ3JCLGtCQUFzQyxFQUN0Qyw2QkFBNEQ7SUFFNUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFFNUIsTUFBTSxtQkFBbUIsR0FBYSw2QkFBNkIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDMUcsTUFBTSxRQUFRLEdBQVksbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEYsSUFBSSxRQUFRLEVBQUU7UUFDYixJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssSUFBSSxFQUFFO1lBQ3ZCLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO1FBQ0QsT0FBTztLQUNQO0lBRUQsSUFBSSxrQkFBa0IsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ2xFLE9BQU87S0FDUDtJQUVELFFBQVEsa0JBQWtCLEVBQUU7UUFDM0IsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUNYLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQUU7Z0JBQ3ZCLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO2FBQ2pCO1lBQ0QsTUFBTTtTQUNOO1FBQ0QsS0FBSyxNQUFNLENBQUMsQ0FBQztZQUNaLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQUU7Z0JBQzdDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO2FBQ2pCO1lBQ0QsTUFBTTtTQUNOO0tBQ0Q7QUFDRixDQUFDO0FBbENELG9EQWtDQyJ9