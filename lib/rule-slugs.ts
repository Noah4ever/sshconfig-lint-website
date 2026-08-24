export const ruleSlugByCode: Record<string, string> = {
  DUP_DIRECTIVE: 'duplicate-directives',
  DUP_HOST: 'duplicate-host',
  INCLUDE_CYCLE: 'include-cycle',
  INCLUDE_GLOB: 'include-glob',
  INCLUDE_NO_MATCH: 'include-no-match',
  INCLUDE_READ: 'include-read',
  INSECURE_OPT: 'insecure-option',
  MISSING_IDENTITY: 'identity-file-exists',
  UNSAFE_CTRL_PATH: 'unsafe-control-path',
  WEAK_ALGO: 'deprecated-weak-algorithms',
  WILDCARD_ORDER: 'wildcard-host-order',
};
