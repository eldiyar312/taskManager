// https://github.com/jestjs/jest/issues/6814#issuecomment-718824886
const glob = require('glob');

const { execSync } = require('child_process');

const shell = (cmd) => execSync(cmd, { stdio: 'inherit' });

const run = async () => {
  console.info(
    'Running tests in batches to avoid memory leak issue... this means you will see jest start up multiple times.'
  );

  const files = await glob.sync('./**/*.test.ts');

  const cliArguments = process.argv.slice(2).join(''); // Example -u

  const batchSize = 20;
  let batch = [];
  const runBatch = () => {
    const command = `jest ${batch.join(' ')} ${cliArguments}`;
    console.log('Running command: ', command);
    if (batch.length) {
      shell(command);
      batch = [];
    }
  };

  for (const file of files) {
    batch.push(file);
    if (batch.length === batchSize) {
      runBatch();
    }
  }

  runBatch();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
