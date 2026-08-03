/**
 * Jest Global Teardown — stops the local HTTP server after all tests.
 */

module.exports = async function globalTeardown() {
  if (global.__SERVER_STARTED__ && global.__SERVER_PROCESS__) {
    console.log('\n  [global-teardown] Stopping HTTP server...');
    try {
      // Kill the process tree (Python on Windows spawns child processes)
      if (process.platform === 'win32') {
        const { execSync } = require('child_process');
        execSync(`taskkill /pid ${global.__SERVER_PROCESS__.pid} /f /t`, { stdio: 'ignore' });
      } else {
        global.__SERVER_PROCESS__.kill('SIGTERM');
      }
      console.log('  [global-teardown] Server stopped.');
    } catch (e) {
      // Process may have already exited
      console.log('  [global-teardown] Server already stopped.');
    }
  } else {
    console.log('\n  [global-teardown] Server was not started by tests, skipping.');
  }
};
