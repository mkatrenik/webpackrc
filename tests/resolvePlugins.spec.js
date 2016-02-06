'use strict';

const assert = require('assert');
const resolvePlugins = require('../src/resolvePlugins');
const fs = require('fs');
const sinon = require('sinon');
const path = require('path');

describe('resolvePlugins.js', () => {
  describe('default()', () => {
    before(() => {
      sinon.stub(process, 'cwd', () => path.join(__dirname, 'mocks'));
    });

    after(() => {
      process.cwd.restore();
    });

    it('should return plugin functions', () => {
      const plugins = resolvePlugins({
        entry: 'foo.js',
        plugins: ['./_customPlugin']
      });
      assert(plugins.length === 8);
    });

    it('should load babel/typescript based on `entry` suffix', () => {
      let plugins = resolvePlugins({entry: 'foo.js', plugins: []});
      let hasBabel = plugins.filter(p => p.name === 'babel').length;
      assert(hasBabel === 1);

      plugins = resolvePlugins({entry: 'foo.jsx', plugins: []});
      hasBabel = plugins.filter(p => p.name === 'babel').length;
      assert(hasBabel === 1);

      plugins = resolvePlugins({entry: 'foo.ts', plugins: []});
      let hasTs = plugins.filter(p => p.name === 'typescript').length;
      assert(hasTs === 1);

      plugins = resolvePlugins({entry: 'foo.tsx', plugins: []});
      hasTs = plugins.filter(p => p.name === 'typescript').length;
      assert(hasTs === 1);
    });
  });

  describe('lookupPlugin()', () => {
    it('should return plugin from default plugins', () => {
      const p = resolvePlugins.lookupPlugin('json');
      const configMock = {
        module: {loaders: []}
      };
      p(configMock);
      assert(typeof p === 'function');
      assert(configMock.module.loaders[0].loader === 'json');
    });
  });

  describe('getLocalPlugin()', () => {
    before(() => {
      sinon.stub(process, 'cwd', () => path.join(__dirname, 'mocks'));
    });

    after(() => {
      process.cwd.restore();
    });

    it('should return plugin if it\'s local to current directry', () => {
      const configMock = {
        module: {loaders: []}
      };
      const p = resolvePlugins.getLocalPlugin('_customPlugin');
      p(configMock);
      assert(configMock.module.loaders[0].loader === 'foo');
    });
  });
});
