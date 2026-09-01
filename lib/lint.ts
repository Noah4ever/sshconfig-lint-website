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
  | 'invalidValue';

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

type ValueSpec = {
  accepts: (value: string) => boolean;
  directive: string;
};

const valueSpecs: ValueSpec[] = [
  {
    directive: 'Port',
    accepts: (value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 65535,
  },
];

const stripComment = (line: string) => {
  let quoted = false;
  let escaped = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (escaped) { escaped = false; continue; }
    if (character === '\\' && quoted) { escaped = true; continue; }
    if (character === '"') quoted = !quoted;
    if (character === '#' && !quoted) return line.slice(0, index).trim();
  }
  return line.trim();
};

const parseDirective = (raw: string) => {
  const line = stripComment(raw);
  if (!line) return null;
  const equals = line.indexOf('=');
  if (equals > 0 && !/\s/.test(line.slice(0, equals))) {
    return { key: line.slice(0, equals).trim(), value: line.slice(equals + 1).trim() };
  }
  const separator = line.search(/\s/);
  if (separator < 0) return { key: line, value: '' };
  return { key: line.slice(0, separator), value: line.slice(separator).trim() };
};

const add = (
  findings: Finding[], code: string, line: number, messageKey: MessageKey,
  data: Record<string, string | number>, severity: Severity = 'warning',
) => findings.push({ code, data, line, messageKey, severity });

export function lintConfig(source: string): LintResult {
  const directives: ParsedDirective[] = [];
  const hostBlocks: HostBlock[] = [];
  let scope = 0;
  let hostPatterns: string[] = [];

  source.split(/\r?\n/).forEach((raw, index) => {
    const parsed = parseDirective(raw);
    if (!parsed) return;
    const keyLower = parsed.key.toLowerCase();
    if (keyLower === 'host' || keyLower === 'match') {
      scope += 1;
      hostPatterns = keyLower === 'host' ? parsed.value.split(/\s+/).filter(Boolean) : [];
      if (keyLower === 'host') hostBlocks.push({ patterns: hostPatterns, line: index + 1 });
      return;
    }
    directives.push({ hostPatterns: [...hostPatterns], key: parsed.key, line: index + 1, scope, value: parsed.value });
  });

  const findings: Finding[] = [];
  const seenHosts = new Map<string, number>();
  let wildcardLine: number | undefined;

  hostBlocks.forEach((block) => {
    block.patterns.forEach((pattern) => {
      const first = seenHosts.get(pattern);
      if (first !== undefined) add(findings, 'DUP_HOST', block.line, 'duplicateHost', { pattern, first });
      else seenHosts.set(pattern, block.line);
      if (pattern === '*' && wildcardLine === undefined) wildcardLine = block.line;
      if (pattern !== '*' && wildcardLine !== undefined) {
        add(findings, 'WILDCARD_ORDER', block.line, 'wildcardOrder', { pattern, first: wildcardLine });
      }
    });
  });

  const seenByScope = new Map<number, Map<string, number>>();
  directives.forEach((directive) => {
    const keyLower = directive.key.toLowerCase();
    const valueSpec = valueSpecs.find((spec) => spec.directive.toLowerCase() === keyLower);
    if (valueSpec && !valueSpec.accepts(directive.value)) {
      add(
        findings,
        'INVALID_VALUE',
        directive.line,
        'invalidValue',
        { directive: valueSpec.directive, target: directive.value },
        'error',
      );
    }

    if (!multiValueDirectives.has(keyLower) && keyLower !== 'include') {
      const seen = seenByScope.get(directive.scope) ?? new Map<string, number>();
      const first = seen.get(keyLower);
      if (first !== undefined) add(findings, 'DUP_DIRECTIVE', directive.line, 'duplicateDirective', { directive: directive.key, first });
      else { seen.set(keyLower, directive.line); seenByScope.set(directive.scope, seen); }
    }

    if (algorithmDirectives.has(keyLower)) {
      directive.value.split(',').forEach((candidate) => {
        const algorithm = candidate.trim().replace(/^[+\-^]/, '');
        if (weakAlgorithms.has(algorithm.toLowerCase())) {
          add(findings, 'WEAK_ALGO', directive.line, 'weakAlgorithm', { algorithm, directive: directive.key });
        }
      });
    }

    const valueLower = directive.value.toLowerCase();
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

  const unique = new Map<string, Finding>();
  findings.forEach((finding) => unique.set(`${finding.code}:${finding.line}:${finding.messageKey}`, finding));
  return {
    findings: [...unique.values()].sort((a, b) => a.line - b.line || a.code.localeCompare(b.code)),
    hasIdentityFile: directives.some((directive) => directive.key.toLowerCase() === 'identityfile'),
    hasInclude: directives.some((directive) => directive.key.toLowerCase() === 'include'),
  };
}
