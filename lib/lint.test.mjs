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
  for (const value of ['0', '65536', '-1', '22.5', 'ssh']) {
    const source = `Port ${value}`;
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
  ];

  valid.forEach((source) => assert.deepEqual(invalidValues(source), [], source));
  invalid.forEach((source) => assert.equal(invalidValues(source).length, 1, source));
});

test('browser accepts OpenSSH time syntax and rejects malformed times', () => {
  for (const directive of ['ConnectTimeout', 'ServerAliveInterval', 'ForwardX11Timeout']) {
    for (const value of ['0', 'none', '1m30s', '1.5s', '.5s', '"1m"']) {
      assert.deepEqual(invalidValues(`${directive} ${value}`), [], `${directive} ${value}`);
    }
    for (const value of ['-1', '+1', 'NONE', '1.', '1.5m', '1e3', '1m 2m', '2147483648']) {
      assert.equal(invalidValues(`${directive} ${value}`).length, 1, `${directive} ${value}`);
    }
  }
});

test('browser validates ControlPersist flags and time values', () => {
  for (const value of ['yes', 'true', 'no', 'false', '0', '10m', '1.5s', '"1h"']) {
    assert.deepEqual(invalidValues(`ControlPersist ${value}`), [], value);
  }
  for (const value of ['none', '-1', '+1', '1.5m', 'maybe', '1m 2m']) {
    const source = `ControlPersist ${value}`;
    assert.equal(invalidValues(source).length, 1, value);
  }
});

test('browser validates the documented RequiredRSASize range', () => {
  for (const value of ['1024', '+2048', '4096', '2147483647', '"3072"']) {
    assert.deepEqual(invalidValues(`RequiredRSASize ${value}`), [], value);
  }
  for (const value of ['0', '768', '1023', '-1', '2048.5', 'none', '2147483648']) {
    assert.equal(invalidValues(`RequiredRSASize ${value}`).length, 1, value);
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

test('browser rejects invalid enum values, extra arguments, and near misses', () => {
  const nearMisses = [
    ['AddressFamily', 'ipv4'], ['RequestTTY', 'always'], ['SessionType', 'shell'],
    ['ControlMaster', 'auto-ask'], ['CanonicalizeHostname', 'auto'],
    ['StrictHostKeyChecking', 'accept_new'], ['UpdateHostKeys', 'confirm'],
    ['VerifyHostKeyDNS', 'secure'], ['Tunnel', 'pointtopoint'], ['LogLevel', 'DEBUG4'],
    ['SyslogFacility', 'LOCAL8'], ['PubkeyAuthentication', 'bound'],
  ];

  for (const [directive] of enumCases) {
    for (const value of ['bogus', 'yes extra']) {
      const source = `${directive} ${value}`;
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

test('browser detects misspelled directives and respects earlier IgnoreUnknown patterns', () => {
  const findings = withCode([
    'FutureBefore yes',
    'IgnoreUnknown UseKeychain,Apple*,Future*',
    'UseKeychain yes',
    'AppleMultipath no',
    'FutureAfter yes',
    'HosName server.example.com',
  ].join('\n'), 'UNKNOWN_DIRECTIVE');

  assert.deepEqual(findings.map((finding) => [finding.line, finding.data.directive]), [
    [1, 'FutureBefore'],
    [6, 'HosName'],
  ]);
  assert.equal(findings[1].data.suggestion, 'Hostname');
});

test('browser reports deprecated and obsolete OpenSSH options', () => {
  const findings = withCode([
    'Protocol 2',
    'IdentityFile2 ~/.ssh/id_ed25519',
    'KeepAlive yes',
    'PubkeyAcceptedKeyTypes ssh-ed25519',
  ].join('\n'), 'DEPRECATED_OPTION');

  assert.deepEqual(findings.map((finding) => finding.line), [1, 2, 3, 4]);
  assert.deepEqual(findings.map((finding) => finding.severity), [
    'warning', 'warning', 'warning', 'warning',
  ]);
});

test('browser reports ineffective ControlPersist without a possible ControlMaster', () => {
  assert.equal(withCode('ControlPersist yes', 'CONTROL_PERSIST_UNUSED').length, 1);
  assert.equal(withCode('Host work\n  ControlPersist 10m', 'CONTROL_PERSIST_UNUSED').length, 1);
  assert.deepEqual(withCode('ControlPersist no', 'CONTROL_PERSIST_UNUSED'), []);
  assert.deepEqual(withCode('ControlMaster auto\nControlPersist yes', 'CONTROL_PERSIST_UNUSED'), []);
  assert.deepEqual(withCode('Include config.d/*\nControlPersist yes', 'CONTROL_PERSIST_UNUSED'), []);
  assert.equal(withCode(
    'ControlMaster no\nControlMaster auto\nControlPersist yes',
    'CONTROL_PERSIST_UNUSED',
  ).length, 1);
  assert.equal(withCode(
    'ControlMaster no\nHost work\n  ControlMaster auto\n  ControlPersist 10m',
    'CONTROL_PERSIST_UNUSED',
  ).length, 1);
});

test('browser reports UpdateHostKeys ask with enabled ControlPersist in one scope', () => {
  assert.equal(withCode(
    'Host work\n  UpdateHostKeys ask\n  ControlPersist 10m',
    'UPDATE_HOSTKEYS_ASK_PERSIST',
  ).length, 1);
  assert.deepEqual(withCode('UpdateHostKeys yes\nControlPersist 10m', 'UPDATE_HOSTKEYS_ASK_PERSIST'), []);
  assert.deepEqual(withCode(
    'Host one\n  UpdateHostKeys ask\nHost two\n  ControlPersist 10m',
    'UPDATE_HOSTKEYS_ASK_PERSIST',
  ), []);
  assert.deepEqual(withCode(
    'UpdateHostKeys yes\nUpdateHostKeys ask\nControlPersist 10m',
    'UPDATE_HOSTKEYS_ASK_PERSIST',
  ), []);
  assert.deepEqual(withCode(
    'ControlPersist no\nControlPersist 10m\nUpdateHostKeys ask',
    'UPDATE_HOSTKEYS_ASK_PERSIST',
  ), []);
  assert.equal(withCode(
    'UpdateHostKeys ask\nHost work\n  ControlPersist 10m',
    'UPDATE_HOSTKEYS_ASK_PERSIST',
  ).length, 1);
  assert.equal(withCode(
    'ControlPersist 10m\nHost work\n  UpdateHostKeys ask',
    'UPDATE_HOSTKEYS_ASK_PERSIST',
  ).length, 1);
  assert.deepEqual(withCode(
    'UpdateHostKeys yes\nHost work\n  UpdateHostKeys ask\n  ControlPersist 10m',
    'UPDATE_HOSTKEYS_ASK_PERSIST',
  ), []);
});

test('browser matches OpenSSH quotes, escapes, comments, equals forms, and host casing', () => {
  const clean = [
    "Host 'work laptop'",
    '  User alice',
    'Host escaped\\ host',
    '  User bob',
    'Host example#legacy',
    '  User carol # actual comment',
    'Port = 22',
    'ControlMaster = auto',
  ].join('\n');
  assert.deepEqual(lintConfig(clean).findings, []);

  assert.equal(withCode('Host Example.COM\nHost example.com', 'DUP_HOST').length, 1);
  assert.equal(withCode('StrictHostKeyChecking "no"', 'INSECURE_OPT').length, 1);
  assert.equal(withCode('Ciphers "aes256-gcm@openssh.com,3des-cbc"', 'WEAK_ALGO').length, 1);
});

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

const booleanDirectives = [
  'BatchMode', 'CanonicalizeFallbackLocal', 'CheckHostIP', 'ClearAllForwardings',
  'EnableEscapeCommandline', 'EnableSSHKeysign', 'ExitOnForwardFailure',
  'ForkAfterAuthentication', 'ForwardX11', 'ForwardX11Trusted', 'GatewayPorts',
  'GSSAPIAuthentication', 'GSSAPIDelegateCredentials', 'HashKnownHosts',
  'HostbasedAuthentication', 'IdentitiesOnly', 'KbdInteractiveAuthentication',
  'NoHostAuthenticationForLocalhost', 'PasswordAuthentication', 'PermitLocalCommand',
  'ProxyUseFdpass', 'StdinNull', 'StreamLocalBindUnlink', 'TCPKeepAlive', 'VisualHostKey',
];

test('browser validates all OpenSSH boolean switches and common near misses', () => {
  for (const directive of booleanDirectives) {
    for (const value of ['yes', 'no', 'true', 'false', 'YES', '"yes"']) {
      assert.deepEqual(invalidValues(`${directive} ${value}`), [], `${directive} ${value}`);
    }
    for (const value of ['on', 'off', 'enabled', '1', 'maybe', 'yes no']) {
      assert.equal(invalidValues(`${directive} ${value}`).length, 1, `${directive} ${value}`);
    }
  }
});

test('browser validates current Compression, WarnWeakCrypto and keystroke timing values', () => {
  for (const source of [
    'Compression yes', 'Compression no', 'WarnWeakCrypto yes',
    'WarnWeakCrypto no-pq-kex', 'ObscureKeystrokeTiming interval:1',
    'ObscureKeystrokeTiming interval:1000',
  ]) assert.deepEqual(invalidValues(source), [], source);

  for (const source of [
    'Compression auto', 'WarnWeakCrypto pq-only', 'ObscureKeystrokeTiming interval:0',
    'ObscureKeystrokeTiming interval:1001', 'ObscureKeystrokeTiming interval:1.5',
  ]) assert.equal(invalidValues(source).length, 1, source);
});

test('browser reports missing arguments and unbalanced quotes as syntax errors', () => {
  for (const source of [
    'User', 'User "unterminated', 'Host', "Host 'unterminated",
    'Include', 'Include "unterminated', 'Match', 'Match host "unterminated',
    'Host work\n  User',
  ]) {
    assert.equal(withCode(source, 'INVALID_SYNTAX').length, 1, source);
  }

  for (const source of [
    'Host prefix""suffix', "Host 'quoted host' escaped\\ host example#legacy",
    'Match tagged ""', 'SetEnv EMPTY=', 'LocalCommand printf "# not a comment"',
  ]) assert.deepEqual(withCode(source, 'INVALID_SYNTAX'), [], source);
});

test('browser reports malformed known values once as syntax errors', () => {
  for (const source of ['Port', 'Port ""', 'Port "unterminated']) {
    const findings = lintConfig(source).findings.filter((finding) =>
      ['INVALID_SYNTAX', 'INVALID_VALUE'].includes(finding.code));
    assert.deepEqual(findings.map((finding) => finding.code), ['INVALID_SYNTAX'], source);
  }
});

test('browser validates Match criteria, required values and all isolation', () => {
  for (const source of [
    'Match all', 'Match final', 'Match canonical host *.example.com',
    'Match host=*.example.com user alice', 'Match exec "test -f ~/.ssh/key" tagged ""',
    'Match !host old.example originalhost *.example localuser noah localnetwork 192.0.2.0/24 version OpenSSH_*',
    'Match command ""',
  ]) assert.deepEqual(withCode(source, 'INVALID_MATCH'), [], source);

  for (const source of [
    'Match bogus value', 'Match host', 'Match host ""', 'Match exec',
    'Match all host *.example.com', 'Match host *.example.com all',
    'Match canonical unexpected',
  ]) assert.equal(withCode(source, 'INVALID_MATCH').length, 1, source);
});
