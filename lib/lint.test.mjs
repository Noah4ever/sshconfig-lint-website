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
      data: { directive: 'Port', max: 65535, min: 1, target: value },
      line: 1,
      messageKey: 'invalidIntegerRange',
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

test('browser validates bounded integer directives', () => {
  const valid = [
    'ConnectionAttempts 1',
    'ConnectionAttempts +1',
    'NumberOfPasswordPrompts 0',
    'ServerAliveCountMax 2147483647',
    'CanonicalizeMaxDots "3"',
  ];
  const invalid = [
    'ConnectionAttempts 0',
    'ConnectionAttempts 2147483648',
    'NumberOfPasswordPrompts -1',
    'ServerAliveCountMax 1.5',
    'CanonicalizeMaxDots',
  ];

  valid.forEach((source) => assert.deepEqual(invalidValues(source), [], source));
  invalid.forEach((source) => assert.equal(invalidValues(source).length, 1, source));
});

test('browser accepts OpenSSH time syntax and rejects malformed times', () => {
  for (const directive of ['ConnectTimeout', 'ServerAliveInterval']) {
    for (const value of ['0', 'none', '1m30s', '1.5s', '.5s', '"1m"']) {
      assert.deepEqual(invalidValues(`${directive} ${value}`), [], `${directive} ${value}`);
    }
    for (const value of ['-1', '+1', 'NONE', '1.', '1.5m', '1e3', '1m 2m', '2147483648']) {
      assert.equal(invalidValues(`${directive} ${value}`).length, 1, `${directive} ${value}`);
    }
  }
});

test('browser requires a complete octal StreamLocalBindMask', () => {
  for (const value of ['0', '0177', '777', '+0777', '"0177"']) {
    assert.deepEqual(invalidValues(`StreamLocalBindMask ${value}`), []);
  }
  for (const value of ['-1', '0788', '888', '1000', '777junk', '0o177', '0177 0777']) {
    assert.equal(invalidValues(`StreamLocalBindMask ${value}`).length, 1, value);
  }
});

test('browser validates one or two IPQoS arguments', () => {
  for (const value of ['none', 'af21', 'AF21 CS1', '0', '255', '+1', 'va', 'lowdelay']) {
    assert.deepEqual(invalidValues(`IPQoS ${value}`), [], value);
  }
  for (const value of ['-1', '256', '1.5', 'bogus', 'af21 bogus', 'af21 cs1 ef']) {
    assert.equal(invalidValues(`IPQoS ${value}`).length, 1, value);
  }
});

test('browser reports canonical names in every scope', () => {
  const findings = invalidValues([
    'connectionattempts 0',
    'Host example.com',
    '  serveralivecountmax -1',
    'Match host internal.example.com',
    '  streamlocalbindmask 0788',
  ].join('\n'));

  assert.deepEqual(findings.map((finding) => [finding.line, finding.data.directive]), [
    [1, 'ConnectionAttempts'],
    [3, 'ServerAliveCountMax'],
    [5, 'StreamLocalBindMask'],
  ]);
});

const enumCases = [
  ['AddressFamily', ['any', 'inet', 'inet6']],
  ['RequestTTY', ['true', 'false', 'yes', 'no', 'force', 'auto']],
  ['SessionType', ['none', 'subsystem', 'default']],
  ['ControlMaster', ['true', 'false', 'yes', 'no', 'auto', 'ask', 'autoask']],
  ['CanonicalizeHostname', ['true', 'false', 'yes', 'no', 'always']],
  ['StrictHostKeyChecking', ['true', 'false', 'yes', 'no', 'ask', 'off', 'accept-new']],
  ['UpdateHostKeys', ['true', 'false', 'yes', 'no', 'ask']],
  ['VerifyHostKeyDNS', ['true', 'false', 'yes', 'no', 'ask']],
  ['Tunnel', ['ethernet', 'point-to-point', 'true', 'false', 'yes', 'no']],
  ['LogLevel', ['QUIET', 'FATAL', 'ERROR', 'INFO', 'VERBOSE', 'DEBUG', 'DEBUG1', 'DEBUG2', 'DEBUG3']],
  ['SyslogFacility', ['DAEMON', 'USER', 'AUTH', 'AUTHPRIV', 'LOCAL0', 'LOCAL1', 'LOCAL2', 'LOCAL3', 'LOCAL4', 'LOCAL5', 'LOCAL6', 'LOCAL7']],
  ['PubkeyAuthentication', ['true', 'false', 'yes', 'no', 'unbound', 'host-bound']],
];

test('browser accepts every enumerated OpenSSH value case-insensitively and quoted', () => {
  for (const [directive, values] of enumCases) {
    for (const value of values) {
      for (const rendered of [value, value.toUpperCase(), `"${value}"`]) {
        assert.deepEqual(invalidValues(`${directive} ${rendered}`), [], `${directive} ${rendered}`);
      }
    }
  }
});

test('browser rejects invalid enum values, empty values, extra arguments, and near misses', () => {
  const nearMisses = [
    ['AddressFamily', 'ipv4'], ['RequestTTY', 'always'], ['SessionType', 'shell'],
    ['ControlMaster', 'auto-ask'], ['CanonicalizeHostname', 'auto'],
    ['StrictHostKeyChecking', 'accept_new'], ['UpdateHostKeys', 'confirm'],
    ['VerifyHostKeyDNS', 'secure'], ['Tunnel', 'pointtopoint'], ['LogLevel', 'DEBUG4'],
    ['SyslogFacility', 'LOCAL8'], ['PubkeyAuthentication', 'bound'],
  ];

  for (const [directive] of enumCases) {
    for (const value of ['bogus', '', 'yes extra', '""', '"yes']) {
      const source = value ? `${directive} ${value}` : directive;
      assert.equal(invalidValues(source).length, 1, `${directive} ${JSON.stringify(value)}`);
    }
  }
  for (const [directive, value] of nearMisses) {
    assert.equal(invalidValues(`${directive} ${value}`).length, 1, `${directive} ${value}`);
  }
});

test('browser validates enum values in root, Host, and Match scopes', () => {
  const findings = invalidValues([
    'AddressFamily ipv4',
    'Host example.com',
    '  ControlMaster auto-ask',
    'Match host internal.example.com',
    '  PubkeyAuthentication bound',
  ].join('\n'));

  assert.deepEqual(findings.map((finding) => [finding.line, finding.data.directive]), [
    [1, 'AddressFamily'],
    [3, 'ControlMaster'],
    [5, 'PubkeyAuthentication'],
  ]);
});

const withCode = (source, code) => lintConfig(source).findings
  .filter((finding) => finding.code === code);

test('browser warns only for Host blocks made entirely from negated patterns', () => {
  const findings = withCode([
    'Host !internal !legacy',
    '  User deploy',
    'Host production !retired',
    '  User deploy',
    'Host * !development',
    '  User deploy',
  ].join('\n'), 'NEGATED_HOST');

  assert.deepEqual(findings, [{
    code: 'NEGATED_HOST',
    data: { patterns: '!internal !legacy' },
    line: 1,
    messageKey: 'negatedOnlyHost',
    severity: 'warning',
  }]);
});

test('browser reports the second proxy mechanism only in the same scope', () => {
  const findings = withCode([
    'Host production',
    '  ProxyCommand ssh jump -W %h:%p',
    '  ProxyJump bastion',
    'Host staging',
    '  ProxyJump staging-jump',
    'Match host internal.example.com',
    '  ProxyJump internal-jump',
    '  ProxyCommand ssh jump -W %h:%p',
  ].join('\n'), 'PROXY_CONFLICT');

  assert.deepEqual(findings, [
    {
      code: 'PROXY_CONFLICT',
      data: { first: 2, firstDirective: 'ProxyCommand', ignoredDirective: 'ProxyJump' },
      line: 3,
      messageKey: 'proxyConflict',
      severity: 'warning',
    },
    {
      code: 'PROXY_CONFLICT',
      data: { first: 7, firstDirective: 'ProxyJump', ignoredDirective: 'ProxyCommand' },
      line: 8,
      messageKey: 'proxyConflict',
      severity: 'warning',
    },
  ]);
});

test('browser only warns for LocalCommand when enablement is certainly absent', () => {
  assert.equal(withCode('LocalCommand logger connected', 'LOCAL_COMMAND_DISABLED').length, 1);
  assert.equal(withCode('PermitLocalCommand no\nLocalCommand logger connected', 'LOCAL_COMMAND_DISABLED').length, 1);
  assert.deepEqual(withCode('PermitLocalCommand yes\nLocalCommand logger connected', 'LOCAL_COMMAND_DISABLED'), []);
  assert.deepEqual(withCode('Include local.conf\nLocalCommand logger connected', 'LOCAL_COMMAND_DISABLED'), []);
});

test('browser validates directive-specific percent tokens and escaped percents', () => {
  const findings = withCode([
    'Hostname %n',
    'ProxyCommand ssh jump -W %C',
    'LocalCommand echo %% %Z',
    'ControlPath ~/.ssh/%%-%C',
    'Include %d/.ssh/config.d/%h',
  ].join('\n'), 'INVALID_TOKEN');

  assert.deepEqual(findings.map((finding) => [finding.line, finding.data.token]), [
    [1, '%n'],
    [2, '%C'],
    [3, '%Z'],
  ]);
});

test('browser validates Match exec tokens without treating other criteria as commands', () => {
  assert.deepEqual(withCode('Match exec "test %d = /home/deploy"\n  User deploy', 'INVALID_TOKEN'), []);
  const findings = withCode('Match host production exec "test %T = NONE"\n  User deploy', 'INVALID_TOKEN');
  assert.equal(findings.length, 1);
  assert.equal(findings[0].line, 1);
  assert.equal(findings[0].data.token, '%T');
});
