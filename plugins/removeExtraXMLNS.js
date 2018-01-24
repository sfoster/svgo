'use strict';
/*eslint strict:0*/

exports.type = 'full';

exports.active = true;

exports.description = 'removes extra and unnecessary xmlns attributes from child elements';

var nsStack = [];

exports.fn = function(data) {
  eachElement(data.content[0]);
  return data;
};

function eachElement(item) {
  if (item.elem) {
    let ns = item.hasAttr('xmlns') && item.attr('xmlns').value;
    let inheritedNS = nsStack[nsStack.length - 1];
    if (inheritedNS && ns === inheritedNS) {
      item.removeAttr('xmlns');
    }
    nsStack.push(ns || inheritedNS);
    if (item.content && item.content.length) {
      item.content.forEach(eachElement);
    }
    nsStack.pop();
  }
}

