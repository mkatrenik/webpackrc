const parseArgs = require('minimist');
const pkg = require('../package.json');

function parse() {
  const args = parseArgs(process.argv.slice(2), {
    alias: {
      b: 'base',
      h: 'help',
      p: 'port',
      v: 'version'
    },
    boolean: ['help', 'version'],
    default: {
      port: 3000,
      base: process.cwd()
    }
  });

  if (args.version) {
    console.log(`v ${pkg.version}`);
    process.exit(0);
  }
  if (args.help || args._.length === 0) {
    console.log('Usage: webpackrc [options] script');
    console.log('');
    console.log('Options:');
    console.log('  -b, --base    static file\'s base path');
    console.log('  -p, --port    port to run the webpack dev server on [default: 3000]');
    console.log('  -v, --version print heatpack\'s version');
    return process.exit(0);
  }
  args.entry = args._[0];
  return args;
}

module.exports = parse;
