import type { MessageKey } from './lint';

export const locales = ['en', 'de', 'fr', 'es'] as const;
export type Locale = (typeof locales)[number];

export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

export type Copy = {
  languageName: string;
  skipToContent: string;
  darkMode: string;
  lightMode: string;
  githubStars: string;
  primaryNavigation: string;
  legalNavigation: string;
  languageMenu: string;
  packageManagers: string;
  nav: { playground: string; checks: string; learn: string; cli: string; github: string; editor: string; ci: string; guides: string };
  eyebrow: string;
  title: string;
  intro: string;
  privateNote: string;
  localCheck: string;
  configLabel: string;
  configHelper: string;
  resultLabel: string;
  openFile: string;
  loadExample: string;
  clear: string;
  copy: string;
  copied: string;
  check: string;
  shortcut: string;
  emptyResult: string;
  cleanResult: string;
  resultCount: string;
  line: string;
  lines: string;
  warning: string;
  info: string;
  learnRule: string;
  browserNotice: string;
  includeNotice: string;
  identityNotice: string;
  checkedMessages: string[];
  checksEyebrow: string;
  checksTitle: string;
  checksIntro: string;
  allRules: string;
  rules: Array<{ code: string; title: string; text: string }>;
  cliEyebrow: string;
  cliTitle: string;
  cliIntro: string;
  browserColumn: string;
  browserItems: string[];
  cliColumn: string;
  cliItems: string[];
  installTitle: string;
  installText: string;
  copyCommand: string;
  githubCta: string;
  footerLine: string;
  privacy: string;
  legal: string;
  source: string;
  privacyTitle: string;
  privacyBody: string[];
  privacyFacts: Array<{ title: string; text: string }>;
  legalTitle: string;
  legalIntro: string;
  back: string;
  findingMessages: Record<MessageKey, string>;
  findingHints: Record<MessageKey, string>;
};

export const copy: Record<Locale, Copy> = {
  en: {
    languageName: 'English',
    skipToContent: 'Skip to main content', darkMode: 'Use dark mode', lightMode: 'Use light mode', githubStars: '{count} GitHub stars', primaryNavigation: 'Primary navigation', legalNavigation: 'Legal and project links', languageMenu: 'Choose language', packageManagers: 'Choose a package manager',
    nav: { playground: 'Checker', checks: 'What it checks', learn: 'Learn', cli: 'CLI', github: 'GitHub', editor: 'Editor', ci: 'CI workflows', guides: 'Guides' },
    eyebrow: 'Free OpenSSH client config checker',
    title: 'An SSH config linter that finds what SSH does not mention.',
    intro: 'Paste or open your ~/.ssh/config. This free SSH config checker catches duplicate hosts, unsafe options, weak algorithms, and ordering mistakes before they waste your time.',
    privateNote: 'Nothing is uploaded. The check stays in this browser.',
    localCheck: 'PROCESSED IN THIS BROWSER',
    configLabel: 'PASTE OR OPEN YOUR CONFIG',
    configHelper: 'Replace the example below or open your ~/.ssh/config file.',
    resultLabel: 'RESULT',
    openFile: 'Open file',
    loadExample: 'Load example',
    clear: 'Clear',
    copy: 'Copy config',
    copied: 'Copied',
    check: 'Check config',
    shortcut: 'Ctrl or ⌘ + Enter',
    emptyResult: 'Paste a config or open a file to begin.',
    cleanResult: 'No issues found. The terminal approves.',
    resultCount: '{count} things worth checking',
    line: 'line',
    lines: 'lines',
    warning: 'warning',
    info: 'info',
    learnRule: 'About this rule',
    browserNotice: 'Browser mode checks the content you provide. It cannot read your computer.',
    includeNotice: 'Includes are visible, but linked files cannot be resolved here. Use the CLI for the complete check.',
    identityNotice: 'IdentityFile paths cannot be verified in a browser. The CLI checks whether those files exist.',
    checkedMessages: ['Checked. Nicely done.', 'Config inspected. No server bothered.', 'Done. Your shell can relax.'],
    checksEyebrow: 'THE USEFUL PART',
    checksTitle: 'What this SSH config linter checks.',
    checksIntro: 'The browser checks the OpenSSH rules that only need your configuration text. Each finding explains the problem and points back to the relevant line.',
    allRules: 'View all 12 rule guides',
    rules: [
      { code: 'INVALID_VALUE', title: 'Invalid values', text: 'Checks whether Port uses an integer from 1 to 65535.' },
      { code: 'DUP_HOST', title: 'Duplicate hosts', text: 'Finds repeated Host patterns that make a config harder to reason about.' },
      { code: 'WILDCARD_ORDER', title: 'Wildcard ordering', text: 'Warns when a specific host appears after Host * and may inherit unexpected values.' },
      { code: 'INSECURE_OPT', title: 'Unsafe options', text: 'Flags disabled host verification and broad agent or X11 forwarding.' },
      { code: 'WEAK_ALGO', title: 'Weak algorithms', text: 'Recognizes deprecated ciphers, MACs, key exchange, and signature algorithms.' },
      { code: 'DUP_DIRECTIVE', title: 'Repeated directives', text: 'Shows values repeated in the same scope when OpenSSH only uses the first one.' },
      { code: 'UNSAFE_CTRL_PATH', title: 'ControlPath collisions', text: 'Checks whether shared connection paths identify host, port, and user.' },
    ],
    cliEyebrow: 'BROWSER AND CLI',
    cliTitle: 'A quick check here. The complete check on your machine.',
    cliIntro: 'The website is for fast feedback. The open source CLI follows Include files, detects cycles, and can verify local paths.',
    browserColumn: 'In this browser',
    browserItems: ['No installation', 'No upload', 'Seven content-based rules', 'Works on phones and desktops'],
    cliColumn: 'With sshconfig-lint',
    cliItems: ['Nested Include resolution', 'IdentityFile existence checks', 'Text, JSON, SARIF, and GitHub output', 'Language server for editors'],
    installTitle: 'Use the complete linter',
    installText: 'Install it with Homebrew, Cargo, AUR, or a prebuilt binary.',
    copyCommand: 'Copy command',
    githubCta: 'View project on GitHub',
    footerLine: 'Open source. No cookies. No tracking.',
    privacy: 'Privacy',
    legal: 'Legal notice',
    source: 'Source code',
    privacyTitle: 'Privacy without a banner',
    privacyBody: [
      'This website does not use analytics, advertising, external fonts, tracking pixels, or non-essential cookies.',
      'SSH configuration text and files are processed locally by your browser. Their contents are not sent to the server. Standard server logs may temporarily contain technical request data such as IP address, timestamp, requested page, and user agent for secure operation.',
    ],
    privacyFacts: [
      { title: 'Config contents', text: 'Processed only in your browser and not transmitted by this application.' },
      { title: 'Cookies', text: 'None.' },
      { title: 'Third parties', text: 'No third-party scripts or remotely hosted fonts.' },
      { title: 'Theme preference', text: 'Your light or dark theme choice is saved only in this browser.' },
    ],
    legalTitle: 'Legal notice',
    legalIntro: 'This website and the open-source project are operated by Noah Thiering. The central operator and contact page is available at thiering.org.',
    back: 'Back to the checker',
    findingMessages: {
      duplicateHost: "Host '{pattern}' is repeated. The first occurrence is on line {first}.",
      wildcardOrder: "Host '{pattern}' appears after Host * on line {first}.",
      weakAlgorithm: "'{algorithm}' in {directive} is weak or deprecated.",
      duplicateDirective: "{directive} is repeated in this scope. The first value is on line {first}.",
      strictHostCheck: 'Host key verification is disabled.',
      knownHostsNull: 'Known host keys are discarded through /dev/null.',
      quietLog: 'LogLevel QUIET hides information that is useful for debugging.',
      forwardAgent: 'ForwardAgent is enabled globally or for Host *.',
      forwardX11: 'ForwardX11 is enabled globally or for Host *.',
      forwardX11Trusted: 'ForwardX11Trusted is enabled globally or for Host *.',
      unsafeControlPath: 'ControlPath is missing {missing}. Connections may share a socket.',
      invalidValue: "{directive} has the invalid value '{target}'. Expected an integer from 1 to 65535.",
    },
    findingHints: {
      duplicateHost: 'Remove or consolidate one of the duplicate blocks.',
      wildcardOrder: 'Move Host * to the end unless the order is intentional.',
      weakAlgorithm: 'Remove the algorithm and use a modern alternative.',
      duplicateDirective: 'Remove the duplicate. OpenSSH usually keeps the first value.',
      strictHostCheck: "Remove it or use 'accept-new' when appropriate.",
      knownHostsNull: 'Use the default known_hosts file.',
      quietLog: 'Use INFO or VERBOSE while diagnosing problems.',
      forwardAgent: 'Enable agent forwarding only for specific trusted hosts.',
      forwardX11: 'Enable X11 forwarding only for specific trusted hosts.',
      forwardX11Trusted: 'Avoid trusted X11 forwarding on broad host patterns.',
      unsafeControlPath: 'Include %h, %p, and %r, or use %C.',
      invalidValue: 'Use a port number from 1 to 65535.',
    },
  },
  de: {
    languageName: 'Deutsch',
    skipToContent: 'Zum Hauptinhalt springen', darkMode: 'Dunkles Farbschema verwenden', lightMode: 'Helles Farbschema verwenden', githubStars: '{count} GitHub-Sterne', primaryNavigation: 'Hauptnavigation', legalNavigation: 'Rechtliches und Projektlinks', languageMenu: 'Sprache auswählen', packageManagers: 'Paketmanager auswählen',
    nav: { playground: 'Prüfen', checks: 'Prüfungen', learn: 'Lernen', cli: 'CLI', github: 'GitHub', editor: 'Editor', ci: 'CI-Workflows', guides: 'Anleitungen' },
    eyebrow: 'Kostenloser OpenSSH-Config-Checker',
    title: 'Ein SSH-Config-Linter, der findet, was SSH nicht erwähnt.',
    intro: 'Füge deine ~/.ssh/config ein oder öffne eine Datei. Dieser kostenlose SSH-Config-Checker findet doppelte Hosts, unsichere Optionen, schwache Algorithmen und problematische Reihenfolgen.',
    privateNote: 'Es wird nichts hochgeladen. Die Prüfung bleibt in diesem Browser.',
    localCheck: 'IN DIESEM BROWSER VERARBEITET', configLabel: 'KONFIGURATION EINFÜGEN ODER ÖFFNEN',
    configHelper: 'Ersetze das Beispiel oder öffne deine ~/.ssh/config-Datei.', resultLabel: 'ERGEBNIS',
    openFile: 'Datei öffnen', loadExample: 'Beispiel laden', clear: 'Leeren', copy: 'Konfiguration kopieren', copied: 'Kopiert', check: 'Konfiguration prüfen', shortcut: 'Strg oder ⌘ + Enter',
    emptyResult: 'Füge eine Konfiguration ein oder öffne eine Datei.',
    cleanResult: 'Keine Probleme gefunden. Das Terminal ist zufrieden.',
    resultCount: '{count} Punkte zum Prüfen', line: 'Zeile', lines: 'Zeilen', warning: 'Warnung', info: 'Info', learnRule: 'Mehr über diese Regel',
    browserNotice: 'Der Browser prüft nur den bereitgestellten Inhalt. Er kann deinen Computer nicht lesen.',
    includeNotice: 'Includes werden erkannt, verknüpfte Dateien können hier aber nicht aufgelöst werden. Nutze die CLI für die vollständige Prüfung.',
    identityNotice: 'IdentityFile-Pfade können im Browser nicht geprüft werden. Die CLI prüft, ob diese Dateien existieren.',
    checkedMessages: ['Geprüft. Sieht schon ordentlicher aus.', 'Fertig. Kein Server wurde gestört.', 'Erledigt. Deine Shell kann sich entspannen.'],
    checksEyebrow: 'DER NÜTZLICHE TEIL', checksTitle: 'Was dieser SSH-Config-Linter prüft.',
    checksIntro: 'Der Browser prüft alle OpenSSH-Regeln, die nur den Konfigurationstext benötigen. Jeder Fund erklärt das Problem und führt zurück zur betroffenen Zeile.',
    allRules: 'Alle 12 Regelbeschreibungen ansehen',
    rules: [
      { code: 'INVALID_VALUE', title: 'Ungültige Werte', text: 'Prüft, ob Port eine ganze Zahl von 1 bis 65535 verwendet.' },
      { code: 'DUP_HOST', title: 'Doppelte Hosts', text: 'Findet wiederholte Host-Muster, die eine Konfiguration schwer verständlich machen.' },
      { code: 'WILDCARD_ORDER', title: 'Wildcard-Reihenfolge', text: 'Warnt, wenn ein konkreter Host nach Host * steht und unerwartete Werte erben kann.' },
      { code: 'INSECURE_OPT', title: 'Unsichere Optionen', text: 'Markiert deaktivierte Host-Prüfungen sowie zu breites Agent- oder X11-Forwarding.' },
      { code: 'WEAK_ALGO', title: 'Schwache Algorithmen', text: 'Erkennt veraltete Cipher, MACs, Schlüsselaustausch- und Signaturalgorithmen.' },
      { code: 'DUP_DIRECTIVE', title: 'Doppelte Direktiven', text: 'Zeigt wiederholte Werte im selben Bereich, wenn OpenSSH nur den ersten nutzt.' },
      { code: 'UNSAFE_CTRL_PATH', title: 'ControlPath-Kollisionen', text: 'Prüft, ob gemeinsam genutzte Verbindungen Host, Port und Benutzer unterscheiden.' },
    ],
    cliEyebrow: 'BROWSER UND CLI', cliTitle: 'Die schnelle Prüfung hier. Die vollständige Prüfung auf deinem Rechner.',
    cliIntro: 'Die Website gibt sofortiges Feedback. Die quelloffene CLI folgt Include-Dateien, erkennt Zyklen und prüft lokale Pfade.',
    browserColumn: 'In diesem Browser', browserItems: ['Keine Installation', 'Kein Upload', 'Sieben inhaltsbasierte Regeln', 'Auf Smartphone und Desktop nutzbar'],
    cliColumn: 'Mit sshconfig-lint', cliItems: ['Verschachtelte Includes', 'Prüfung von IdentityFile-Pfaden', 'Text, JSON, SARIF und GitHub-Ausgabe', 'Language Server für Editoren'],
    installTitle: 'Nutze den vollständigen Linter', installText: 'Installiere ihn mit Homebrew, Cargo, AUR oder als fertiges Binary.',
    copyCommand: 'Befehl kopieren', githubCta: 'Projekt auf GitHub ansehen', footerLine: 'Open Source. Keine Cookies. Kein Tracking.',
    privacy: 'Datenschutz', legal: 'Impressum', source: 'Quellcode',
    privacyTitle: 'Datenschutz ohne Banner',
    privacyBody: [
      'Diese Website nutzt keine Analysewerkzeuge, Werbung, externen Schriftarten, Tracking-Pixel oder technisch nicht erforderlichen Cookies.',
      'SSH-Konfigurationen und geöffnete Dateien werden lokal im Browser verarbeitet. Ihre Inhalte werden nicht an den Server gesendet. Für den sicheren Betrieb können normale Serverprotokolle vorübergehend technische Anfragedaten wie IP-Adresse, Zeitpunkt, angeforderte Seite und User-Agent enthalten.',
    ],
    privacyFacts: [
      { title: 'Konfigurationsinhalte', text: 'Werden nur im Browser verarbeitet und von dieser Anwendung nicht übertragen.' },
      { title: 'Cookies', text: 'Keine.' },
      { title: 'Drittanbieter', text: 'Keine fremden Skripte und keine extern geladenen Schriftarten.' },
      { title: 'Farbschema', text: 'Die Auswahl zwischen hellem und dunklem Farbschema wird nur in diesem Browser gespeichert.' },
    ],
    legalTitle: 'Impressum', legalIntro: 'Diese Website und das Open-Source-Projekt werden von Noah Thiering betrieben. Die zentrale Anbieter- und Kontaktseite befindet sich auf thiering.org.',
    back: 'Zurück zur Prüfung',
    findingMessages: {
      duplicateHost: "Host '{pattern}' ist doppelt vorhanden. Das erste Vorkommen steht in Zeile {first}.",
      wildcardOrder: "Host '{pattern}' steht nach Host * aus Zeile {first}.", weakAlgorithm: "'{algorithm}' in {directive} ist schwach oder veraltet.",
      duplicateDirective: '{directive} ist in diesem Bereich doppelt. Der erste Wert steht in Zeile {first}.', strictHostCheck: 'Die Prüfung des Host-Schlüssels ist deaktiviert.',
      knownHostsNull: 'Bekannte Host-Schlüssel werden über /dev/null verworfen.', quietLog: 'LogLevel QUIET verbirgt hilfreiche Informationen zur Fehlersuche.',
      forwardAgent: 'ForwardAgent ist global oder für Host * aktiviert.', forwardX11: 'ForwardX11 ist global oder für Host * aktiviert.',
      forwardX11Trusted: 'ForwardX11Trusted ist global oder für Host * aktiviert.', unsafeControlPath: 'Im ControlPath fehlen {missing}. Verbindungen können denselben Socket verwenden.',
      invalidValue: "{directive} hat den ungültigen Wert '{target}'. Erwartet wird eine ganze Zahl von 1 bis 65535.",
    },
    findingHints: {
      duplicateHost: 'Entferne oder verbinde einen der doppelten Blöcke.', wildcardOrder: 'Verschiebe Host * ans Ende, sofern die Reihenfolge nicht beabsichtigt ist.',
      weakAlgorithm: 'Entferne den Algorithmus und nutze eine moderne Alternative.', duplicateDirective: 'Entferne die Wiederholung. OpenSSH übernimmt meist den ersten Wert.',
      strictHostCheck: "Entferne die Option oder nutze bei Bedarf 'accept-new'.", knownHostsNull: 'Nutze die normale known_hosts-Datei.', quietLog: 'Nutze INFO oder VERBOSE für die Fehlersuche.',
      forwardAgent: 'Aktiviere Agent-Forwarding nur für konkrete vertrauenswürdige Hosts.', forwardX11: 'Aktiviere X11-Forwarding nur für konkrete vertrauenswürdige Hosts.',
      forwardX11Trusted: 'Vermeide vertrauenswürdiges X11-Forwarding für breite Host-Muster.', unsafeControlPath: 'Füge %h, %p und %r hinzu oder nutze %C.',
      invalidValue: 'Verwende eine Portnummer von 1 bis 65535.',
    },
  },
  fr: {
    languageName: 'Français', skipToContent: 'Aller au contenu principal', darkMode: 'Utiliser le thème sombre', lightMode: 'Utiliser le thème clair', githubStars: '{count} étoiles GitHub', primaryNavigation: 'Navigation principale', legalNavigation: 'Liens juridiques et du projet', languageMenu: 'Choisir la langue', packageManagers: 'Choisir un gestionnaire de paquets', nav: { playground: 'Vérifier', checks: 'Contrôles', learn: 'Apprendre', cli: 'CLI', github: 'GitHub', editor: 'Éditeur', ci: 'Workflows CI', guides: 'Guides' },
    eyebrow: 'Vérificateur OpenSSH gratuit', title: "Un linter de configuration SSH qui repère ce que SSH ne signale pas.",
    intro: 'Collez votre ~/.ssh/config ou ouvrez un fichier. Ce vérificateur SSH gratuit repère les hôtes dupliqués, les options risquées, les algorithmes faibles et les problèmes d’ordre.',
    privateNote: 'Aucun contenu ne quitte ce navigateur.', localCheck: 'TRAITÉ DANS CE NAVIGATEUR', configLabel: 'COLLER OU OUVRIR LA CONFIGURATION',
    configHelper: 'Remplacez l’exemple ou ouvrez votre fichier ~/.ssh/config.', resultLabel: 'RÉSULTAT',
    openFile: 'Ouvrir un fichier', loadExample: 'Charger un exemple', clear: 'Effacer', copy: 'Copier la configuration', copied: 'Copié', check: 'Vérifier', shortcut: 'Ctrl ou ⌘ + Entrée',
    emptyResult: 'Collez une configuration ou ouvrez un fichier.', cleanResult: 'Aucun problème détecté. Le terminal approuve.', resultCount: '{count} points à vérifier', line: 'ligne', lines: 'lignes', warning: 'avertissement', info: 'info', learnRule: 'À propos de cette règle',
    browserNotice: "Le navigateur vérifie uniquement le contenu fourni. Il ne peut pas lire votre ordinateur.",
    includeNotice: "Les Include sont visibles, mais les fichiers liés ne peuvent pas être résolus ici. Utilisez la CLI pour le contrôle complet.",
    identityNotice: "Les chemins IdentityFile ne peuvent pas être vérifiés dans un navigateur. La CLI vérifie leur existence.",
    checkedMessages: ['Vérification terminée.', 'Terminé. Aucun serveur dérangé.', 'C’est fait. Votre shell peut souffler.'],
    checksEyebrow: 'LA PARTIE UTILE', checksTitle: 'Ce que vérifie ce linter de configuration SSH.', checksIntro: 'Le navigateur vérifie les règles OpenSSH qui nécessitent uniquement le texte de configuration. Chaque résultat explique le problème et renvoie à la ligne concernée.',
    allRules: 'Voir les 12 guides de règles',
    rules: [
      { code: 'INVALID_VALUE', title: 'Valeurs invalides', text: 'Vérifie que Port contient un entier compris entre 1 et 65535.' },
      { code: 'DUP_HOST', title: 'Hôtes dupliqués', text: 'Repère les motifs Host répétés qui rendent la configuration difficile à comprendre.' },
      { code: 'WILDCARD_ORDER', title: 'Ordre des jokers', text: 'Avertit lorsqu’un hôte précis apparaît après Host *.' },
      { code: 'INSECURE_OPT', title: 'Options risquées', text: 'Signale la vérification désactivée et les redirections trop larges.' },
      { code: 'WEAK_ALGO', title: 'Algorithmes faibles', text: 'Reconnaît les chiffrements, MAC et algorithmes obsolètes.' },
      { code: 'DUP_DIRECTIVE', title: 'Directives répétées', text: 'Montre les valeurs répétées dans une même portée.' },
      { code: 'UNSAFE_CTRL_PATH', title: 'Collisions ControlPath', text: 'Vérifie que les connexions partagées distinguent hôte, port et utilisateur.' },
    ],
    cliEyebrow: 'NAVIGATEUR ET CLI', cliTitle: 'Un contrôle rapide ici. Le contrôle complet sur votre machine.',
    cliIntro: 'Le site donne un retour immédiat. La CLI open source suit les Include, détecte les cycles et vérifie les chemins locaux.',
    browserColumn: 'Dans ce navigateur', browserItems: ['Aucune installation', 'Aucun envoi', 'Sept règles textuelles', 'Mobile et ordinateur'],
    cliColumn: 'Avec sshconfig-lint', cliItems: ['Résolution des Include imbriqués', 'Vérification des IdentityFile', 'Sorties texte, JSON, SARIF et GitHub', 'Serveur de langage pour éditeurs'],
    installTitle: 'Utiliser le linter complet', installText: 'Installez-le avec Homebrew, Cargo, AUR ou un binaire précompilé.', copyCommand: 'Copier la commande',
    githubCta: 'Voir le projet sur GitHub', footerLine: 'Open source. Aucun cookie. Aucun suivi.', privacy: 'Confidentialité', legal: 'Mentions légales', source: 'Code source',
    privacyTitle: 'La confidentialité sans bannière', privacyBody: [
      'Ce site n’utilise ni outil d’analyse, ni publicité, ni police externe, ni pixel de suivi, ni cookie non essentiel.',
      'Les configurations SSH et fichiers ouverts sont traités localement dans le navigateur. Leur contenu n’est pas envoyé au serveur. Les journaux techniques standards peuvent conserver temporairement des données de requête pour la sécurité du service.',
    ],
    privacyFacts: [{ title: 'Configurations', text: 'Traitées uniquement dans votre navigateur.' }, { title: 'Cookies', text: 'Aucun.' }, { title: 'Services tiers', text: 'Aucun script tiers ni police distante.' }, { title: 'Thème', text: 'Le choix clair ou sombre est enregistré uniquement dans ce navigateur.' }],
    legalTitle: 'Mentions légales', legalIntro: 'Ce site et le projet open source sont exploités par Noah Thiering. La page centrale de l’éditeur et de contact est disponible sur thiering.org.', back: 'Retour au vérificateur',
    findingMessages: {
      duplicateHost: "L’hôte '{pattern}' est répété. La première occurrence est à la ligne {first}.", wildcardOrder: "L’hôte '{pattern}' apparaît après Host * à la ligne {first}.",
      weakAlgorithm: "'{algorithm}' dans {directive} est faible ou obsolète.", duplicateDirective: '{directive} est répété dans cette portée. La première valeur est à la ligne {first}.',
      strictHostCheck: 'La vérification de la clé de l’hôte est désactivée.', knownHostsNull: 'Les clés connues sont supprimées via /dev/null.', quietLog: 'LogLevel QUIET masque des informations utiles.',
      forwardAgent: 'ForwardAgent est activé globalement ou pour Host *.', forwardX11: 'ForwardX11 est activé globalement ou pour Host *.',
      forwardX11Trusted: 'ForwardX11Trusted est activé globalement ou pour Host *.', unsafeControlPath: 'Il manque {missing} dans ControlPath. Des connexions peuvent partager un socket.',
      invalidValue: "{directive} contient la valeur invalide '{target}'. Un entier de 1 à 65535 est attendu.",
    },
    findingHints: {
      duplicateHost: 'Supprimez ou regroupez un des blocs.', wildcardOrder: 'Placez Host * à la fin si cet ordre n’est pas intentionnel.', weakAlgorithm: 'Utilisez un algorithme moderne.',
      duplicateDirective: 'Supprimez la répétition. OpenSSH conserve généralement la première valeur.', strictHostCheck: "Supprimez l’option ou utilisez 'accept-new' si nécessaire.",
      knownHostsNull: 'Utilisez le fichier known_hosts normal.', quietLog: 'Utilisez INFO ou VERBOSE pour le diagnostic.', forwardAgent: 'Activez la redirection uniquement pour des hôtes précis et fiables.',
      forwardX11: 'Limitez la redirection X11 aux hôtes fiables.', forwardX11Trusted: 'Évitez cette option sur des motifs larges.', unsafeControlPath: 'Ajoutez %h, %p et %r, ou utilisez %C.',
      invalidValue: 'Utilisez un numéro de port compris entre 1 et 65535.',
    },
  },
  es: {
    languageName: 'Español', skipToContent: 'Saltar al contenido principal', darkMode: 'Usar el tema oscuro', lightMode: 'Usar el tema claro', githubStars: '{count} estrellas en GitHub', primaryNavigation: 'Navegación principal', legalNavigation: 'Enlaces legales y del proyecto', languageMenu: 'Elegir idioma', packageManagers: 'Elegir un gestor de paquetes', nav: { playground: 'Comprobar', checks: 'Comprobaciones', learn: 'Aprender', cli: 'CLI', github: 'GitHub', editor: 'Editor', ci: 'Workflows CI', guides: 'Guías' },
    eyebrow: 'Comprobador OpenSSH gratuito', title: 'Un linter de configuración SSH que encuentra lo que SSH no menciona.',
    intro: 'Pega tu ~/.ssh/config o abre un archivo. Este comprobador SSH gratuito detecta hosts duplicados, opciones inseguras, algoritmos débiles y problemas de orden.',
    privateNote: 'Nada se sube. La comprobación permanece en este navegador.', localCheck: 'PROCESADO EN ESTE NAVEGADOR', configLabel: 'PEGA O ABRE TU CONFIGURACIÓN',
    configHelper: 'Sustituye el ejemplo o abre tu archivo ~/.ssh/config.', resultLabel: 'RESULTADO',
    openFile: 'Abrir archivo', loadExample: 'Cargar ejemplo', clear: 'Vaciar', copy: 'Copiar configuración', copied: 'Copiado', check: 'Comprobar', shortcut: 'Ctrl o ⌘ + Intro',
    emptyResult: 'Pega una configuración o abre un archivo.', cleanResult: 'No se encontraron problemas. La terminal aprueba.', resultCount: '{count} puntos para revisar', line: 'línea', lines: 'líneas', warning: 'aviso', info: 'info', learnRule: 'Acerca de esta regla',
    browserNotice: 'El navegador solo comprueba el contenido proporcionado. No puede leer tu ordenador.',
    includeNotice: 'Los Include se detectan, pero los archivos enlazados no pueden resolverse aquí. Usa la CLI para la comprobación completa.',
    identityNotice: 'Las rutas IdentityFile no se pueden verificar en el navegador. La CLI comprueba si existen.',
    checkedMessages: ['Comprobado. Buen trabajo.', 'Listo. Ningún servidor fue molestado.', 'Terminado. Tu shell puede relajarse.'],
    checksEyebrow: 'LA PARTE ÚTIL', checksTitle: 'Qué comprueba este linter de configuración SSH.', checksIntro: 'El navegador comprueba las reglas de OpenSSH que solo necesitan el texto de configuración. Cada resultado explica el problema y enlaza con su línea.',
    allRules: 'Ver las 12 guías de reglas',
    rules: [
      { code: 'INVALID_VALUE', title: 'Valores no válidos', text: 'Comprueba que Port use un entero entre 1 y 65535.' },
      { code: 'DUP_HOST', title: 'Hosts duplicados', text: 'Encuentra patrones Host repetidos que dificultan entender la configuración.' },
      { code: 'WILDCARD_ORDER', title: 'Orden de comodines', text: 'Avisa si un host específico aparece después de Host *.' },
      { code: 'INSECURE_OPT', title: 'Opciones inseguras', text: 'Marca la verificación desactivada y el reenvío demasiado amplio.' },
      { code: 'WEAK_ALGO', title: 'Algoritmos débiles', text: 'Reconoce cifrados, MAC y algoritmos obsoletos.' },
      { code: 'DUP_DIRECTIVE', title: 'Directivas repetidas', text: 'Muestra valores repetidos dentro del mismo ámbito.' },
      { code: 'UNSAFE_CTRL_PATH', title: 'Colisiones ControlPath', text: 'Comprueba que las conexiones compartidas distingan host, puerto y usuario.' },
    ],
    cliEyebrow: 'NAVEGADOR Y CLI', cliTitle: 'Una comprobación rápida aquí. La completa en tu equipo.',
    cliIntro: 'La web ofrece información inmediata. La CLI de código abierto sigue Include, detecta ciclos y comprueba rutas locales.',
    browserColumn: 'En este navegador', browserItems: ['Sin instalación', 'Sin subidas', 'Siete reglas de contenido', 'Móvil y escritorio'],
    cliColumn: 'Con sshconfig-lint', cliItems: ['Resolución de Include anidados', 'Comprobación de IdentityFile', 'Salida en texto, JSON, SARIF y GitHub', 'Servidor de lenguaje para editores'],
    installTitle: 'Usa el linter completo', installText: 'Instálalo con Homebrew, Cargo, AUR o un binario precompilado.', copyCommand: 'Copiar comando',
    githubCta: 'Ver el proyecto en GitHub', footerLine: 'Código abierto. Sin cookies. Sin rastreo.', privacy: 'Privacidad', legal: 'Aviso legal', source: 'Código fuente',
    privacyTitle: 'Privacidad sin banner', privacyBody: [
      'Este sitio no utiliza analítica, publicidad, fuentes externas, píxeles de seguimiento ni cookies no esenciales.',
      'Las configuraciones SSH y los archivos abiertos se procesan localmente en el navegador. Su contenido no se envía al servidor. Los registros técnicos normales pueden conservar temporalmente datos de solicitud para mantener el servicio seguro.',
    ],
    privacyFacts: [{ title: 'Configuraciones', text: 'Se procesan únicamente en tu navegador.' }, { title: 'Cookies', text: 'Ninguna.' }, { title: 'Terceros', text: 'Sin scripts de terceros ni fuentes remotas.' }, { title: 'Tema', text: 'La preferencia clara u oscura se guarda solo en este navegador.' }],
    legalTitle: 'Aviso legal', legalIntro: 'Este sitio y el proyecto de código abierto están gestionados por Noah Thiering. La página central del responsable y de contacto está disponible en thiering.org.', back: 'Volver al comprobador',
    findingMessages: {
      duplicateHost: "El host '{pattern}' está repetido. La primera aparición está en la línea {first}.", wildcardOrder: "El host '{pattern}' aparece después de Host * en la línea {first}.",
      weakAlgorithm: "'{algorithm}' en {directive} es débil u obsoleto.", duplicateDirective: '{directive} se repite en este ámbito. El primer valor está en la línea {first}.',
      strictHostCheck: 'La verificación de la clave del host está desactivada.', knownHostsNull: 'Las claves conocidas se descartan mediante /dev/null.', quietLog: 'LogLevel QUIET oculta información útil.',
      forwardAgent: 'ForwardAgent está activado globalmente o para Host *.', forwardX11: 'ForwardX11 está activado globalmente o para Host *.',
      forwardX11Trusted: 'ForwardX11Trusted está activado globalmente o para Host *.', unsafeControlPath: 'Falta {missing} en ControlPath. Varias conexiones podrían compartir un socket.',
      invalidValue: "{directive} tiene el valor no válido '{target}'. Se espera un entero entre 1 y 65535.",
    },
    findingHints: {
      duplicateHost: 'Elimina o combina uno de los bloques.', wildcardOrder: 'Mueve Host * al final si el orden no es intencionado.', weakAlgorithm: 'Usa un algoritmo moderno.',
      duplicateDirective: 'Elimina la repetición. OpenSSH suele conservar el primer valor.', strictHostCheck: "Elimina la opción o usa 'accept-new' cuando corresponda.",
      knownHostsNull: 'Usa el archivo known_hosts normal.', quietLog: 'Usa INFO o VERBOSE para diagnosticar.', forwardAgent: 'Actívalo solo para hosts concretos y de confianza.',
      forwardX11: 'Limita el reenvío X11 a hosts de confianza.', forwardX11Trusted: 'Evita esta opción en patrones amplios.', unsafeControlPath: 'Añade %h, %p y %r, o usa %C.',
      invalidValue: 'Usa un número de puerto entre 1 y 65535.',
    },
  },
};
