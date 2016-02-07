'use strict';

const genConfig = require('../src/generateWebpackConfig');
const assert = require('assert');

describe('generateWebpackConfig.js', () => {
  describe('default()', () => {
    it('should throw when missing params', () => {
      let params = {};
      assert.throws(() => genConfig(params));
      params.entry = 'foo';
      assert.throws(() => genConfig(params));
      params.env = 'test';
      assert.throws(() => genConfig(params));
      params.plugins = null;
      assert.throws(() => genConfig(params));
    });
  });
});
