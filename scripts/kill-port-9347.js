// Free e2e port so webServer can bind. No-op if port is free.
const killPort = require('kill-port');
const PORT = 19347;
killPort(PORT)
  .catch(() => {})
  .then(() => new Promise((r) => setTimeout(r, 1500)))
  .then(() => {
    require('child_process').execSync('npx playwright test', {
      stdio: 'inherit',
      env: { ...process.env, PLAYWRIGHT_PORT: String(PORT), PORT: String(PORT) },
    });
  });
