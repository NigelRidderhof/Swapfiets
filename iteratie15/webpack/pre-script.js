const packageJson = require('../package.json');

const currentNodeVersionFull = process.versions.node;
const currentNodeVersionMinimal = currentNodeVersionFull.split('.')[0];
const preferredNodeVersionMinimal = packageJson.config.node;

if (preferredNodeVersionMinimal > currentNodeVersionMinimal) {
  console.error('');
  console.error('==================');
  console.error('\x1b[31m%s\x1b[0m', '  ERROR: You are not using the configured node version. You have version ' + currentNodeVersionMinimal + ', version ' + currentNodeVersionFull + ' is expected');
  console.error('\x1b[36m%s\x1b[0m', '  $ nvm install ' + preferredNodeVersionMinimal);
  console.error('\x1b[36m%s\x1b[0m', '  $ nvm use ' + preferredNodeVersionMinimal);
  console.error('==================');
  console.error('');
  process.exit(1);
}

if (currentNodeVersionMinimal > preferredNodeVersionMinimal) {
  console.warn('');
  console.warn('==================');
  console.warn('\x1b[33m%s\x1b[0m', '  WARN: NodeJS version ' + currentNodeVersionMinimal + ' is configured while version ' + preferredNodeVersionMinimal + ' is used.');
  console.warn('\x1b[33m%s\x1b[0m', '  WARN: It is adviced to use the configured version. The CI/CD server WILL use this version when building your assets!');
  console.warn('\x1b[36m%s\x1b[0m', '  $ nvm install ' + preferredNodeVersionMinimal);
  console.warn('\x1b[36m%s\x1b[0m', '  $ nvm use ' + preferredNodeVersionMinimal);
  console.warn('==================');
  console.warn('');
}

/**
 * Do NOT allow using `npm` as package manager.
 */
if (process.env.npm_execpath.indexOf('pnpm') === -1) {
  console.warn('');
  console.warn('==================');
  console.error('\x1b[31m%s\x1b[0m', '  You must use Pnpm to install dependencies:');
  console.error('\x1b[36m%s\x1b[0m', '  $ pnpm install');
  console.warn('==================');
  console.warn('');
  process.exit(1);
}

process.exit(0);
