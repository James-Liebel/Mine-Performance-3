#!/usr/bin/env node
/**
 * Security check: npm audit and optional secret scan.
 * Run: npm run security:check
 * Env:
 *   SKIP_AUDIT=1          - skip npm audit
 *   RUN_GITLEAKS=1        - run gitleaks if installed
 *   SECURITY_AUDIT_LEVEL  - minimum severity to fail on: critical (default), high, moderate
 */
const { execSync, spawnSync } = require('child_process');

const skipAudit = process.env.SKIP_AUDIT === '1';
const runGitleaks = process.env.RUN_GITLEAKS === '1';
const auditLevel = process.env.SECURITY_AUDIT_LEVEL || 'high';

let failed = false;

if (!skipAudit) {
  console.log(`Running npm audit (fail on ${auditLevel}+)...`);
  try {
    execSync(`npm audit --audit-level=${auditLevel}`, { stdio: 'inherit' });
  } catch (e) {
    failed = true;
    console.error(`npm audit found ${auditLevel} or higher vulnerabilities. Fix with npm audit fix or upgrade packages.`);
  }
}

if (runGitleaks) {
  console.log('Running gitleaks (secret scan)...');
  const r = spawnSync('gitleaks', ['detect', '--no-git', '--source', '.', '--verbose'], {
    stdio: 'inherit',
    shell: true,
  });
  if (r.status !== 0) {
    failed = true;
    console.error('gitleaks found potential secrets. Do not commit secrets.');
  }
} else {
  console.log('Tip: Install gitleaks and set RUN_GITLEAKS=1 to run secret scanning.');
}

process.exit(failed ? 1 : 0);
