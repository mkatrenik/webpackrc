const parseArgs = require('minimist');
const pkg = require('../package.json');
const path = require('path');

function parse() {
  const args = parseArgs(process.argv.slice(2), {
    alias: {
      h: 'help',
      v: 'version',
      d: 'dist'
    },
    boolean: ['help', 'version'],
    default: {
      'server-port': 3000,
      'server-base': process.cwd()
      // 'dist': path.join(process.cwd(), 'dist')
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
    console.log('  -d, --dist       build directory(default: dist), no dev server is started');
    console.log('  --server-base    static file\'s base path');
    console.log('  --server-port    port to run the webpack dev server on [default: 3000]');
    console.log('  -v, --version print heatpack\'s version');
    return process.exit(0);
  }
  args.entry = path.resolve(args._[0]);
  if (args.dist && typeof args.dist === 'string') {
    args.distDir = path.resolve(args.dist);
  } else {
    args.distDir = process.cwd();
  }
  return args;
}

module.exports = parse;
