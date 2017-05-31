'use strict';
/*eslint strict:0*/

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes 100% height/width inline styles on svg element when no viewBox is specified';

function cssTextToPropertyMap(str) {
  if (!str) {
    return new Map();
  }
  let props = new Map(str.split(/\s*;\s*/).map(nv => {
    return nv.split(/\s*:\s*/);
  }));
  return props;
}
function propertyMapToCssText(prop) {
  let str = '';
  for (let [name,value] of prop.entries()) {
    str += `${name}: ${value};`;
  }
  return str;
}

exports.fn = function(item) {
  if (item.elem && item.isElem('svg') &&
      !item.hasAttr('viewBox')) {
    let attr = item.attr('style');
    if (attr){
      let props = cssTextToPropertyMap(attr.value);

      let propsChanged = false;
      if (props.has('height') && props.get('height') == '100%') {
        props.delete('height');
        propsChanged = true;
      }
      if (props.has('width') && props.get('width') == '100%') {
        props.delete('width');
        propsChanged = true;
      }
      if (propsChanged) {
        attr.value = propertyMapToCssText(props);
      }
    }
  }
  return true;
};
