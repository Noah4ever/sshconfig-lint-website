import assert from 'node:assert/strict';
import test from 'node:test';
import { lintConfig } from './lint.ts';

const invalidValues = (source) => lintConfig(source).findings
  .filter((finding) => finding.code === 'INVALID_VALUE');

test('browser accepts valid Port boundaries', () => {
  for (const value of ['1', '22', '65535']) {
    assert.deepEqual(invalidValues(`Port ${value}`), []);
  }
});

test('browser rejects invalid Port values', () => {
  for (const value of ['0', '65536', '-1', '22.5', 'ssh', '']) {
    const source = value ? `Port ${value}` : 'Port';
    const findings = invalidValues(source);
    assert.equal(findings.length, 1, `expected one finding for Port ${JSON.stringify(value)}`);
    assert.deepEqual(findings[0], {
      code: 'INVALID_VALUE',
      data: { directive: 'Port', target: value },
      line: 1,
      messageKey: 'invalidValue',
      severity: 'error',
    });
  }
});

test('browser validates Port in root, Host, and Match scopes', () => {
  const findings = invalidValues([
    'Port 0',
    'Host example.com',
    '  Port nope',
    'Match host internal.example.com',
    '  Port 65536',
  ].join('\n'));

  assert.deepEqual(findings.map((finding) => finding.line), [1, 3, 5]);
});

test('browser matches Port case-insensitively', () => {
  assert.equal(invalidValues('pOrT 70000').length, 1);
});
