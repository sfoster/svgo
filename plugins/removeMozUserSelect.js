'use strict';
/*eslint strict:0*/

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes moz-user-select style property';

var re = /-moz-user-select:\s*none;?/;
exports.fn = function(item) {
  if (item.elem && item.hasAttr('style')) {
    let styleAttr = item.attr('style');
    let styleValue = styleAttr.value;
    var newStyleValue = styleValue.replace(re, '');
    if (newStyleValue !== styleValue) {
      styleAttr.value = newStyleValue;
    }
  }
  return true;
}
