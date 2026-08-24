import type { Locale } from './i18n';

type Lesson = {
  title: string;
  text: string;
  example: string;
  takeaway: string;
};

export type LearningCopy = {
  eyebrow: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  format: string;
  lessonsTitle: string;
  lessons: Lesson[];
  takeawayLabel: string;
  exerciseEyebrow: string;
  exerciseTitle: string;
  exerciseIntro: string;
  tasks: string[];
  brokenLabel: string;
  solutionLabel: string;
  solutionTitle: string;
  solutionText: string;
  fixedLabel: string;
  teacherTitle: string;
  teacherText: string;
  teacherSteps: string[];
  checkerCta: string;
  rulesCta: string;
  languageLabel: string;
};

export const learningCopy: Record<Locale, LearningCopy> = {
  en: {
    eyebrow: 'SSH CONFIG BASICS',
    title: 'Learn SSH config in 15 minutes.',
    description: 'A short, practical introduction to Host blocks, OpenSSH matching, and safer defaults. Read the three lessons, solve the exercise, then check the result in the browser.',
    duration: '15 minutes',
    level: 'Beginner',
    format: '3 lessons and 1 exercise',
    lessonsTitle: 'Three ideas that prevent most config mistakes',
    takeawayLabel: 'Remember',
    lessons: [
      {
        title: 'Give connections useful names',
        text: 'A Host block creates an alias. HostName is the real server, while User and IdentityFile provide connection-specific settings. You can then run ssh school-server instead of remembering every option.',
        example: 'Host school-server\n  HostName 203.0.113.42\n  User student\n  IdentityFile ~/.ssh/id_ed25519',
        takeaway: 'Host is the name you type. HostName is the server SSH connects to.',
      },
      {
        title: 'Specific hosts belong before Host *',
        text: 'For many options, OpenSSH keeps the first value it obtains. A broad Host * block near the top can therefore win before a later specific block is evaluated.',
        example: 'Host school-server\n  User student\n\nHost *\n  User deploy',
        takeaway: 'Put specific Host blocks first and shared defaults at the end.',
      },
      {
        title: 'Prefer safe, narrow settings',
        text: 'Do not disable host key checks globally. Keep forwarding off by default and enable it only for a trusted host that actually needs it. OpenSSH defaults are usually a better starting point than copied legacy settings.',
        example: 'Host legacy-lab\n  StrictHostKeyChecking accept-new\n  ForwardAgent no',
        takeaway: 'Scope exceptions to one host instead of weakening every connection.',
      },
    ],
    exerciseEyebrow: 'CLASSROOM EXERCISE',
    exerciseTitle: 'Find three problems in this config',
    exerciseIntro: 'Read the configuration as OpenSSH does, from top to bottom. The highlighted lines contain the clues.',
    tasks: ['Which value for User reaches school-server?', 'Which setting weakens connection security?', 'Which Host block is defined twice?'],
    brokenLabel: 'Configuration to inspect',
    solutionLabel: 'Show solution',
    solutionTitle: 'A simpler and safer version',
    solutionText: 'The specific host is now defined once and comes first. Host verification remains active, while shared defaults stay at the bottom.',
    fixedLabel: 'Corrected configuration',
    teacherTitle: 'Using this in a lesson',
    teacherText: 'The exercise works as a short individual task or a pair discussion. No account, installation, or uploaded file is required.',
    teacherSteps: ['Give learners 5 minutes to explain each problem.', 'Compare answers in pairs and propose a corrected config.', 'Paste the correction into the checker and discuss every remaining finding.'],
    checkerCta: 'Try the browser checker',
    rulesCta: 'Open all rule guides',
    languageLabel: 'Learning page language',
  },
  de: {
    eyebrow: 'SSH-CONFIG-GRUNDLAGEN',
    title: 'SSH Config in 15 Minuten verstehen.',
    description: 'Eine kurze, praktische Einführung in Host-Blöcke, die Auswertung durch OpenSSH und sichere Vorgaben. Lies die drei Lektionen, löse die Aufgabe und prüfe das Ergebnis direkt im Browser.',
    duration: '15 Minuten',
    level: 'Einsteiger',
    format: '3 Lektionen und 1 Aufgabe',
    lessonsTitle: 'Drei Ideen, die die meisten Config-Fehler verhindern',
    takeawayLabel: 'Merke',
    lessons: [
      {
        title: 'Gib Verbindungen sinnvolle Namen',
        text: 'Ein Host-Block legt einen Kurznamen an. HostName ist der echte Server. User und IdentityFile enthalten Einstellungen für diese Verbindung. Danach genügt ssh school-server, statt jede Option einzeln einzugeben.',
        example: 'Host school-server\n  HostName 203.0.113.42\n  User student\n  IdentityFile ~/.ssh/id_ed25519',
        takeaway: 'Host ist der Name, den du eingibst. HostName ist der Server, zu dem SSH verbindet.',
      },
      {
        title: 'Konkrete Hosts gehören vor Host *',
        text: 'Für viele Optionen behält OpenSSH den ersten gefundenen Wert. Ein allgemeiner Host-*-Block am Anfang kann deshalb gewinnen, bevor ein späterer konkreter Block ausgewertet wird.',
        example: 'Host school-server\n  User student\n\nHost *\n  User deploy',
        takeaway: 'Konkrete Host-Blöcke zuerst, gemeinsame Vorgaben ans Ende.',
      },
      {
        title: 'Nutze sichere und enge Einstellungen',
        text: 'Deaktiviere die Prüfung von Host-Schlüsseln nicht global. Lasse Forwarding standardmäßig aus und aktiviere es nur für einen vertrauenswürdigen Host, der es wirklich braucht. Die OpenSSH-Standards sind meist besser als kopierte Alt-Konfigurationen.',
        example: 'Host legacy-lab\n  StrictHostKeyChecking accept-new\n  ForwardAgent no',
        takeaway: 'Begrenze Ausnahmen auf einen Host, statt jede Verbindung zu schwächen.',
      },
    ],
    exerciseEyebrow: 'UNTERRICHTSAUFGABE',
    exerciseTitle: 'Finde drei Probleme in dieser Config',
    exerciseIntro: 'Lies die Konfiguration wie OpenSSH von oben nach unten. Die markierten Zeilen enthalten die Hinweise.',
    tasks: ['Welcher User-Wert gilt für school-server?', 'Welche Einstellung schwächt die Verbindungssicherheit?', 'Welcher Host-Block ist doppelt vorhanden?'],
    brokenLabel: 'Konfiguration zum Prüfen',
    solutionLabel: 'Lösung anzeigen',
    solutionTitle: 'Eine einfachere und sicherere Version',
    solutionText: 'Der konkrete Host steht jetzt genau einmal am Anfang. Die Host-Prüfung bleibt aktiv und gemeinsame Vorgaben stehen unten.',
    fixedLabel: 'Korrigierte Konfiguration',
    teacherTitle: 'Einsatz im Unterricht',
    teacherText: 'Die Aufgabe eignet sich als kurze Einzelarbeit oder für eine Diskussion zu zweit. Es sind kein Konto, keine Installation und kein Datei-Upload erforderlich.',
    teacherSteps: ['Lernende erklären jedes Problem zunächst 5 Minuten allein.', 'Antworten zu zweit vergleichen und eine korrigierte Config entwerfen.', 'Die Korrektur in den Checker einfügen und verbleibende Funde besprechen.'],
    checkerCta: 'Im Browser prüfen',
    rulesCta: 'Alle Regelbeschreibungen öffnen',
    languageLabel: 'Sprache der Lernseite',
  },
  fr: {
    eyebrow: 'BASES DE LA CONFIGURATION SSH',
    title: 'Comprendre la configuration SSH en 15 minutes.',
    description: 'Une introduction courte et pratique aux blocs Host, aux règles de correspondance OpenSSH et aux réglages sûrs. Lisez les trois leçons, faites l’exercice, puis vérifiez le résultat dans le navigateur.',
    duration: '15 minutes',
    level: 'Débutant',
    format: '3 leçons et 1 exercice',
    lessonsTitle: 'Trois idées qui évitent la plupart des erreurs',
    takeawayLabel: 'À retenir',
    lessons: [
      {
        title: 'Donnez un nom utile aux connexions',
        text: 'Un bloc Host crée un alias. HostName indique le vrai serveur, tandis que User et IdentityFile décrivent cette connexion. Vous pouvez ensuite saisir ssh school-server sans mémoriser chaque option.',
        example: 'Host school-server\n  HostName 203.0.113.42\n  User student\n  IdentityFile ~/.ssh/id_ed25519',
        takeaway: 'Host est le nom saisi. HostName est le serveur contacté par SSH.',
      },
      {
        title: 'Placez les hôtes précis avant Host *',
        text: 'Pour de nombreuses options, OpenSSH conserve la première valeur obtenue. Un bloc général Host * placé en haut peut donc gagner avant un bloc précis situé plus bas.',
        example: 'Host school-server\n  User student\n\nHost *\n  User deploy',
        takeaway: 'Les blocs précis viennent en premier et les valeurs communes à la fin.',
      },
      {
        title: 'Préférez des réglages sûrs et ciblés',
        text: 'Ne désactivez pas globalement la vérification des clés. Gardez les redirections désactivées par défaut et ne les activez que pour un hôte fiable qui en a besoin. Les réglages OpenSSH par défaut sont souvent le meilleur point de départ.',
        example: 'Host legacy-lab\n  StrictHostKeyChecking accept-new\n  ForwardAgent no',
        takeaway: 'Limitez une exception à un hôte au lieu d’affaiblir toutes les connexions.',
      },
    ],
    exerciseEyebrow: 'EXERCICE EN CLASSE',
    exerciseTitle: 'Trouvez trois problèmes dans cette configuration',
    exerciseIntro: 'Lisez la configuration comme OpenSSH, de haut en bas. Les lignes marquées donnent les indices.',
    tasks: ['Quelle valeur User reçoit school-server ?', 'Quel réglage affaiblit la sécurité ?', 'Quel bloc Host est défini deux fois ?'],
    brokenLabel: 'Configuration à examiner',
    solutionLabel: 'Afficher la solution',
    solutionTitle: 'Une version plus simple et plus sûre',
    solutionText: 'L’hôte précis est maintenant défini une seule fois et apparaît en premier. La vérification reste active et les valeurs communes sont placées à la fin.',
    fixedLabel: 'Configuration corrigée',
    teacherTitle: 'Utilisation en cours',
    teacherText: 'Cet exercice convient à un travail individuel court ou à une discussion en binôme. Aucun compte, aucune installation et aucun fichier envoyé ne sont nécessaires.',
    teacherSteps: ['Accordez 5 minutes pour expliquer chaque problème.', 'Comparez les réponses en binôme et proposez une correction.', 'Collez la correction dans le vérificateur et discutez chaque résultat restant.'],
    checkerCta: 'Essayer le vérificateur',
    rulesCta: 'Voir tous les guides de règles',
    languageLabel: 'Langue de la page pédagogique',
  },
  es: {
    eyebrow: 'FUNDAMENTOS DE SSH CONFIG',
    title: 'Aprende SSH config en 15 minutos.',
    description: 'Una introducción breve y práctica a los bloques Host, las coincidencias de OpenSSH y los ajustes seguros. Lee las tres lecciones, resuelve el ejercicio y comprueba el resultado en el navegador.',
    duration: '15 minutos',
    level: 'Principiante',
    format: '3 lecciones y 1 ejercicio',
    lessonsTitle: 'Tres ideas que evitan la mayoría de errores',
    takeawayLabel: 'Recuerda',
    lessons: [
      {
        title: 'Pon nombres útiles a las conexiones',
        text: 'Un bloque Host crea un alias. HostName es el servidor real, mientras que User e IdentityFile describen esa conexión. Después puedes ejecutar ssh school-server sin recordar cada opción.',
        example: 'Host school-server\n  HostName 203.0.113.42\n  User student\n  IdentityFile ~/.ssh/id_ed25519',
        takeaway: 'Host es el nombre que escribes. HostName es el servidor al que se conecta SSH.',
      },
      {
        title: 'Pon los hosts concretos antes de Host *',
        text: 'Para muchas opciones, OpenSSH conserva el primer valor obtenido. Un bloque general Host * al principio puede imponerse antes de evaluar un bloque concreto posterior.',
        example: 'Host school-server\n  User student\n\nHost *\n  User deploy',
        takeaway: 'Primero los bloques Host concretos y al final los valores compartidos.',
      },
      {
        title: 'Prefiere ajustes seguros y específicos',
        text: 'No desactives globalmente la comprobación de claves. Mantén el reenvío desactivado y actívalo solo para un host de confianza que lo necesite. Los valores predeterminados de OpenSSH suelen ser mejores que una configuración antigua copiada.',
        example: 'Host legacy-lab\n  StrictHostKeyChecking accept-new\n  ForwardAgent no',
        takeaway: 'Limita cada excepción a un host en vez de debilitar todas las conexiones.',
      },
    ],
    exerciseEyebrow: 'EJERCICIO PARA CLASE',
    exerciseTitle: 'Encuentra tres problemas en esta configuración',
    exerciseIntro: 'Lee la configuración como OpenSSH, de arriba abajo. Las líneas marcadas contienen las pistas.',
    tasks: ['¿Qué valor de User recibe school-server?', '¿Qué ajuste debilita la seguridad?', '¿Qué bloque Host está definido dos veces?'],
    brokenLabel: 'Configuración para revisar',
    solutionLabel: 'Mostrar solución',
    solutionTitle: 'Una versión más simple y segura',
    solutionText: 'El host concreto aparece una sola vez y está al principio. La verificación sigue activa y los valores compartidos quedan al final.',
    fixedLabel: 'Configuración corregida',
    teacherTitle: 'Cómo usarlo en clase',
    teacherText: 'El ejercicio sirve como tarea individual breve o para comentar en parejas. No requiere cuenta, instalación ni subir archivos.',
    teacherSteps: ['Da 5 minutos para explicar cada problema.', 'Comparad las respuestas en parejas y proponed una corrección.', 'Pegad la corrección en el verificador y comentad los resultados restantes.'],
    checkerCta: 'Probar el verificador',
    rulesCta: 'Abrir todas las guías',
    languageLabel: 'Idioma de la página educativa',
  },
};

export const brokenExercise = 'Host *\n  StrictHostKeyChecking no\n  User deploy\n\nHost school-server\n  HostName 203.0.113.42\n  User student\n\nHost school-server\n  IdentityFile ~/.ssh/id_ed25519';

export const fixedExercise = 'Host school-server\n  HostName 203.0.113.42\n  User student\n  IdentityFile ~/.ssh/id_ed25519\n  StrictHostKeyChecking accept-new\n\nHost *\n  ServerAliveInterval 60';

export const exerciseHighlights = [
  { line: 1, target: 'Host *' },
  { line: 2, target: 'StrictHostKeyChecking no' },
  { line: 9, target: 'Host school-server' },
];
