const util = require('util');

module.exports.dump = function dump(data) {
  return util.inspect(data, {showHidden: false, depth: null, colors: true});
};
