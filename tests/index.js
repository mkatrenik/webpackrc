require('harmonize')();

const assert = require('assert');
const p = require('../src/plugins');

const configPlugins = p.configPlugins;
const pkg = p.pkg;

describe('plugins.js', () => {
  describe('pkg()', () => {
    it('should work with name', () => {
      const p = pkg({name: 'babel'});
      assert(p === 'babel --save-dev');
    });

    it('should work with version', () => {
      const p = pkg({name: 'babel', version: '^2.1'});
      assert(p === 'babel@^2.1 --save-dev');
    });

    it('should override save-dev', () => {
      const p = pkg({name: 'babel', saveProd: true});
      assert(p === 'babel --save');
    });

    it('should fail without name', () => {
      assert.throws(() => pkg({name: ''}));
    });
  });
});