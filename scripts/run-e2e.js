// Free e2e port then run Playwright so webServer can bind (reuseExistingServer: false).
const { execSync } = require('child_process');
try {
  execSync('npx kill-port 29347', { stdio: 'inherit' });
} catch {
  // Port was already free
}
const deadline = Date.now() + 2000;
while (Date.now() < deadline) {}
execSync('npx playwright test', { stdio: 'inherit' });
