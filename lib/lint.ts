export type Severity = 'error' | 'warning' | 'info';

export type MessageKey =
  | 'duplicateHost'
  | 'wildcardOrder'
  | 'weakAlgorithm'
  | 'duplicateDirective'
  | 'strictHostCheck'
  | 'knownHostsNull'
  | 'quietLog'
  | 'forwardAgent'
  | 'forwardX11'
  | 'forwardX11Trusted'
  | 'unsafeControlPath'
  | 'invalidIntegerRange'
  | 'invalidTime'
  | 'invalidOctalMask'
  | 'invalidIpQos'
  | 'invalidEnum'
  | 'negatedOnlyHost'
  | 'proxyConflict'
  | 'localCommandDisabled'
  | 'invalidPercentToken'
  | 'unknownDirective'
  | 'deprecatedOption'
  | 'controlPersistUnused'
  | 'updateHostKeysPersist'
  | 'invalidSyntax'
  | 'invalidMatchCondition';

export type Finding = {
  code: string;
  data: Record<string, string | number>;
  line: number;
  messageKey: MessageKey;
  severity: Severity;
};

export type LintResult = {
  findings: Finding[];
  hasIdentityFile: boolean;
  hasInclude: boolean;
};

type ParsedDirective = {
  hostPatterns: string[];
  key: string;
  line: number;
  scope: number;
  value: string;
};

type HostBlock = { patterns: string[]; line: number };
type MatchBlock = { criteria: string; line: number };

const multiValueDirectives = new Set([
  'identityfile', 'certificatefile', 'localforward', 'remoteforward',
  'dynamicforward', 'sendenv', 'setenv',
]);

const algorithmDirectives = new Set([
  'ciphers', 'macs', 'kexalgorithms', 'hostkeyalgorithms',
  'pubkeyacceptedalgorithms', 'pubkeyacceptedkeytypes', 'casignaturealgorithms',
]);

const weakAlgorithms = new Set([
  '3des-cbc', 'blowfish-cbc', 'cast128-cbc', 'arcfour', 'arcfour128', 'arcfour256',
  'rijndael-cbc@lysator.liu.se', 'hmac-md5', 'hmac-md5-96',
  'hmac-md5-etm@openssh.com', 'hmac-md5-96-etm@openssh.com', 'hmac-ripemd160',
  'hmac-ripemd160-etm@openssh.com', 'hmac-sha1-96', 'hmac-sha1-96-etm@openssh.com',
  'umac-64@openssh.com', 'umac-64-etm@openssh.com', 'diffie-hellman-group1-sha1',
  'diffie-hellman-group14-sha1', 'diffie-hellman-group-exchange-sha1', 'ssh-dss', 'ssh-rsa',
]);

const commonPercentTokens = new Set(['%', 'C', 'd', 'h', 'i', 'j', 'k', 'L', 'l', 'n', 'p', 'r', 'u']);
const knownHostsPercentTokens = new Set(['%', 'C', 'd', 'f', 'H', 'h', 'I', 'i', 'j', 'K', 'k', 'L', 'l', 'n', 'p', 'r', 't', 'u']);
const allPercentTokens = new Set(['%', 'C', 'd', 'f', 'H', 'h', 'I', 'i', 'j', 'K', 'k', 'L', 'l', 'n', 'p', 'r', 'T', 't', 'u']);
const hostnamePercentTokens = new Set(['%', 'h']);
const proxyPercentTokens = new Set(['%', 'h', 'n', 'p', 'r']);

const commonTokenDirectives = new Set([
  'certificatefile', 'controlpath', 'identityagent', 'identityfile', 'include',
  'localforward', 'remotecommand', 'remoteforward', 'revokedhostkeys',
  'userknownhostsfile', 'versionaddendum',
]);

const allowedPercentTokens = (keyLower: string): Set<string> | null => {
  if (keyLower === 'knownhostscommand') return knownHostsPercentTokens;
  if (keyLower === 'localcommand') return allPercentTokens;
  if (keyLower === 'hostname') return hostnamePercentTokens;
  if (keyLower === 'proxycommand' || keyLower === 'proxyjump') return proxyPercentTokens;
  if (commonTokenDirectives.has(keyLower)) return commonPercentTokens;
  return null;
};

const firstInvalidPercentToken = (value: string, allowed: Set<string>): string | null => {
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] !== '%') continue;
    if (index + 1 >= value.length) return '%';
    const token = value[index + 1];
    if (!allowed.has(token)) return `%${token}`;
    index += 1;
  }
  return null;
};

type ValueSpec = {
  accepts: (arguments_: string[]) => boolean;
  data?: Record<string, string | number>;
  directive: string;
  messageKey: MessageKey;
};

const parseValueArguments = (value: string): string[] | null => {
  const arguments_: string[] = [];
  let index = 0;

  while (index < value.length) {
    while (value[index] === ' ' || value[index] === '\t') index += 1;
    if (index >= value.length) break;

    let current = '';
    let quote: string | null = null;
    while (index < value.length) {
      const character = value[index];
      if (character === '\\') {
        const next = value[index + 1];
        if (next !== undefined
          && (["'", '"', '\\'].includes(next) || (quote === null && next === ' '))) {
          index += 1;
          current += value[index];
        } else {
          current += character;
        }
      } else if (quote === null && (character === "'" || character === '"')) {
        quote = character;
      } else if (quote === character) {
        quote = null;
      } else if (quote === null && (character === ' ' || character === '\t')) {
        break;
      } else {
        current += character;
      }
      index += 1;
    }
    if (quote !== null) return null;
    arguments_.push(current);
  }
  return arguments_;
};

const parseUnsignedDecimal = (value: string) => {
  if (!/^\+?\d+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : null;
};

const acceptsIntegerRange = (arguments_: string[], min: number, max: number) => {
  if (arguments_.length !== 1) return false;
  const number = parseUnsignedDecimal(arguments_[0]);
  return number !== null && number >= min && number <= max;
};

const acceptsTime = (arguments_: string[]) => {
  if (arguments_.length !== 1) return false;
  const value = arguments_[0];
  if (value === 'none') return true;
  if (!value || !/^[\x00-\x7F]*$/.test(value)) return false;

  let index = 0;
  let total = 0;
  let seenSeconds = false;
  while (index < value.length) {
    const match = value.slice(index).match(/^(\d+(?:\.\d+)?|\.\d+)([smhdwSMHDW]?)/);
    if (!match) return false;
    const number = Number(match[1]);
    const unit = match[2].toLowerCase();
    const multiplier = unit === 'w' ? 604800
      : unit === 'd' ? 86400
        : unit === 'h' ? 3600
          : unit === 'm' ? 60
            : 1;
    if (match[1].includes('.') && multiplier !== 1) return false;
    if (multiplier === 1) {
      if (seenSeconds) return false;
      seenSeconds = true;
    }
    total += number * multiplier;
    if (!Number.isFinite(total) || total > 2147483647) return false;
    index += match[0].length;
  }
  return true;
};

const acceptsControlPersist = (arguments_: string[]) => arguments_.length === 1
  && (['yes', 'true', 'no', 'false'].includes(arguments_[0].toLowerCase())
    || (arguments_[0].toLowerCase() !== 'none' && acceptsTime(arguments_)));

const acceptsObscureKeystrokeTiming = (arguments_: string[]) => {
  if (arguments_.length !== 1) return false;
  const value = arguments_[0].toLowerCase();
  if (['yes', 'true', 'no', 'false'].includes(value)) return true;
  const match = value.match(/^interval:(\d+)$/);
  return match !== null && Number(match[1]) >= 1 && Number(match[1]) <= 1000;
};

const acceptsOctalMask = (arguments_: string[]) => {
  if (arguments_.length !== 1) return false;
  const digits = arguments_[0].startsWith('+') ? arguments_[0].slice(1) : arguments_[0];
  return /^[0-7]+$/.test(digits) && Number.parseInt(digits, 8) <= 0o777;
};

const ipQosNames = new Set([
  'none', 'af11', 'af12', 'af13', 'af21', 'af22', 'af23', 'af31', 'af32', 'af33',
  'af41', 'af42', 'af43', 'cs0', 'cs1', 'cs2', 'cs3', 'cs4', 'cs5', 'cs6', 'cs7',
  'ef', 'le', 'va', 'lowdelay', 'throughput', 'reliability',
]);

const acceptsIpQos = (arguments_: string[]) => arguments_.length >= 1
  && arguments_.length <= 2
  && arguments_.every((argument) => {
    if (ipQosNames.has(argument.toLowerCase())) return true;
    const number = parseUnsignedDecimal(argument);
    return number !== null && number <= 255;
  });

const integerSpec = (directive: string, min: number, max: number): ValueSpec => ({
  directive,
  messageKey: 'invalidIntegerRange',
  data: { min, max },
  accepts: (arguments_) => acceptsIntegerRange(arguments_, min, max),
});

const enumSpec = (directive: string, values: string[]): ValueSpec => {
  const accepted = new Set(values.map((value) => value.toLowerCase()));
  return {
    directive,
    messageKey: 'invalidEnum',
    data: { expected: values.join(', ') },
    accepts: (arguments_) => arguments_.length === 1
      && accepted.has(arguments_[0].toLowerCase()),
  };
};

const valueSpecs: ValueSpec[] = [
  integerSpec('Port', 1, 65535),
  integerSpec('ConnectionAttempts', 1, 2147483647),
  integerSpec('NumberOfPasswordPrompts', 0, 2147483647),
  integerSpec('ServerAliveCountMax', 0, 2147483647),
  integerSpec('CanonicalizeMaxDots', 0, 2147483647),
  integerSpec('RequiredRSASize', 1024, 2147483647),
  {
    directive: 'ConnectTimeout', messageKey: 'invalidTime', accepts: acceptsTime,
  },
  {
    directive: 'ServerAliveInterval', messageKey: 'invalidTime', accepts: acceptsTime,
  },
  {
    directive: 'ForwardX11Timeout', messageKey: 'invalidTime', accepts: acceptsTime,
  },
  {
    directive: 'ControlPersist', messageKey: 'invalidEnum',
    data: { expected: 'yes, no, or a non-negative duration' }, accepts: acceptsControlPersist,
  },
  {
    directive: 'ObscureKeystrokeTiming', messageKey: 'invalidEnum',
    data: { expected: 'yes, no, interval:1..1000' }, accepts: acceptsObscureKeystrokeTiming,
  },
  {
    directive: 'StreamLocalBindMask', messageKey: 'invalidOctalMask', accepts: acceptsOctalMask,
  },
  {
    directive: 'IPQoS', messageKey: 'invalidIpQos', accepts: acceptsIpQos,
  },
  enumSpec('AddressFamily', ['any', 'inet', 'inet6']),
  enumSpec('RequestTTY', ['true', 'false', 'yes', 'no', 'force', 'auto']),
  enumSpec('SessionType', ['none', 'subsystem', 'default']),
  enumSpec('ControlMaster', ['true', 'false', 'yes', 'no', 'auto', 'ask', 'autoask']),
  enumSpec('CanonicalizeHostname', ['true', 'false', 'yes', 'no', 'always']),
  enumSpec('StrictHostKeyChecking', ['true', 'false', 'yes', 'no', 'ask', 'off', 'accept-new']),
  enumSpec('UpdateHostKeys', ['true', 'false', 'yes', 'no', 'ask']),
  enumSpec('VerifyHostKeyDNS', ['true', 'false', 'yes', 'no', 'ask']),
  enumSpec('Tunnel', ['ethernet', 'point-to-point', 'true', 'false', 'yes', 'no']),
  enumSpec('LogLevel', ['QUIET', 'FATAL', 'ERROR', 'INFO', 'VERBOSE', 'DEBUG', 'DEBUG1', 'DEBUG2', 'DEBUG3']),
  enumSpec('SyslogFacility', ['DAEMON', 'USER', 'AUTH', 'AUTHPRIV', 'LOCAL0', 'LOCAL1', 'LOCAL2', 'LOCAL3', 'LOCAL4', 'LOCAL5', 'LOCAL6', 'LOCAL7']),
  enumSpec('PubkeyAuthentication', ['true', 'false', 'yes', 'no', 'unbound', 'host-bound']),
  enumSpec('Compression', ['yes', 'no']),
  enumSpec('WarnWeakCrypto', ['true', 'false', 'yes', 'no', 'no-pq-kex']),
];

const booleanDirectives = [
  'BatchMode', 'CanonicalizeFallbackLocal', 'CheckHostIP', 'ClearAllForwardings',
  'EnableEscapeCommandline', 'EnableSSHKeysign', 'ExitOnForwardFailure',
  'ForkAfterAuthentication', 'ForwardX11', 'ForwardX11Trusted', 'GatewayPorts',
  'GSSAPIAuthentication', 'GSSAPIDelegateCredentials', 'HashKnownHosts',
  'HostbasedAuthentication', 'IdentitiesOnly', 'KbdInteractiveAuthentication',
  'NoHostAuthenticationForLocalhost', 'PasswordAuthentication', 'PermitLocalCommand',
  'ProxyUseFdpass', 'StdinNull', 'StreamLocalBindUnlink', 'TCPKeepAlive', 'VisualHostKey',
];
booleanDirectives.forEach((directive) => valueSpecs.push(
  enumSpec(directive, ['true', 'false', 'yes', 'no']),
));

const stripComment = (line: string) => {
  let quote: string | null = null;
  let escapeNext = false;
  let atTokenStart = true;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (escapeNext) {
      escapeNext = false;
      atTokenStart = false;
    } else if (character === '\\') {
      escapeNext = true;
      atTokenStart = false;
    } else if (quote === null && (character === "'" || character === '"')) {
      quote = character;
      atTokenStart = false;
    } else if (quote === character) {
      quote = null;
      atTokenStart = false;
    } else if (character === '#' && quote === null && atTokenStart) {
      return line.slice(0, index).trim();
    } else if ((character === ' ' || character === '\t') && quote === null) {
      atTokenStart = true;
    } else {
      atTokenStart = false;
    }
  }
  return line.trim();
};

const parseDirective = (raw: string) => {
  const line = stripComment(raw);
  if (!line) return null;
  const equals = line.indexOf('=');
  if (equals > 0) {
    const key = line.slice(0, equals).trim();
    if (!/\s/.test(key)) {
      return { key, value: line.slice(equals + 1).trim() };
    }
  }
  const separator = line.search(/\s/);
  if (separator < 0) return { key: line, value: '' };
  return { key: line.slice(0, separator), value: line.slice(separator).trim() };
};

const add = (
  findings: Finding[], code: string, line: number, messageKey: MessageKey,
  data: Record<string, string | number>, severity: Severity = 'warning',
) => findings.push({ code, data, line, messageKey, severity });

const knownDirectives = new Set(`
addkeystoagent addressfamily afstokenpassing batchmode bindaddress bindinterface
canonicaldomains canonicalizefallbacklocal canonicalizehostname canonicalizemaxdots
canonicalizepermittedcnames casignaturealgorithms certificatefile challengeresponseauthentication
channeltimeout checkhostip cipher ciphers clearallforwardings compression compressionlevel
connectionattempts connecttimeout controlmaster controlpath controlpersist dsaauthentication
dynamicforward enableescapecommandline enablesshkeysign escapechar exitonforwardfailure
fallbacktorsh fingerprinthash forkafterauthentication forwardagent forwardx11
forwardx11timeout forwardx11trusted gatewayports globalknownhostsfile globalknownhostsfile2
gssapiauthentication gssapidelegatecredentials hashknownhosts host
hostbasedacceptedalgorithms hostbasedauthentication hostbasedkeytypes hostkeyalgorithms
hostkeyalias hostname identitiesonly identityagent identityfile identityfile2 ignoreunknown
include ipqos kbdinteractiveauthentication kbdinteractivedevices keepalive
kerberosauthentication kerberostgtpassing kexalgorithms knownhostscommand localcommand
localforward loglevel logverbose macs match nohostauthenticationforlocalhost
numberofpasswordprompts obscurekeystroketiming passwordauthentication permitlocalcommand
permitremoteopen pkcs11provider port preferredauthentications protocol proxycommand proxyjump
proxyusefdpass pubkeyacceptedalgorithms pubkeyacceptedkeytypes pubkeyauthentication
refuseconnection rekeylimit remotecommand remoteforward requesttty requiredrsasize
revokedhostkeys rhostsauthentication rhostsrsaauthentication rsaauthentication
securitykeyprovider sendenv serveralivecountmax serveraliveinterval sessiontype setenv
skeyauthentication smartcarddevice stdinnull streamlocalbindmask streamlocalbindunlink
stricthostkeychecking syslogfacility tag tcpkeepalive tisauthentication tunnel tunneldevice
updatehostkeys useprivilegedport user userknownhostsfile userknownhostsfile2 useroaming usersh
verifyhostkeydns versionaddendum visualhostkey warnweakcrypto xauthlocation
usekeychain applemultipath nohostauthenticationforproxycommand
`.trim().split(/\s+/));

const canonicalDirectiveNames = new Map<string, string>([
  ...[...knownDirectives].map((name) => [name, name] as [string, string]),
  ['hostname', 'Hostname'], ['identityfile', 'IdentityFile'], ['proxyjump', 'ProxyJump'],
  ['proxycommand', 'ProxyCommand'], ['controlmaster', 'ControlMaster'],
  ['controlpersist', 'ControlPersist'], ['updatehostkeys', 'UpdateHostKeys'],
]);

const deprecatedDirectives = new Map<string, string>([
  ['protocol', 'remove this option; current OpenSSH only supports protocol 2'],
  ['cipher', 'use Ciphers instead'],
  ['fallbacktorsh', 'remove this unsupported option'],
  ['globalknownhostsfile2', 'use GlobalKnownHostsFile instead'],
  ['rhostsauthentication', 'remove this unsupported option'],
  ['userknownhostsfile2', 'use UserKnownHostsFile instead'],
  ['useroaming', 'remove this unsupported option'],
  ['usersh', 'remove this unsupported option'],
  ['useprivilegedport', 'remove this unsupported option'],
  ['identityfile2', 'use IdentityFile instead'],
  ['keepalive', 'use TCPKeepAlive instead'],
  ['hostbasedkeytypes', 'use HostbasedAcceptedAlgorithms instead'],
  ['pubkeyacceptedkeytypes', 'use PubkeyAcceptedAlgorithms instead'],
]);

const wildcardMatches = (value: string, pattern: string) => {
  const expression = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${expression}$`, 'i').test(value);
};

const patternListMatches = (value: string, list: string) => {
  let positive = false;
  for (const rawPattern of list.split(',').filter(Boolean)) {
    const negated = rawPattern.startsWith('!');
    const pattern = negated ? rawPattern.slice(1) : rawPattern;
    if (!wildcardMatches(value, pattern)) continue;
    if (negated) return false;
    positive = true;
  }
  return positive;
};

const editDistance = (left: string, right: string) => {
  const a = left.toLowerCase();
  const b = right.toLowerCase();
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length];
};

const nearestDirective = (key: string) => {
  const candidates = [...knownDirectives]
    .map((candidate) => ({ candidate, distance: editDistance(key, candidate) }))
    .sort((a, b) => a.distance - b.distance || a.candidate.localeCompare(b.candidate));
  const nearest = candidates[0];
  if (!nearest || nearest.distance > Math.max(2, Math.floor(key.length / 3))) return '';
  return canonicalDirectiveNames.get(nearest.candidate)
    ?? nearest.candidate.replace(/^./, (character) => character.toUpperCase());
};

const parsedSingleValue = (value: string) => {
  const arguments_ = parseValueArguments(value);
  return arguments_?.length === 1 ? arguments_[0] : null;
};

const isEnabledControlMaster = (value: string) => {
  const normalized = parsedSingleValue(value)?.toLowerCase();
  return normalized !== undefined && normalized !== null
    && ['yes', 'true', 'auto', 'ask', 'autoask'].includes(normalized);
};

const isEnabledControlPersist = (value: string) => {
  const arguments_ = parseValueArguments(value);
  return arguments_ !== null && acceptsControlPersist(arguments_)
    && !['no', 'false'].includes(arguments_[0].toLowerCase());
};

const validateMatchCondition = (criteria: string): string | null => {
  const arguments_ = parseValueArguments(criteria);
  if (arguments_ === null || arguments_.length === 0) return null;
  let index = 0;
  while (index < arguments_.length) {
    const raw = arguments_[index];
    const criterion = raw.startsWith('!') ? raw.slice(1) : raw;
    const lower = criterion.toLowerCase();
    if (lower === 'all') return arguments_.length === 1 ? null : criterion;
    if (lower === 'canonical' || lower === 'final') { index += 1; continue; }
    const separator = lower.indexOf('=');
    const name = separator >= 0 ? lower.slice(0, separator) : lower;
    const supported = [
      'host', 'originalhost', 'user', 'localuser', 'localnetwork',
      'version', 'tagged', 'command', 'exec',
    ].includes(name);
    if (!supported) return criterion;
    let value = separator >= 0 ? lower.slice(separator + 1) : undefined;
    if (value === undefined) { index += 1; value = arguments_[index]; }
    if (value === undefined || (value === '' && name !== 'tagged' && name !== 'command')) {
      return criterion;
    }
    index += 1;
  }
  return null;
};

export function lintConfig(source: string): LintResult {
  const directives: ParsedDirective[] = [];
  const hostBlocks: HostBlock[] = [];
  const matchBlocks: MatchBlock[] = [];
  const findings: Finding[] = [];
  let scope = 0;
  let hostPatterns: string[] = [];

  source.split(/\r?\n/).forEach((raw, index) => {
    const parsed = parseDirective(raw);
    if (!parsed) return;
    const keyLower = parsed.key.toLowerCase();
    if (keyLower === 'host' || keyLower === 'match') {
      scope += 1;
      const arguments_ = parseValueArguments(parsed.value);
      if (arguments_ === null || arguments_.length === 0
        || (keyLower === 'host' && arguments_.some((argument) => argument === ''))) {
        add(findings, 'INVALID_SYNTAX', index + 1, 'invalidSyntax', { directive: parsed.key }, 'error');
      }
      hostPatterns = keyLower === 'host' ? arguments_ ?? [] : [];
      if (keyLower === 'host') hostBlocks.push({ patterns: hostPatterns, line: index + 1 });
      else matchBlocks.push({ criteria: parsed.value, line: index + 1 });
      return;
    }
    const arguments_ = parseValueArguments(parsed.value);
    if (arguments_ === null || arguments_.length === 0 || arguments_.some((argument) => argument === '')) {
      add(findings, 'INVALID_SYNTAX', index + 1, 'invalidSyntax', { directive: parsed.key }, 'error');
    }
    directives.push({ hostPatterns: [...hostPatterns], key: parsed.key, line: index + 1, scope, value: parsed.value });
  });

  const seenHosts = new Map<string, number>();
  let wildcardLine: number | undefined;

  hostBlocks.forEach((block) => {
    if (block.patterns.length > 0 && block.patterns.every((pattern) => pattern.startsWith('!'))) {
      add(findings, 'NEGATED_HOST', block.line, 'negatedOnlyHost', { patterns: block.patterns.join(' ') });
    }
    block.patterns.forEach((pattern) => {
      const normalizedPattern = pattern.toLowerCase();
      const first = seenHosts.get(normalizedPattern);
      if (first !== undefined) add(findings, 'DUP_HOST', block.line, 'duplicateHost', { pattern, first });
      else seenHosts.set(normalizedPattern, block.line);
      if (pattern === '*' && wildcardLine === undefined) wildcardLine = block.line;
      if (pattern !== '*' && wildcardLine !== undefined) {
        add(findings, 'WILDCARD_ORDER', block.line, 'wildcardOrder', { pattern, first: wildcardLine });
      }
    });
  });

  matchBlocks.forEach((block) => {
    const arguments_ = parseValueArguments(block.criteria);
    if (!arguments_) return;
    const invalidCriterion = validateMatchCondition(block.criteria);
    if (invalidCriterion) {
      add(findings, 'INVALID_MATCH', block.line, 'invalidMatchCondition', { criterion: invalidCriterion }, 'error');
    }
    const execIndex = arguments_.findIndex((argument) => argument.toLowerCase() === 'exec');
    if (execIndex < 0 || execIndex + 1 >= arguments_.length) return;
    const token = firstInvalidPercentToken(arguments_[execIndex + 1], commonPercentTokens);
    if (token) add(findings, 'INVALID_TOKEN', block.line, 'invalidPercentToken', { directive: 'Match exec', token }, 'error');
  });

  const seenByScope = new Map<number, Map<string, number>>();
  const firstProxyByScope = new Map<number, { directive: string; line: number }>();
  const ignoredUnknownPatterns: string[] = [];
  const hasUnresolvedInclude = directives.some((directive) => directive.key.toLowerCase() === 'include');
  const canEnableLocalCommand = directives.some((directive) => {
    if (directive.key.toLowerCase() !== 'permitlocalcommand') return false;
    const arguments_ = parseValueArguments(directive.value);
    return arguments_?.length === 1 && ['yes', 'true'].includes(arguments_[0].toLowerCase());
  });
  directives.forEach((directive) => {
    const keyLower = directive.key.toLowerCase();
    if (!knownDirectives.has(keyLower)
      && !ignoredUnknownPatterns.some((patterns) => patternListMatches(directive.key, patterns))) {
      add(findings, 'UNKNOWN_DIRECTIVE', directive.line, 'unknownDirective', {
        directive: directive.key,
        suggestion: nearestDirective(directive.key),
      }, 'error');
    }
    const deprecatedReplacement = deprecatedDirectives.get(keyLower);
    if (deprecatedReplacement) {
      add(findings, 'DEPRECATED_OPTION', directive.line, 'deprecatedOption', {
        directive: directive.key,
        replacement: deprecatedReplacement,
      });
    }
    if (keyLower === 'ignoreunknown') {
      const patterns = parsedSingleValue(directive.value);
      if (patterns !== null) ignoredUnknownPatterns.push(patterns.toLowerCase());
    }

    const valueSpec = valueSpecs.find((spec) => spec.directive.toLowerCase() === keyLower);
    const valueArguments = valueSpec ? parseValueArguments(directive.value) : null;
    const hasValidValueSyntax = valueArguments !== null
      && valueArguments.length > 0
      && valueArguments.every((argument) => argument.length > 0);
    if (valueSpec && hasValidValueSyntax && !valueSpec.accepts(valueArguments)) {
      add(
        findings,
        'INVALID_VALUE',
        directive.line,
        valueSpec.messageKey,
        { directive: valueSpec.directive, target: directive.value, ...valueSpec.data },
        'error',
      );
    }

    if (keyLower === 'proxycommand' || keyLower === 'proxyjump') {
      const first = firstProxyByScope.get(directive.scope);
      if (!first) {
        firstProxyByScope.set(directive.scope, { directive: directive.key, line: directive.line });
      } else if (first.directive.toLowerCase() !== keyLower) {
        add(findings, 'PROXY_CONFLICT', directive.line, 'proxyConflict', {
          first: first.line,
          firstDirective: first.directive,
          ignoredDirective: directive.key,
        });
      }
    }

    if (keyLower === 'localcommand' && !hasUnresolvedInclude && !canEnableLocalCommand) {
      add(findings, 'LOCAL_COMMAND_DISABLED', directive.line, 'localCommandDisabled', {});
    }

    const percentTokens = allowedPercentTokens(keyLower);
    if (percentTokens) {
      const token = firstInvalidPercentToken(directive.value, percentTokens);
      if (token) add(findings, 'INVALID_TOKEN', directive.line, 'invalidPercentToken', { directive: directive.key, token }, 'error');
    }

    if (!multiValueDirectives.has(keyLower) && keyLower !== 'include') {
      const seen = seenByScope.get(directive.scope) ?? new Map<string, number>();
      const first = seen.get(keyLower);
      if (first !== undefined) add(findings, 'DUP_DIRECTIVE', directive.line, 'duplicateDirective', { directive: directive.key, first });
      else { seen.set(keyLower, directive.line); seenByScope.set(directive.scope, seen); }
    }

    if (algorithmDirectives.has(keyLower)) {
      const algorithms = parsedSingleValue(directive.value) ?? directive.value;
      algorithms.split(',').forEach((candidate) => {
        const algorithm = candidate.trim().replace(/^[+\-^]/, '');
        if (weakAlgorithms.has(algorithm.toLowerCase())) {
          add(findings, 'WEAK_ALGO', directive.line, 'weakAlgorithm', { algorithm, directive: directive.key });
        }
      });
    }

    const valueLower = (parsedSingleValue(directive.value) ?? directive.value).toLowerCase();
    if (keyLower === 'stricthostkeychecking' && ['no', 'off'].includes(valueLower)) add(findings, 'INSECURE_OPT', directive.line, 'strictHostCheck', { target: directive.key });
    if (keyLower === 'userknownhostsfile' && valueLower === '/dev/null') add(findings, 'INSECURE_OPT', directive.line, 'knownHostsNull', { target: '/dev/null' });
    if (keyLower === 'loglevel' && valueLower === 'quiet') add(findings, 'INSECURE_OPT', directive.line, 'quietLog', { target: directive.key }, 'info');

    const isGlobal = directive.scope === 0 || directive.hostPatterns.includes('*');
    if (isGlobal && valueLower === 'yes') {
      if (keyLower === 'forwardagent') add(findings, 'INSECURE_OPT', directive.line, 'forwardAgent', { target: directive.key });
      if (keyLower === 'forwardx11') add(findings, 'INSECURE_OPT', directive.line, 'forwardX11', { target: directive.key });
      if (keyLower === 'forwardx11trusted') add(findings, 'INSECURE_OPT', directive.line, 'forwardX11Trusted', { target: directive.key });
    }

    if (keyLower === 'controlpath' && valueLower !== 'none' && !directive.value.includes('%C')) {
      const missing = ['%h', '%p', '%r'].filter((token) => !directive.value.includes(token));
      if (missing.length > 0) add(findings, 'UNSAFE_CTRL_PATH', directive.line, 'unsafeControlPath', { missing: missing.join(', '), target: directive.key });
    }
  });

  const firstMasterByScope = new Map<number, boolean>();
  directives.forEach((directive) => {
    if (directive.key.toLowerCase() === 'controlmaster'
      && !firstMasterByScope.has(directive.scope)) {
      firstMasterByScope.set(directive.scope, isEnabledControlMaster(directive.value));
    }
  });
  const hasPossibleControlMaster = hasUnresolvedInclude
    || (firstMasterByScope.has(0)
      ? firstMasterByScope.get(0) === true
      : [...firstMasterByScope.values()].some(Boolean));
  if (!hasPossibleControlMaster) {
    directives.forEach((directive) => {
      if (directive.key.toLowerCase() === 'controlpersist'
        && isEnabledControlPersist(directive.value)) {
        add(findings, 'CONTROL_PERSIST_UNUSED', directive.line, 'controlPersistUnused', {});
      }
    });
  }

  type HostKeyScope = {
    persist?: { enabled: boolean; line: number };
    update?: { ask: boolean; line: number };
  };
  const hostKeyScopes = new Map<number, HostKeyScope>();
  directives.forEach((directive) => {
    const state = hostKeyScopes.get(directive.scope) ?? {};
    if (directive.key.toLowerCase() === 'updatehostkeys' && state.update === undefined) {
      state.update = {
        ask: parsedSingleValue(directive.value)?.toLowerCase() === 'ask',
        line: directive.line,
      };
    }
    if (directive.key.toLowerCase() === 'controlpersist' && state.persist === undefined) {
      state.persist = {
        enabled: isEnabledControlPersist(directive.value),
        line: directive.line,
      };
    }
    hostKeyScopes.set(directive.scope, state);
  });
  const rootHostKeyState = hostKeyScopes.get(0) ?? {};
  let globalConflictReported = false;
  hostKeyScopes.forEach((state, currentScope) => {
    const update = currentScope === 0 ? state.update : rootHostKeyState.update ?? state.update;
    const persist = currentScope === 0 ? state.persist : rootHostKeyState.persist ?? state.persist;
    if (update?.ask && persist?.enabled && !(currentScope !== 0 && globalConflictReported)) {
      add(
        findings,
        'UPDATE_HOSTKEYS_ASK_PERSIST',
        Math.max(update.line, persist.line),
        'updateHostKeysPersist',
        { ask: update.line, persist: persist.line },
      );
      if (currentScope === 0) globalConflictReported = true;
    }
  });

  const unique = new Map<string, Finding>();
  findings.forEach((finding) => unique.set(`${finding.code}:${finding.line}:${finding.messageKey}`, finding));
  return {
    findings: [...unique.values()].sort((a, b) => a.line - b.line || a.code.localeCompare(b.code)),
    hasIdentityFile: directives.some((directive) => directive.key.toLowerCase() === 'identityfile'),
    hasInclude: directives.some((directive) => directive.key.toLowerCase() === 'include'),
  };
}
