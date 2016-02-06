'use strict';

const assert = require('assert');
const loadConfig = require('../src/loadRcFile');
const sinon = require('sinon');
const path = require('path');

describe('loadRcFile.js', () => {
  describe('default()', () => {
    beforeEach(() => {
      sinon.stub(process, 'cwd', () => path.join(__dirname, 'mocks'));
    });

    afterEach(() => {
      process.cwd.restore();
    });

    it('should throw on missing env prop', () => {
      assert.throws(() => loadConfig({}));
    });

    it('should load rc file', () => {
      const config = loadConfig({env: 'development'});
      assert(config.env.development.plugins[0] === 'tslint');
    });

    it('should return default config on missing rc file', () => {
      process.cwd.restore();
      sinon.stub(process, 'cwd', () => path.join(__dirname, 'foo'));

      const config = loadConfig({env: 'production'});
      assert(config.env.production.plugins.length === 0);
    });

    it('should return default config on different env', () => {
      const config = loadConfig({env: 'production'});
      assert(config.env.production.plugins.length === 0);
    });
  });
});
