'use strict';

exports.type = 'full';

exports.active = true;

exports.description = 'adds a Mozilla license comment to the top of the file';

/**
 * Add license comment as first child
 */
const LICENSE =
` This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. `;

exports.fn = function(data, params) {
    // Typical usage is to run this plugin after the removeComments plugin
    // so we don't worry about accumulating duplicate license comments
    data.content.unshift({
      'comment': LICENSE
    });
    return data;
};
