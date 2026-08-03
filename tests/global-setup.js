/**
 * Jest Global Setup — starts a local HTTP server before all tests.
 * Uses Python's built-in http.server (available on all platforms).
 */

const { spawn } = require('child_process');
const http = require('http');

const PORT = process.env.TEST_PORT || 8000;
const CWD = require('path').resolve(__dirname, '..');

let serverProcess;

function waitForServer(port, maxRetries = 30) {
  return new Promise((resolve, reject) => {
    let retries = 0;
    const check = () => {
      const req = http.get(`http://localhost:${port}/`, (res) => {
        if (res.statusCode === 200 || res.statusCode === 301) {
          resolve();
        } else if (++retries < maxRetries) {
          setTimeout(check, 500);
        } else {
          reject(new Error(`Server responded with status ${res.statusCode}`));
        }
      });
      req.on('error', () => {
        if (++retries < maxRetries) {
          setTimeout(check, 500);
        } else {
          reject(new Error('Server failed to start'));
        }
      });
      req.end();
    };
    check();
  });
}

module.exports = async function globalSetup() {
  // Check if a server is already running (e.g., local dev)
  const alreadyRunning = await new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}/`, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 301);
    });
    req.on('error', () => resolve(false));
    req.end();
  });

  if (alreadyRunning) {
    console.log(`\n  [global-setup] Server already running on port ${PORT}, reusing.`);
    global.__SERVER_STARTED__ = false;
    return;
  }

  // Start Python HTTP server
  console.log(`\n  [global-setup] Starting Python http.server on port ${PORT}...`);
  serverProcess = spawn('python', ['-m', 'http.server', String(PORT)], {
    cwd: CWD,
    stdio: 'ignore',
    shell: true,
  });

  try {
    await waitForServer(PORT);
    console.log(`  [global-setup] Server ready at http://localhost:${PORT}`);
    global.__SERVER_STARTED__ = true;
    global.__SERVER_PROCESS__ = serverProcess;
  } catch (err) {
    console.error(`  [global-setup] Failed to start server: ${err.message}`);
    throw err;
  }
};
