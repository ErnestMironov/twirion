"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVueVOnExpression = exports.isVueVForWithOf = exports.isVueExpression = exports.isVueEventBinding = void 0;
function isVueEventBinding(name) {
    return /^(v-on:|@).*/.test(name);
}
exports.isVueEventBinding = isVueEventBinding;
function isVueExpression(name) {
    return /^((v-(bind|slot))?:|v-(model|if|for|else-if|text|html)).*/.test(name);
}
exports.isVueExpression = isVueExpression;
function isVueVForWithOf(name, val) {
    return 'v-for' === name && val.includes('of');
}
exports.isVueVForWithOf = isVueVForWithOf;
function isVueVOnExpression(name) {
    return 'v-on' === name;
}
exports.isVueVOnExpression = isVueVOnExpression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3Z1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFzQkEsU0FBZ0IsaUJBQWlCLENBQUMsSUFBWTtJQUM3QyxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUZELDhDQUVDO0FBeUJELFNBQWdCLGVBQWUsQ0FBQyxJQUFZO0lBQzNDLE9BQU8sMkRBQTJELENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFGRCwwQ0FFQztBQXVCRCxTQUFnQixlQUFlLENBQUMsSUFBWSxFQUFFLEdBQVc7SUFDeEQsT0FBTyxPQUFPLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUZELDBDQUVDO0FBc0JELFNBQWdCLGtCQUFrQixDQUFDLElBQVk7SUFDOUMsT0FBTyxNQUFNLEtBQUssSUFBSSxDQUFDO0FBQ3hCLENBQUM7QUFGRCxnREFFQyJ9