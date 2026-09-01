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
    example: 'Host production\n  Port 70000\n  ServerAliveInterval -1\n  StreamLocalBindMask 0788\n  IPQoS af21 bogus',
    fixedExample: 'Host production\n  Port 22\n  ServerAliveInterval 15\n  StreamLocalBindMask 0177\n  IPQoS af21 cs1',
    highlights: [{ line: 2, target: '70000' }, { line: 3, target: '-1' }, { line: 4, target: '0788' }, { line: 5, target: 'bogus' }],
    text: translations(
      { title: 'Invalid directive value', summary: 'A directive contains a number, duration, mask, or DSCP value that is outside OpenSSH’s accepted syntax.', why: 'Invalid ports and counters stop SSH from loading the config. A malformed octal mask can be worse: OpenSSH may accept only its valid prefix, so the effective permissions differ from what the line appears to say.', fix: 'Use Port 1 through 65535 and non-negative counters. ConnectTimeout and ServerAliveInterval accept seconds, durations such as 1m30s, or none. StreamLocalBindMask must be a complete octal value between 0000 and 0777. IPQoS accepts one or two documented DSCP names, numbers from 0 through 255, or none. Verify the result with ssh -G production.' },
      { title: 'Ungültiger Direktivenwert', summary: 'Eine Direktive enthält eine Zahl, Dauer, Maske oder einen DSCP-Wert außerhalb der von OpenSSH akzeptierten Syntax.', why: 'Ungültige Ports und Zähler verhindern das Laden der SSH-Konfiguration. Bei einer fehlerhaften Oktalmaske kann OpenSSH nur den gültigen Anfang auswerten. Die wirksamen Rechte unterscheiden sich dann unbemerkt von der sichtbaren Zeile.', fix: 'Nutze für Port 1 bis 65535 und für Zähler nicht negative ganze Zahlen. ConnectTimeout und ServerAliveInterval akzeptieren Sekunden, Dauern wie 1m30s oder none. StreamLocalBindMask muss ein vollständiger Oktalwert zwischen 0000 und 0777 sein. IPQoS akzeptiert ein oder zwei dokumentierte DSCP-Namen, Zahlen von 0 bis 255 oder none. Prüfe das Ergebnis mit ssh -G production.' },
      { title: 'Valeur de directive invalide', summary: 'Une directive contient un nombre, une durée, un masque ou une valeur DSCP hors de la syntaxe acceptée par OpenSSH.', why: 'Des ports et compteurs invalides empêchent le chargement de la configuration. Avec un masque octal incorrect, OpenSSH peut ne lire que le préfixe valide et appliquer des permissions différentes de celles attendues.', fix: 'Utilisez un Port de 1 à 65535 et des compteurs non négatifs. ConnectTimeout et ServerAliveInterval acceptent des secondes, des durées comme 1m30s ou none. StreamLocalBindMask doit être une valeur octale complète de 0000 à 0777. IPQoS accepte un ou deux noms DSCP, des nombres de 0 à 255 ou none. Vérifiez avec ssh -G production.' },
      { title: 'Valor de directiva no válido', summary: 'Una directiva contiene un número, duración, máscara o valor DSCP fuera de la sintaxis aceptada por OpenSSH.', why: 'Los puertos y contadores no válidos impiden cargar la configuración. Con una máscara octal incorrecta, OpenSSH puede leer solo el prefijo válido y aplicar permisos distintos de los esperados.', fix: 'Usa un Port entre 1 y 65535 y contadores no negativos. ConnectTimeout y ServerAliveInterval aceptan segundos, duraciones como 1m30s o none. StreamLocalBindMask debe ser un valor octal completo entre 0000 y 0777. IPQoS acepta uno o dos nombres DSCP, números de 0 a 255 o none. Comprueba el resultado con ssh -G production.' },
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
];

export const ruleBySlug = (slug: string) => ruleDocs.find((rule) => rule.slug === slug);
export const ruleByCode = (code: string) => ruleDocs.find((rule) => rule.code === code);
