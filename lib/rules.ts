import type { Locale } from './i18n';

export type RuleSeverity = 'error' | 'warning' | 'info';

type RuleText = { title: string; summary: string; why: string; fix: string };

export type RuleDoc = {
  browser: boolean;
  code: string;
  example: string;
  fixedExample: string;
  highlights: Array<{ line: number; target: string }>;
  severity: RuleSeverity;
  slug: string;
  text: Record<Locale, RuleText>;
};

const translations = (
  en: RuleText,
  de: RuleText,
  fr: RuleText,
  es: RuleText,
): Record<Locale, RuleText> => ({ en, de, fr, es });

export const ruleDocs: RuleDoc[] = [
  {
    slug: 'invalid-directive-value', code: 'INVALID_VALUE', severity: 'error', browser: true,
    example: 'Host production\n  Port 70000\n  AddressFamily ipv4\n  ControlMaster auto-ask\n  PubkeyAuthentication bound',
    fixedExample: 'Host production\n  Port 22\n  AddressFamily inet\n  ControlMaster autoask\n  PubkeyAuthentication host-bound',
    highlights: [{ line: 2, target: '70000' }, { line: 3, target: 'ipv4' }, { line: 4, target: 'auto-ask' }, { line: 5, target: 'bound' }],
    text: translations(
      { title: 'Invalid directive value', summary: 'A directive contains a number, duration, mask, DSCP value, or named option that OpenSSH does not accept.', why: 'Invalid values can stop SSH from loading the config before a connection starts. Small spelling differences also matter. ControlMaster accepts autoask, but not auto-ask, and AddressFamily accepts inet, but not ipv4.', fix: 'Use Port 1 through 65535 and non-negative counters. Use the exact documented names for options such as AddressFamily, ControlMaster, StrictHostKeyChecking, LogLevel, and PubkeyAuthentication. The checker accepts modern OpenSSH values without guessing your installed client version. Verify the result with ssh -G production.' },
      { title: 'Ungültiger Direktivenwert', summary: 'Eine Direktive enthält eine Zahl, Dauer, Maske, einen DSCP-Wert oder einen Optionsnamen, den OpenSSH nicht akzeptiert.', why: 'Ungültige Werte können das Laden der SSH-Konfiguration bereits vor dem Verbindungsaufbau verhindern. Kleine Schreibunterschiede sind relevant. ControlMaster akzeptiert autoask, aber nicht auto-ask, und AddressFamily akzeptiert inet, aber nicht ipv4.', fix: 'Nutze für Port 1 bis 65535 und für Zähler nicht negative ganze Zahlen. Verwende bei AddressFamily, ControlMaster, StrictHostKeyChecking, LogLevel und PubkeyAuthentication exakt die dokumentierten Namen. Der Check akzeptiert moderne OpenSSH-Werte, ohne deine installierte Client-Version zu erraten. Prüfe das Ergebnis mit ssh -G production.' },
      { title: 'Valeur de directive invalide', summary: 'Une directive contient un nombre, une durée, un masque, une valeur DSCP ou un nom d’option refusé par OpenSSH.', why: 'Une valeur invalide peut empêcher SSH de charger la configuration avant même la connexion. Les petites différences comptent. ControlMaster accepte autoask, mais pas auto-ask, et AddressFamily accepte inet, mais pas ipv4.', fix: 'Utilisez un Port de 1 à 65535 et des compteurs non négatifs. Pour AddressFamily, ControlMaster, StrictHostKeyChecking, LogLevel et PubkeyAuthentication, utilisez exactement les noms documentés. Le contrôle accepte les valeurs OpenSSH modernes sans deviner la version installée. Vérifiez avec ssh -G production.' },
      { title: 'Valor de directiva no válido', summary: 'Una directiva contiene un número, duración, máscara, valor DSCP o nombre de opción que OpenSSH no acepta.', why: 'Un valor no válido puede impedir que SSH cargue la configuración antes de iniciar la conexión. Las pequeñas diferencias importan. ControlMaster acepta autoask, pero no auto-ask, y AddressFamily acepta inet, pero no ipv4.', fix: 'Usa un Port entre 1 y 65535 y contadores no negativos. Usa exactamente los nombres documentados para AddressFamily, ControlMaster, StrictHostKeyChecking, LogLevel y PubkeyAuthentication. El comprobador acepta valores modernos de OpenSSH sin adivinar la versión instalada. Comprueba el resultado con ssh -G production.' },
    ),
  },
  {
    slug: 'duplicate-host', code: 'DUP_HOST', severity: 'warning', browser: true,
    example: 'Host github.com\n  User git\n\nHost github.com\n  User deploy',
    fixedExample: 'Host github.com\n  User git',
    highlights: [{ line: 4, target: 'Host github.com' }],
    text: translations(
      { title: 'Duplicate Host blocks', summary: 'The same Host pattern appears in more than one block.', why: 'Repeated blocks hide which values are effective and make later changes easy to miss.', fix: 'Choose the block that should own the alias, move any unique directives into it, and delete the second Host declaration. If the blocks describe different machines, give each one a distinct alias such as github-work and github-personal.' },
      { title: 'Doppelte Host-Blöcke', summary: 'Dasselbe Host-Muster kommt in mehreren Blöcken vor.', why: 'Wiederholte Blöcke verschleiern die wirksamen Werte und machen spätere Änderungen leicht übersehbar.', fix: 'Entscheide, welcher Block den Alias behalten soll, übernimm dort alle benötigten Direktiven und lösche die zweite Host-Zeile. Sind wirklich verschiedene Ziele gemeint, verwende eindeutige Aliase wie github-arbeit und github-privat.' },
      { title: 'Blocs Host dupliqués', summary: 'Le même motif Host apparaît dans plusieurs blocs.', why: 'Les blocs répétés masquent les valeurs effectives et compliquent les modifications.', fix: 'Choisissez le bloc qui doit conserver cet alias, déplacez-y les directives utiles et supprimez la seconde déclaration Host. Pour deux machines différentes, utilisez deux alias distincts.' },
      { title: 'Bloques Host duplicados', summary: 'El mismo patrón Host aparece en varios bloques.', why: 'Los bloques repetidos ocultan los valores efectivos y dificultan los cambios.', fix: 'Elige el bloque que conservará el alias, mueve allí las directivas necesarias y elimina la segunda declaración Host. Si son destinos diferentes, utiliza alias distintos.' },
    ),
  },
  {
    slug: 'identity-file-exists', code: 'MISSING_IDENTITY', severity: 'error', browser: false,
    example: 'Host production\n  IdentityFile ~/.ssh/id_removed',
    fixedExample: 'Host production\n  IdentityFile ~/.ssh/id_ed25519',
    highlights: [{ line: 2, target: '~/.ssh/id_removed' }],
    text: translations(
      { title: 'Missing IdentityFile', summary: 'An IdentityFile path does not exist on the local machine.', why: 'SSH cannot use a private key that was moved, renamed, or deleted.', fix: 'Check the path with ls or test -f, then point IdentityFile at the existing private key. If the key was intentionally removed, delete the directive or use IdentityFile none to explicitly disable identity files. If it was restored, keep its permissions restricted to the owner.' },
      { title: 'Fehlende IdentityFile', summary: 'Ein IdentityFile-Pfad existiert auf dem lokalen Rechner nicht.', why: 'SSH kann einen verschobenen, umbenannten oder gelöschten privaten Schlüssel nicht verwenden.', fix: 'Prüfe den Pfad mit ls oder test -f und trage anschließend den tatsächlich vorhandenen privaten Schlüssel ein. Wurde der Schlüssel absichtlich entfernt, lösche die Direktive oder deaktiviere Identitätsdateien ausdrücklich mit IdentityFile none. Nach einer Wiederherstellung sollten die Dateirechte nur dem Besitzer Zugriff geben.' },
      { title: 'IdentityFile introuvable', summary: 'Un chemin IdentityFile n’existe pas sur la machine locale.', why: 'SSH ne peut pas utiliser une clé déplacée, renommée ou supprimée.', fix: 'Vérifiez le chemin avec ls ou test -f puis indiquez la clé privée existante. Supprimez la directive si la clé n’est plus utilisée ou utilisez IdentityFile none pour désactiver explicitement les fichiers d’identité. Limitez ses permissions au propriétaire si vous la restaurez.' },
      { title: 'IdentityFile ausente', summary: 'Una ruta IdentityFile no existe en el equipo local.', why: 'SSH no puede usar una clave movida, renombrada o eliminada.', fix: 'Comprueba la ruta con ls o test -f y apunta IdentityFile a la clave privada existente. Elimina la directiva si ya no se usa o utiliza IdentityFile none para desactivar explícitamente los archivos de identidad. Restringe los permisos al propietario si restauras la clave.' },
    ),
  },
  {
    slug: 'wildcard-host-order', code: 'WILDCARD_ORDER', severity: 'warning', browser: true,
    example: 'Host *\n  User deploy\n\nHost github.com\n  User git',
    fixedExample: 'Host github.com\n  User git\n\nHost *\n  User deploy',
    highlights: [{ line: 1, target: 'Host *' }, { line: 4, target: 'Host github.com' }],
    text: translations(
      { title: 'Wildcard Host ordering', summary: 'A specific Host block appears after Host *.', why: 'OpenSSH keeps the first value it obtains for most parameters. A broad earlier block can therefore override a later specific value.', fix: 'Move every specific Host block above the broad Host * defaults. Afterwards run ssh -G github.com and inspect the effective User, HostName, and IdentityFile values to confirm the order.' },
      { title: 'Reihenfolge von Host *', summary: 'Ein konkreter Host-Block steht nach Host *.', why: 'OpenSSH behält für die meisten Parameter den ersten gefundenen Wert. Ein früher allgemeiner Block kann dadurch einen späteren konkreten Wert überstimmen.', fix: 'Verschiebe alle konkreten Host-Blöcke vor die allgemeinen Host *-Vorgaben. Prüfe danach mit ssh -G github.com die tatsächlich wirksamen Werte für User, HostName und IdentityFile.' },
      { title: 'Ordre de Host *', summary: 'Un bloc Host précis apparaît après Host *.', why: 'OpenSSH conserve généralement la première valeur trouvée. Un bloc général peut donc remplacer une valeur précise.', fix: 'Placez tous les blocs Host précis avant les valeurs générales de Host *. Vérifiez ensuite les valeurs effectives avec ssh -G github.com.' },
      { title: 'Orden de Host *', summary: 'Un bloque Host específico aparece después de Host *.', why: 'OpenSSH suele conservar el primer valor encontrado. Un bloque general puede anular un valor específico posterior.', fix: 'Mueve todos los bloques Host específicos por encima de los valores generales de Host *. Comprueba después los valores efectivos con ssh -G github.com.' },
    ),
  },
  {
    slug: 'deprecated-weak-algorithms', code: 'WEAK_ALGO', severity: 'warning', browser: true,
    example: 'Host legacy\n  Ciphers aes256-gcm@openssh.com,3des-cbc',
    fixedExample: 'Host legacy\n  Ciphers aes256-gcm@openssh.com',
    highlights: [{ line: 2, target: '3des-cbc' }],
    text: translations(
      { title: 'Weak or deprecated algorithm', summary: 'A cipher, MAC, key exchange, or signature algorithm is outdated.', why: 'Legacy algorithms can reduce connection security and may disappear from future OpenSSH versions.', fix: 'Remove the flagged algorithm from the comma-separated list. Prefer deleting the whole Ciphers, MACs, KexAlgorithms, or HostKeyAlgorithms directive so OpenSSH can use its maintained defaults; keep a narrowly scoped exception only for a legacy host you cannot upgrade.' },
      { title: 'Schwacher oder veralteter Algorithmus', summary: 'Ein Cipher-, MAC-, Schlüsselaustausch- oder Signaturalgorithmus ist veraltet.', why: 'Alte Algorithmen können die Verbindungssicherheit reduzieren und in künftigen OpenSSH-Versionen entfallen.', fix: 'Entferne den markierten Algorithmus aus der kommagetrennten Liste. Am sichersten ist es, die gesamte Ciphers-, MACs-, KexAlgorithms- oder HostKeyAlgorithms-Direktive zu löschen und die gepflegten OpenSSH-Standards zu verwenden; eine Ausnahme sollte nur für einen einzelnen nicht aktualisierbaren Alt-Host gelten.' },
      { title: 'Algorithme faible ou obsolète', summary: 'Un algorithme de chiffrement, MAC, échange de clé ou signature est ancien.', why: 'Les anciens algorithmes réduisent la sécurité et peuvent disparaître des futures versions.', fix: 'Supprimez l’algorithme signalé de la liste. Il est préférable de supprimer toute la directive pour utiliser les valeurs modernes d’OpenSSH et de limiter toute exception à un seul ancien hôte.' },
      { title: 'Algoritmo débil u obsoleto', summary: 'Un algoritmo de cifrado, MAC, intercambio o firma está anticuado.', why: 'Los algoritmos antiguos reducen la seguridad y pueden desaparecer en versiones futuras.', fix: 'Elimina el algoritmo marcado de la lista. Es preferible borrar toda la directiva para usar los valores modernos de OpenSSH y limitar cualquier excepción a un único host antiguo.' },
    ),
  },
  {
    slug: 'duplicate-directives', code: 'DUP_DIRECTIVE', severity: 'warning', browser: true,
    example: 'Host work\n  User deploy\n  User admin',
    fixedExample: 'Host work\n  User deploy',
    highlights: [{ line: 3, target: 'User admin' }],
    text: translations(
      { title: 'Duplicate directive', summary: 'A single-value directive is repeated in the same scope.', why: 'OpenSSH usually uses the first obtained value, so a later line can look effective while doing nothing.', fix: 'Decide which value should actually apply, keep it as the only directive in that Host block, and delete the other line. Verify the result with ssh -G work, because simply moving the later value does not override an earlier match.' },
      { title: 'Doppelte Direktive', summary: 'Eine Direktive mit Einzelwert steht mehrfach im selben Bereich.', why: 'OpenSSH nutzt meist den ersten gefundenen Wert. Eine spätere Zeile kann daher wirksam aussehen, obwohl sie nichts ändert.', fix: 'Entscheide, welcher Wert wirklich gelten soll, behalte genau diese eine Direktive im Host-Block und lösche die andere Zeile. Prüfe das Ergebnis mit ssh -G work, denn ein späterer Wert überschreibt einen früheren Treffer nicht einfach.' },
      { title: 'Directive dupliquée', summary: 'Une directive à valeur unique est répétée dans la même portée.', why: 'OpenSSH utilise généralement la première valeur. Une ligne ultérieure peut sembler active sans effet.', fix: 'Choisissez la valeur réellement voulue, conservez une seule directive dans ce bloc et supprimez l’autre. Contrôlez le résultat avec ssh -G work.' },
      { title: 'Directiva duplicada', summary: 'Una directiva de valor único se repite en el mismo ámbito.', why: 'OpenSSH suele usar el primer valor. Una línea posterior puede parecer activa sin tener efecto.', fix: 'Elige el valor que debe aplicarse, conserva una sola directiva en el bloque y elimina la otra. Verifica el resultado con ssh -G work.' },
    ),
  },
  {
    slug: 'insecure-option', code: 'INSECURE_OPT', severity: 'warning', browser: true,
    example: 'Host *\n  StrictHostKeyChecking no\n  ForwardAgent yes',
    fixedExample: 'Host github.com\n  StrictHostKeyChecking accept-new\n  ForwardAgent no',
    highlights: [{ line: 2, target: 'StrictHostKeyChecking no' }, { line: 3, target: 'ForwardAgent yes' }],
    text: translations(
      { title: 'Insecure SSH option', summary: 'A setting weakens host verification or enables risky forwarding too broadly.', why: 'Disabled verification enables man-in-the-middle attacks. Broad forwarding exposes local capabilities to every matching server.', fix: 'Remove StrictHostKeyChecking no, or use accept-new when first-use automation is required while still rejecting changed keys. Keep ForwardAgent and X11 forwarding off globally and enable them only inside a specific trusted Host block.' },
      { title: 'Unsichere SSH-Option', summary: 'Eine Einstellung schwächt die Host-Prüfung oder aktiviert riskantes Forwarding zu breit.', why: 'Deaktivierte Prüfung ermöglicht Man-in-the-Middle-Angriffe. Breites Forwarding gibt jedem passenden Server lokale Fähigkeiten.', fix: 'Entferne StrictHostKeyChecking no oder nutze accept-new, wenn der erste Verbindungsaufbau automatisiert werden muss, geänderte Schlüssel aber weiterhin abgelehnt werden sollen. Lasse Agent- und X11-Forwarding global aus und aktiviere sie nur in einem konkreten vertrauenswürdigen Host-Block.' },
      { title: 'Option SSH risquée', summary: 'Un réglage affaiblit la vérification ou active une redirection trop large.', why: 'Une vérification désactivée permet les attaques intermédiaires. Une redirection globale expose des capacités locales.', fix: 'Supprimez StrictHostKeyChecking no ou utilisez accept-new si nécessaire. Désactivez les redirections globales et activez-les uniquement dans un bloc Host précis et fiable.' },
      { title: 'Opción SSH insegura', summary: 'Un ajuste debilita la verificación o activa un reenvío demasiado amplio.', why: 'Desactivar la verificación permite ataques intermediarios. El reenvío global expone capacidades locales.', fix: 'Elimina StrictHostKeyChecking no o utiliza accept-new cuando sea necesario. Mantén los reenvíos desactivados globalmente y actívalos solo en un bloque Host concreto y fiable.' },
    ),
  },
  {
    slug: 'unsafe-control-path', code: 'UNSAFE_CTRL_PATH', severity: 'warning', browser: true,
    example: 'Host *\n  ControlMaster auto\n  ControlPath ~/.ssh/control-%h',
    fixedExample: 'Host *\n  ControlMaster auto\n  ControlPath ~/.ssh/control-%C',
    highlights: [{ line: 3, target: '~/.ssh/control-%h' }],
    text: translations(
      { title: 'Unsafe ControlPath', summary: 'ControlPath does not uniquely identify host, port, and user.', why: 'Different SSH connections can collide and reuse the same control socket.', fix: 'Replace the path with a compact hash such as ~/.ssh/control-%C, or include all three tokens %r@%h:%p. Keep the socket directory private and create it before connecting if you place sockets in a subdirectory.' },
      { title: 'Unsicherer ControlPath', summary: 'Der ControlPath unterscheidet Host, Port und Benutzer nicht eindeutig.', why: 'Verschiedene SSH-Verbindungen können kollidieren und denselben Control-Socket verwenden.', fix: 'Ersetze den Pfad durch einen kompakten Hash wie ~/.ssh/control-%C oder nimm alle drei Platzhalter %r@%h:%p auf. Verwende ein privates Socket-Verzeichnis und lege es vor der Verbindung an, wenn du einen Unterordner nutzt.' },
      { title: 'ControlPath non sûr', summary: 'ControlPath n’identifie pas clairement hôte, port et utilisateur.', why: 'Des connexions différentes peuvent entrer en collision et partager le même socket.', fix: 'Utilisez un hash comme ~/.ssh/control-%C ou ajoutez les trois jetons %r@%h:%p. Placez les sockets dans un répertoire privé existant.' },
      { title: 'ControlPath inseguro', summary: 'ControlPath no identifica de forma única host, puerto y usuario.', why: 'Distintas conexiones pueden colisionar y reutilizar el mismo socket.', fix: 'Utiliza un hash como ~/.ssh/control-%C o incluye los tres tokens %r@%h:%p. Guarda los sockets en un directorio privado existente.' },
    ),
  },
  {
    slug: 'include-cycle', code: 'INCLUDE_CYCLE', severity: 'error', browser: false,
    example: '# config\nInclude conf.d/work\n\n# conf.d/work\nInclude ../config',
    fixedExample: '# config\nInclude conf.d/work\n\n# conf.d/work\nInclude common.conf\n\n# conf.d/common.conf\nServerAliveInterval 30',
    highlights: [{ line: 5, target: 'Include ../config' }],
    text: translations(
      { title: 'Include cycle', summary: 'Included files eventually include a file that is already being resolved.', why: 'A circular Include chain cannot be expanded safely and usually indicates tangled configuration ownership.', fix: 'Follow the reported chain until it points back to a file already visited, then remove that back-reference. If both files need shared defaults, move those defaults into a third file that they include in one direction only.' },
      { title: 'Include-Zyklus', summary: 'Eingebundene Dateien verweisen schließlich erneut auf eine bereits aufgelöste Datei.', why: 'Eine kreisförmige Include-Kette kann nicht sicher erweitert werden und deutet auf eine verworrene Struktur hin.', fix: 'Verfolge die gemeldete Kette bis zu dem Verweis auf eine bereits besuchte Datei und entferne genau diese Rückkante. Benötigen beide Dateien gemeinsame Vorgaben, verschiebe sie in eine dritte Datei, die nur in eine Richtung eingebunden wird.' },
      { title: 'Cycle Include', summary: 'Des fichiers inclus finissent par inclure un fichier déjà en cours de résolution.', why: 'Une chaîne circulaire ne peut pas être développée correctement.', fix: 'Suivez la chaîne jusqu’au retour vers un fichier déjà visité et supprimez ce lien. Déplacez les réglages communs dans un troisième fichier inclus dans un seul sens.' },
      { title: 'Ciclo de Include', summary: 'Los archivos incluidos terminan incluyendo otro que ya se está resolviendo.', why: 'Una cadena circular no puede expandirse de forma segura.', fix: 'Sigue la cadena hasta que vuelva a un archivo ya visitado y elimina ese enlace. Mueve los ajustes compartidos a un tercer archivo incluido en una sola dirección.' },
    ),
  },
  {
    slug: 'include-depth', code: 'INCLUDE_DEPTH', severity: 'error', browser: false,
    example: '# config\nInclude level-1.conf\n\n# ... level-16.conf\nInclude level-17.conf',
    fixedExample: '# config\nInclude hosts/work.conf\nInclude hosts/personal.conf',
    highlights: [{ line: 5, target: 'Include level-17.conf' }],
    text: translations(
      { title: 'Include nesting too deep', summary: 'An Include chain exceeds OpenSSH’s maximum nesting depth of 16.', why: 'OpenSSH stops loading the configuration when recursive Include nesting becomes too deep. A long chain is also difficult to understand and maintain.', fix: 'Flatten the Include tree. Let the root config include feature or host files directly, move shared settings into one common file, and keep every chain at 16 levels or fewer.' },
      { title: 'Include-Verschachtelung zu tief', summary: 'Eine Include-Kette überschreitet die maximale OpenSSH-Tiefe von 16 Ebenen.', why: 'OpenSSH bricht das Laden der Konfiguration ab, wenn Includes zu tief verschachtelt sind. Eine lange Kette ist außerdem schwer zu verstehen und zu pflegen.', fix: 'Flache die Include-Struktur ab. Binde Funktions- oder Host-Dateien direkt aus der Hauptkonfiguration ein, verschiebe gemeinsame Einstellungen in eine zentrale Datei und halte jede Kette bei höchstens 16 Ebenen.' },
      { title: 'Imbrication Include trop profonde', summary: 'Une chaîne Include dépasse la profondeur maximale de 16 niveaux d’OpenSSH.', why: 'OpenSSH arrête de charger la configuration lorsque les inclusions sont trop profondes. Une longue chaîne est aussi difficile à maintenir.', fix: 'Aplatissez l’arbre Include. Incluez directement les fichiers d’hôtes ou de fonctions depuis la configuration principale et placez les réglages partagés dans un fichier commun.' },
      { title: 'Anidamiento Include demasiado profundo', summary: 'Una cadena Include supera la profundidad máxima de 16 niveles de OpenSSH.', why: 'OpenSSH deja de cargar la configuración cuando los Include están demasiado anidados. Una cadena larga también es difícil de mantener.', fix: 'Aplana el árbol de Include. Incluye directamente los archivos de hosts o funciones desde la configuración principal y mueve los ajustes compartidos a un archivo común.' },
    ),
  },
  {
    slug: 'include-read', code: 'INCLUDE_READ', severity: 'error', browser: false,
    example: 'Include ~/.ssh/conf.d/private.conf',
    fixedExample: 'Include ~/.ssh/conf.d/work.conf',
    highlights: [{ line: 1, target: '~/.ssh/conf.d/private.conf' }],
    text: translations(
      { title: 'Include cannot be read', summary: 'An included file exists in the resolution path but cannot be read.', why: 'Permissions, encoding, or filesystem errors prevent the full configuration from being checked.', fix: 'Expand ~ and inspect the exact path with ls -l. Correct a typo or move the Include to the real file; if the file exists, grant your user read access without making a private SSH configuration world-readable, then rerun the linter.' },
      { title: 'Include nicht lesbar', summary: 'Eine eingebundene Datei kann nicht gelesen werden.', why: 'Berechtigungen, Kodierung oder Dateisystemfehler verhindern die vollständige Prüfung.', fix: 'Löse ~ auf und prüfe den exakten Pfad mit ls -l. Korrigiere einen Tippfehler oder verweise auf die echte Datei; existiert sie, gib deinem Benutzer Leserechte, ohne die private SSH-Konfiguration für alle lesbar zu machen, und starte den Linter erneut.' },
      { title: 'Include illisible', summary: 'Un fichier inclus ne peut pas être lu.', why: 'Les permissions ou des erreurs de fichier empêchent le contrôle complet.', fix: 'Vérifiez le chemin exact avec ls -l, corrigez le nom ou pointez vers le vrai fichier. Si le fichier existe, donnez un accès en lecture à votre utilisateur sans le rendre public, puis relancez le linter.' },
      { title: 'Include ilegible', summary: 'No se puede leer un archivo incluido.', why: 'Los permisos o errores del sistema impiden la comprobación completa.', fix: 'Comprueba la ruta exacta con ls -l, corrige el nombre o apunta al archivo real. Si existe, concede lectura a tu usuario sin hacerlo público y vuelve a ejecutar el linter.' },
    ),
  },
  {
    slug: 'include-glob', code: 'INCLUDE_GLOB', severity: 'error', browser: false,
    example: 'Include ~/.ssh/conf.d/[work.conf',
    fixedExample: 'Include ~/.ssh/conf.d/work.conf',
    highlights: [{ line: 1, target: '[work.conf' }],
    text: translations(
      { title: 'Invalid Include pattern', summary: 'An Include contains an invalid glob expression.', why: 'The pattern cannot be evaluated, so expected configuration files may never be loaded.', fix: 'Balance every [ with ], remove a stray escape, or replace the glob with an exact filename when matching is unnecessary. Run the linter again and confirm that the corrected pattern resolves the files you intended.' },
      { title: 'Ungültiges Include-Muster', summary: 'Ein Include enthält einen ungültigen Glob-Ausdruck.', why: 'Das Muster kann nicht ausgewertet werden. Erwartete Konfigurationsdateien werden dadurch möglicherweise nicht geladen.', fix: 'Schließe jede [ mit ], entferne eine falsche Maskierung oder ersetze das Glob durch einen exakten Dateinamen, wenn keine Auswahl nötig ist. Starte den Linter erneut und prüfe, ob das korrigierte Muster die erwarteten Dateien findet.' },
      { title: 'Motif Include invalide', summary: 'Un Include contient une expression glob invalide.', why: 'Le motif ne peut pas être évalué et des fichiers peuvent manquer.', fix: 'Fermez chaque crochet, retirez les échappements incorrects ou utilisez un nom exact. Relancez le linter et vérifiez que les fichiers attendus sont trouvés.' },
      { title: 'Patrón Include no válido', summary: 'Un Include contiene una expresión glob no válida.', why: 'El patrón no puede evaluarse y pueden faltar archivos.', fix: 'Cierra cada corchete, elimina escapes incorrectos o utiliza un nombre exacto. Ejecuta de nuevo el linter y confirma que se encuentran los archivos esperados.' },
    ),
  },
  {
    slug: 'include-no-match', code: 'INCLUDE_NO_MATCH', severity: 'info', browser: false,
    example: 'Include ~/.ssh/conf.d/*.conf',
    fixedExample: 'Include ~/.ssh/conf.d/work.conf',
    highlights: [{ line: 1, target: '~/.ssh/conf.d/*.conf' }],
    text: translations(
      { title: 'Include matches no files', summary: 'A valid Include pattern currently resolves to no files.', why: 'This can be intentional, but it often reveals an outdated directory or filename.', fix: 'List the directory and compare its real filenames with the pattern. Point Include at the correct directory or extension, create the intended matching file, or remove the optional Include if it is no longer used.' },
      { title: 'Include findet keine Dateien', summary: 'Ein gültiges Include-Muster ergibt aktuell keine Dateien.', why: 'Das kann beabsichtigt sein, weist aber oft auf ein veraltetes Verzeichnis oder einen alten Dateinamen hin.', fix: 'Liste das Verzeichnis auf und vergleiche die echten Dateinamen mit dem Muster. Korrigiere Verzeichnis oder Endung, lege die erwartete passende Datei an oder entferne das optionale Include, wenn es nicht mehr gebraucht wird.' },
      { title: 'Include sans résultat', summary: 'Un motif Include valide ne correspond actuellement à aucun fichier.', why: 'Cela peut être voulu, mais indique souvent un ancien chemin.', fix: 'Listez le répertoire et comparez les noms au motif. Corrigez le chemin ou l’extension, créez le fichier attendu ou supprimez cet Include s’il est obsolète.' },
      { title: 'Include sin coincidencias', summary: 'Un patrón Include válido no encuentra archivos.', why: 'Puede ser intencionado, pero suele indicar una ruta antigua.', fix: 'Lista el directorio y compara los nombres con el patrón. Corrige la ruta o extensión, crea el archivo esperado o elimina el Include si ya no se usa.' },
    ),
  },
  {
    slug: 'negated-only-host', code: 'NEGATED_HOST', severity: 'warning', browser: true,
    example: 'Host !internal !retired\n  User deploy',
    fixedExample: 'Host * !internal !retired\n  User deploy',
    highlights: [{ line: 1, target: 'Host !internal !retired' }],
    text: translations(
      { title: 'Host has only negated patterns', summary: 'A Host block contains exclusions but no positive pattern.', why: 'Negated patterns only remove candidates from an existing positive match. Without a positive pattern, this block can never apply.', fix: 'Add the positive set you intended. Use Host * !internal !retired to match every host except those exclusions, or name the allowed hosts explicitly. Remove the block if it is obsolete.' },
      { title: 'Host enthält nur negierte Muster', summary: 'Ein Host-Block enthält Ausschlüsse, aber kein positives Muster.', why: 'Negierte Muster entfernen nur Kandidaten aus einem positiven Treffer. Ohne positives Muster kann dieser Block niemals gelten.', fix: 'Füge die beabsichtigte positive Auswahl hinzu. Host * !internal !retired gilt für alle Hosts außer den Ausschlüssen. Alternativ nennst du die erlaubten Hosts ausdrücklich oder entfernst den veralteten Block.' },
      { title: 'Host contient uniquement des motifs négatifs', summary: 'Un bloc Host contient des exclusions, mais aucun motif positif.', why: 'Un motif négatif retire seulement des candidats d’une correspondance positive. Sans motif positif, ce bloc ne peut jamais s’appliquer.', fix: 'Ajoutez l’ensemble positif voulu. Host * !internal !retired vise tous les hôtes sauf les exclusions. Vous pouvez aussi nommer les hôtes autorisés ou supprimer le bloc obsolète.' },
      { title: 'Host contiene solo patrones negados', summary: 'Un bloque Host contiene exclusiones, pero ningún patrón positivo.', why: 'Los patrones negados solo eliminan candidatos de una coincidencia positiva. Sin un patrón positivo, el bloque nunca puede aplicarse.', fix: 'Añade el conjunto positivo que querías. Host * !internal !retired coincide con todos los hosts salvo las exclusiones. También puedes nombrar los hosts permitidos o eliminar el bloque obsoleto.' },
    ),
  },
  {
    slug: 'proxy-command-jump-conflict', code: 'PROXY_CONFLICT', severity: 'warning', browser: true,
    example: 'Host production\n  ProxyCommand ssh bastion -W %h:%p\n  ProxyJump jump.example.com',
    fixedExample: 'Host production\n  ProxyJump jump.example.com',
    highlights: [{ line: 2, target: 'ProxyCommand ssh bastion -W %h:%p' }, { line: 3, target: 'ProxyJump jump.example.com' }],
    text: translations(
      { title: 'ProxyCommand and ProxyJump conflict', summary: 'Both proxy mechanisms are configured in the same scope.', why: 'OpenSSH uses the first proxy option it obtains. The later directive looks active but has no effect.', fix: 'Choose one mechanism and remove the other. ProxyJump is usually easier to read. Keep ProxyCommand when you need custom transport behavior, then confirm the effective value with ssh -G production.' },
      { title: 'ProxyCommand und ProxyJump widersprechen sich', summary: 'Beide Proxy-Wege sind im selben Bereich konfiguriert.', why: 'OpenSSH nutzt die zuerst gefundene Proxy-Option. Die spätere Direktive sieht aktiv aus, bleibt aber wirkungslos.', fix: 'Entscheide dich für einen Weg und entferne den anderen. ProxyJump ist meist leichter lesbar. Behalte ProxyCommand für spezielles Transportverhalten und prüfe den wirksamen Wert mit ssh -G production.' },
      { title: 'Conflit entre ProxyCommand et ProxyJump', summary: 'Les deux méthodes proxy sont configurées dans la même portée.', why: 'OpenSSH utilise la première option proxy trouvée. La directive suivante semble active, mais reste sans effet.', fix: 'Choisissez une méthode et supprimez l’autre. ProxyJump est souvent plus lisible. Gardez ProxyCommand pour un transport personnalisé, puis vérifiez avec ssh -G production.' },
      { title: 'Conflicto entre ProxyCommand y ProxyJump', summary: 'Los dos métodos proxy están configurados en el mismo ámbito.', why: 'OpenSSH utiliza la primera opción proxy encontrada. La directiva posterior parece activa, pero no tiene efecto.', fix: 'Elige un método y elimina el otro. ProxyJump suele ser más legible. Conserva ProxyCommand para transportes personalizados y comprueba el resultado con ssh -G production.' },
    ),
  },
  {
    slug: 'revoked-host-keys-readable', code: 'REVOKED_HOST_KEYS_UNREADABLE', severity: 'error', browser: false,
    example: 'Host *\n  RevokedHostKeys ~/.ssh/revoked-old.krl',
    fixedExample: 'Host *\n  RevokedHostKeys ~/.ssh/revoked.krl',
    highlights: [{ line: 2, target: '~/.ssh/revoked-old.krl' }],
    text: translations(
      { title: 'RevokedHostKeys file is unreadable', summary: 'An explicit RevokedHostKeys file is missing, unreadable, or not a regular file.', why: 'OpenSSH refuses host authentication for every matching host when this file cannot be read. A stale path can therefore block all affected connections.', fix: 'Point RevokedHostKeys at an existing readable KRL or revoked-keys file. Use RevokedHostKeys none only when revocation checking is intentionally disabled. Run the CLI on the same account that will run SSH.' },
      { title: 'RevokedHostKeys-Datei ist nicht lesbar', summary: 'Eine explizite RevokedHostKeys-Datei fehlt, ist nicht lesbar oder keine reguläre Datei.', why: 'OpenSSH lehnt die Host-Authentifizierung für alle passenden Hosts ab, wenn diese Datei nicht gelesen werden kann. Ein alter Pfad kann damit alle betroffenen Verbindungen blockieren.', fix: 'Verweise auf eine vorhandene lesbare KRL- oder Sperrdatei. Nutze RevokedHostKeys none nur, wenn die Sperrprüfung bewusst deaktiviert werden soll. Führe die CLI mit demselben Benutzer wie SSH aus.' },
      { title: 'Fichier RevokedHostKeys illisible', summary: 'Un fichier RevokedHostKeys explicite manque, est illisible ou n’est pas un fichier normal.', why: 'OpenSSH refuse l’authentification de l’hôte pour chaque hôte concerné si ce fichier ne peut pas être lu.', fix: 'Indiquez un fichier KRL ou de clés révoquées existant et lisible. Utilisez RevokedHostKeys none uniquement pour désactiver volontairement ce contrôle. Exécutez la CLI avec le même compte que SSH.' },
      { title: 'Archivo RevokedHostKeys ilegible', summary: 'Un archivo RevokedHostKeys explícito falta, no se puede leer o no es un archivo normal.', why: 'OpenSSH rechaza la autenticación del host para todos los hosts afectados si no puede leer este archivo.', fix: 'Apunta a un archivo KRL o de claves revocadas existente y legible. Usa RevokedHostKeys none solo si quieres desactivar esta comprobación. Ejecuta la CLI con la misma cuenta que usará SSH.' },
    ),
  },
  {
    slug: 'certificate-file-exists', code: 'MISSING_CERTIFICATE', severity: 'error', browser: false,
    example: 'Host work\n  CertificateFile ~/.ssh/old-work-cert.pub',
    fixedExample: 'Host work\n  CertificateFile ~/.ssh/id_ed25519-cert.pub',
    highlights: [{ line: 2, target: '~/.ssh/old-work-cert.pub' }],
    text: translations(
      { title: 'CertificateFile not found', summary: 'An explicit SSH certificate path does not point to a readable regular file.', why: 'SSH cannot present a certificate that was moved, renamed, or deleted. Unlike IdentityFile, CertificateFile does not define none as a disabling sentinel.', fix: 'Point CertificateFile at the existing public certificate, commonly a file ending in -cert.pub, or remove the directive when no certificate is needed. Do not replace the path with none.' },
      { title: 'CertificateFile nicht gefunden', summary: 'Ein expliziter SSH-Zertifikatspfad verweist nicht auf eine lesbare reguläre Datei.', why: 'SSH kann ein verschobenes, umbenanntes oder gelöschtes Zertifikat nicht vorlegen. Anders als IdentityFile kennt CertificateFile none nicht als Abschaltwert.', fix: 'Verweise auf das vorhandene öffentliche Zertifikat, meist eine Datei mit der Endung -cert.pub, oder entferne die Direktive, wenn kein Zertifikat benötigt wird. Ersetze den Pfad nicht durch none.' },
      { title: 'CertificateFile introuvable', summary: 'Le chemin explicite du certificat SSH ne désigne pas un fichier normal lisible.', why: 'SSH ne peut pas présenter un certificat déplacé, renommé ou supprimé. Contrairement à IdentityFile, CertificateFile ne définit pas none comme valeur de désactivation.', fix: 'Indiquez le certificat public existant, souvent un fichier terminé par -cert.pub, ou supprimez la directive si aucun certificat n’est requis. Ne remplacez pas le chemin par none.' },
      { title: 'CertificateFile no encontrado', summary: 'La ruta explícita del certificado SSH no apunta a un archivo normal legible.', why: 'SSH no puede presentar un certificado movido, renombrado o eliminado. A diferencia de IdentityFile, CertificateFile no define none como valor para desactivarlo.', fix: 'Apunta al certificado público existente, normalmente un archivo terminado en -cert.pub, o elimina la directiva si no necesitas certificado. No sustituyas la ruta por none.' },
    ),
  },
  {
    slug: 'local-command-enabled', code: 'LOCAL_COMMAND_DISABLED', severity: 'warning', browser: true,
    example: 'Host production\n  LocalCommand logger connected-to-production',
    fixedExample: 'Host production\n  PermitLocalCommand yes\n  LocalCommand logger connected-to-production',
    highlights: [{ line: 2, target: 'LocalCommand logger connected-to-production' }],
    text: translations(
      { title: 'LocalCommand is not enabled', summary: 'A LocalCommand is configured while PermitLocalCommand is not enabled.', why: 'OpenSSH silently ignores LocalCommand unless execution is explicitly permitted. The expected local setup or notification never happens.', fix: 'Add PermitLocalCommand yes in an applicable scope only when you trust the command and configuration source. Otherwise remove LocalCommand. The linter stays conservative when an unresolved Include could enable it.' },
      { title: 'LocalCommand ist nicht aktiviert', summary: 'Ein LocalCommand ist konfiguriert, obwohl PermitLocalCommand nicht aktiviert ist.', why: 'OpenSSH ignoriert LocalCommand still, solange die Ausführung nicht ausdrücklich erlaubt ist. Die erwartete lokale Aktion findet nie statt.', fix: 'Füge PermitLocalCommand yes nur in einem passenden Bereich hinzu, wenn du Befehl und Konfigurationsquelle vertraust. Andernfalls entferne LocalCommand. Bei einem nicht aufgelösten Include warnt der Linter bewusst nicht.' },
      { title: 'LocalCommand n’est pas activé', summary: 'Un LocalCommand est configuré sans activation de PermitLocalCommand.', why: 'OpenSSH ignore silencieusement LocalCommand tant que son exécution n’est pas explicitement autorisée.', fix: 'Ajoutez PermitLocalCommand yes dans une portée applicable seulement si la commande et la source de configuration sont fiables. Sinon, supprimez LocalCommand. Le linter reste prudent face à un Include non résolu.' },
      { title: 'LocalCommand no está habilitado', summary: 'Hay un LocalCommand configurado sin activar PermitLocalCommand.', why: 'OpenSSH ignora LocalCommand silenciosamente si la ejecución no está permitida de forma explícita.', fix: 'Añade PermitLocalCommand yes en un ámbito aplicable solo si confías en el comando y la configuración. Si no, elimina LocalCommand. El linter es prudente cuando un Include sin resolver podría habilitarlo.' },
    ),
  },
  {
    slug: 'invalid-percent-token', code: 'INVALID_TOKEN', severity: 'error', browser: true,
    example: 'Host production\n  ProxyCommand ssh jump -W %C',
    fixedExample: 'Host production\n  ProxyCommand ssh jump -W %h:%p',
    highlights: [{ line: 2, target: '%C' }],
    text: translations(
      { title: 'Invalid percent token', summary: 'A directive uses a percent token that it does not support, or ends with an incomplete percent sign.', why: 'OpenSSH expands different token sets for different directives. A token valid in ControlPath can still make ProxyCommand invalid.', fix: 'Use only the tokens documented for that directive. ProxyCommand and ProxyJump accept %h, %n, %p, %r, and %%. Write %% when you need a literal percent sign.' },
      { title: 'Ungültiges Prozent-Token', summary: 'Eine Direktive nutzt ein dort nicht unterstütztes Prozent-Token oder endet mit einem unvollständigen Prozentzeichen.', why: 'OpenSSH erlaubt je nach Direktive unterschiedliche Tokens. Ein gültiges ControlPath-Token kann ProxyCommand trotzdem ungültig machen.', fix: 'Nutze nur die für diese Direktive dokumentierten Tokens. ProxyCommand und ProxyJump akzeptieren %h, %n, %p, %r und %%. Für ein wörtliches Prozentzeichen schreibst du %%.' },
      { title: 'Jeton de pourcentage invalide', summary: 'Une directive utilise un jeton non accepté ou se termine par un signe de pourcentage incomplet.', why: 'OpenSSH autorise des ensembles de jetons différents selon la directive. Un jeton valide dans ControlPath peut être invalide dans ProxyCommand.', fix: 'Utilisez uniquement les jetons documentés pour cette directive. ProxyCommand et ProxyJump acceptent %h, %n, %p, %r et %%. Écrivez %% pour un signe de pourcentage littéral.' },
      { title: 'Token de porcentaje no válido', summary: 'Una directiva utiliza un token no compatible o termina con un signo de porcentaje incompleto.', why: 'OpenSSH permite conjuntos de tokens diferentes según la directiva. Un token válido en ControlPath puede ser inválido en ProxyCommand.', fix: 'Usa solo los tokens documentados para esa directiva. ProxyCommand y ProxyJump aceptan %h, %n, %p, %r y %%. Escribe %% para un signo de porcentaje literal.' },
    ),
  },
];

export const ruleBySlug = (slug: string) => ruleDocs.find((rule) => rule.slug === slug);
export const ruleByCode = (code: string) => ruleDocs.find((rule) => rule.code === code);
