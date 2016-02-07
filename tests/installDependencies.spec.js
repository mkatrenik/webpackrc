'use strict';
const sinon = require('sinon');
const spawn = require('cross-spawn');
const assert = require('assert');
const install = require('../src/installDependencies');
const path = require('path');

const installPackage = install.installPackage;
const generateInstallArgs = install.generateInstallArgs;

describe('installDependencies.js', () => {
  describe('default()', () => {
    beforeEach(() => {
      sinon.stub(spawn, 'sync');
      sinon.stub(process, 'cwd', () => path.join(__dirname, 'mocks'));
    });

    afterEach(() => {
      spawn.sync.restore();
      process.cwd.restore();
    });

    it('shouldn\'t install already installed dependency', () => {
      const params = [{name: 'babel'}];
      install(params);
      assert(spawn.sync.notCalled);
    });

    it('should install missing dependency', () => {
      const params = [{name: 'babel-core', version: '1.2.3'}];
      install(params);
      assert(spawn.sync.calledOnce);
    });
  });

  describe('installPackage()', () => {
    beforeEach(() => {
      sinon.stub(spawn, 'sync');
    });

    afterEach(() => spawn.sync.restore());

    it('should spawn process with right args', () => {
      installPackage('babel --save');
      const args = spawn.sync.getCall(0).args;
      assert.deepEqual(args, ['npm', ['install', 'babel --save'], { stdio: 'inherit' }]);
    });
  });

  describe('generateInstallArgs()', () => {
    it('should work with version', () => {
      const p = generateInstallArgs({name: 'babel', version: '^2.1'});
      assert.deepEqual(p,['babel@^2.1', '--save-dev']);
    });

    it('should override save-dev', () => {
      const p = generateInstallArgs({name: 'babel', saveProd: true});
      assert.deepEqual(p, ['babel', '--save']);
    });
  });
});