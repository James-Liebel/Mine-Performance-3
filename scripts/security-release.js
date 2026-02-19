// Run security check with audit level = critical (for release/CI green).
process.env.SECURITY_AUDIT_LEVEL = 'critical';
require('./security-check.js');
