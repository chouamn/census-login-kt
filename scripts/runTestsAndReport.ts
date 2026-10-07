import { spawnSync } from 'child_process';

function run(command: string, args: string[]): number {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
  return result.status ?? 1;
}

const testExitCode = run('npx', ['cucumber-js']);

// Generate reports whether the run passed or failed — a failing run is
// exactly when you want the report most.
run('npx', ['mchr']);
run('npx', ['ts-node', 'scripts/generatePdfReport.ts']);

// Preserve the real test result so CI still sees pass/fail correctly.
process.exit(testExitCode);
