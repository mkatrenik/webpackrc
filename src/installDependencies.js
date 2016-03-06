'use strict';

const spawn = require('cross-spawn');
const debug = require('./utils').debug;
const path = require('path');

/**
 * generate npm install args
 * @param {Object} props
 * @returns {Array<String>}
 */
function generateInstallArgs(props) {
  if (!props.name) {
    throw new Error('Missing dependency name');
  }
  let name = props.name;

  if (props.version) {
    name = `${name}@${props.version}`;
  }

  let save = '--save-dev';

  if (props.saveProd) {
    save = '--save';
  }

  return [name, save];
}

/**
 * install plugin's dependency
 * @param {String} dep
 * @returns {Object}
 */
function installPackage(dep) {
  const args = ['install'].concat(dep).filter(Boolean);
  debug('Running `npm %s`', args.join(' '));
  const output = spawn.sync('npm', args, {stdio: 'inherit'});
  return output;
}

/**
 * diff already installed & missing deps with package.json
 * @param {Array<Object>} pkgs
 */
function install(pkgs) {
  let pkg = {};
  try {
    pkg = require(path.join(process.cwd(), 'package.json'));
  } catch (err) {
    console.log('Missing package.json, run `npm init -y`');
    process.exit(1);
  }
  const installedDeps = [].concat(
    Object.keys(pkg.devDependencies || {}),
    Object.keys(pkg.dependencies || {})
  );

  debug(`Already installed dependencies ${installedDeps.join()}`);

  const notInstalledDeps = pkgs.filter(p =>
    installedDeps.indexOf(p.name) === -1
  );

  notInstalledDeps.forEach(p => {
    installPackage(generateInstallArgs(p));
  });
}

module.exports = install;
module.exports.installPackage = installPackage;
module.exports.generateInstallArgs = generateInstallArgs;
