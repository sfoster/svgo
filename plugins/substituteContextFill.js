'use strict';
/*eslint strict:0*/

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes moz-user-select style property';

var re = /-moz-user-select:\s*none;?/;
exports.fn = function(item, params) {
  if (params && params.fill) {
    let fillColor = params.fill;
    // console.log('got fill param: ', fillColor);
    if (item.elem && item.hasAttr('fill')) {
      let attr = item.attr('fill');
      // TODO: could normalize to hex triplet
      if (attr.value === fillColor) {
        attr.value = 'context-fill';
      }
    }
  }
  return true;
}
