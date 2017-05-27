'use strict';
/*eslint strict:0*/

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes useless clipPaths';

var regViewBox = /^0\s*[,\s]\s*0\s*[,\s]\s*([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)\s*[,\s]\s*([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)$/;
var viewBoxElems = ['svg', 'pattern'];
var path2js = require('./_path.js').path2js;

var width, height;
var uselessClipPathIds = {};

var lastSvg;

exports.fn = function(item) {
  let keep = handleElement(item);

  console.log('keep item %s: %s', item.elem, keep);
  return keep === undefined ? true : keep;
}

function handleElement(item) {
  if (item.isElem('svg')) {
    // reset at each new document
    uselessClipPathIds = {};
  }

  if (item.isElem('g')) {
    // E.g. <g mask="url(#cS)" clip-path="url(#cT)">
    if (item.hasAttr('clip-path')) {
      let match = item.attr('clip-path').value.match(/^url\(#([^\)]+)\)/);
      if (match && match[1] in uselessClipPathIds) {
        console.log('removing matching clip-path: ' + match[1]);
        item.removeAttr('clip-path');
      }
    }
  }

  if (item.isElem(viewBoxElems)) {
    let w = item.hasAttr('width') && item.attr('width').value;
    let h = item.hasAttr('height') && item.attr('width').value;
    if (item.hasAttr('viewBox')) {
      let match = item.attr('viewBox').value.match(regViewBox);
      w = match[1];
      h = match[3];
    }

    if (!isNaN(w) && !isNaN(w)) {
      width = w;
      height = h;
    }
    // console.log('found width: %s, height: %s: ', width, height);
    return true;
  }

  if (item.isElem('clipPath')) {
    let hasUsefulPath = false;

    let clipId = item.hasAttr('id') && item.attr('id').value;
    if (!item.content) {
      return true;
    }
    if (isNaN(width) || isNaN(height)) {
      console.log('removeUselessClipPaths, got clipPath, but no width or height yet');
      return true;
    }
    let pathData;
    item.content.forEach(function(g) {
      if (g.isElem('path')) {
        pathData = path2js(g);
        let bounds = getBounds(pathData);
        if (bounds.w < width || bounds.h < height) {
          hasUsefulPath = true;
        }
        console.log('clipPath: %s, bounds: ', clipId, bounds, width, height);
      }
    });
    // console.log('returning hasUsefulPath: ', hasUsefulPath);
    if (!hasUsefulPath) {
      uselessClipPathIds[clipId] = item;
    }
    console.log('removeUselessClipPaths, %s is useful? %s', clipId, hasUsefulPath);
    return hasUsefulPath;
  }
  // keep everything else
  return true;
};

function getBounds(pathData) {
  // XXX: very brittle bounding box impl. Expecting simple rects.
  let x = 0,
      y = 0;
  let width = 0,
      height = 0;
  pathData.forEach(i => {
    switch (i.instruction) {
    case 'm':
      x += i.data[0];
      if (typeof i.data[1] == 'number') {
        y += i.data[1];
      }
      break;
    case 'M':
      x = i.data[0];
      if (typeof i.data[1] == 'number') {
        y = i.data[1];
      }
      break;
    case 'h':
      x += i.data[0];
      break;
    case 'H':
      x = i.data[0];
      break;
    case 'v':
      y += i.data[0];
      break;
    case 'V':
      y = i.data[0];
      break;
    case 'z':
      break;
    default:
      console.warn('getBounds, instruction not handled: ', i);
    }
    width = Math.max(width, x);
    height = Math.max(height, y);
  });
  return {w: width, h: height};
}
