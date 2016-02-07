const assert = require('assert');
const p = require('../src/defaultPlugins');

const configPlugins = p.configPlugins;
const pkg = p.pkg;

describe('defaultPlugins.js', () => {
  describe('pkg()', () => {
    it('should work with name', () => {
      const params = {name: 'babel'};
      const p = pkg(params);
      assert.equal(p, params);
    });

    it('should fail without name', () => {
      assert.throws(() => pkg({name: ''}));
    });
  });
});