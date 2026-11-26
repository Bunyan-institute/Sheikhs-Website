import test from 'node:test';
import assert from 'node:assert/strict';
import { getConfiguredCredentials, hashPassword, verifyAdminCredentials } from '../src/lib/auth/credentials.ts';

test('production has no demo fallback; development keeps the explicit development login', () => {
  assert.equal(getConfiguredCredentials({NODE_ENV:'production'}), null);
  assert.equal(verifyAdminCredentials('admin','sheikh_admin_2026!',{NODE_ENV:'production'}),false);
  assert.equal(verifyAdminCredentials('admin','sheikh_admin_2026!',{NODE_ENV:'development'}),true);
});
test('scrypt credentials reject old passwords, wrong names and malformed hashes without throwing', () => {
  const env={NODE_ENV:'production',ADMIN_USERNAME:'sheikh_admin',ADMIN_PASSWORD_HASH:hashPassword('generated-test-secret')};
  assert.equal(verifyAdminCredentials('sheikh_admin','generated-test-secret',env),true);
  assert.equal(verifyAdminCredentials('sheikh_admin','wrong',env),false);
  assert.equal(verifyAdminCredentials('admin','generated-test-secret',env),false);
  for(const value of ['salt:','salt:00',':','bad','aa:ff:cc']) assert.equal(verifyAdminCredentials('sheikh_admin','generated-test-secret',{...env,ADMIN_PASSWORD_HASH:value}),false);
});
