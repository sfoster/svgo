'use strict';
/*eslint strict:0*/

exports.type = 'perItem';

exports.active = true;

exports.description = 'Replace matching fill attribute values with "context-fill"';

var re = /-moz-user-select:\s*none;?/;
exports.fn = function(item, params) {
  if (params && params.fill) {
    let fillColors = typeof params.fill === 'string' ? [params.fill] : params.fill;
    // console.log('got fill param: ', fillColors);
    if (item.elem && item.hasAttr('fill')) {
      let attr = item.attr('fill');
      // TODO: could normalize to hex triplet
      if (fillColors.includes(attr.value)) {
        attr.value = 'context-fill';
      } else {
        console.warn('no substitute for :', attr.value);
      }
    }
  }
  return true;
}
