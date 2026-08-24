import type { Locale } from './i18n';

type Lesson = {
  title: string;
  text: string;
  example: string;
  takeaway: string;
};

export type LearningQuizQuestion = {
  line: number;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type LearningQuizCopy = {
  progress: string;
  correctLabel: string;
  wrongLabel: string;
  completeTitle: string;
  completeText: string;
  reset: string;
  questionLabel: string;
  questions: LearningQuizQuestion[];
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
  quiz: LearningQuizCopy;
  brokenLabel: string;
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
    title: 'Learn SSH config in 20 minutes.',
    description: 'A short, practical introduction to Host blocks, OpenSSH matching, and safer defaults. Read three lessons, find five real mistakes, then check the result in the browser.',
    duration: '20 minutes',
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
    exerciseTitle: 'Find five problems in this config',
    exerciseIntro: 'Answer each question. The related config line is highlighted while you work, and the corrected version unlocks after all five answers are right. Progress is kept only in this browser.',
    quiz: {
      progress: 'Solved {correct} of {total}',
      correctLabel: 'Correct',
      wrongLabel: 'Try again',
      completeTitle: 'Config understood',
      completeText: 'You found all five issues. Compare your reasoning with the corrected version below.',
      reset: 'Reset exercise',
      questionLabel: 'Question {number}',
      questions: [
        {
          line: 1,
          prompt: 'Which User value reaches school-server?',
          options: ['User student', 'User deploy', 'Both values are combined'],
          correct: 1,
          explanation: 'Host * matches first. For User, OpenSSH keeps the first value it obtains, so the later User student does not replace it.',
        },
        {
          line: 2,
          prompt: 'Which setting weakens connection security?',
          options: ['HostName 203.0.113.42', 'StrictHostKeyChecking no', 'IdentityFile ~/.ssh/id_ed25519'],
          correct: 1,
          explanation: 'StrictHostKeyChecking no accepts changed host keys and removes an important defense against man-in-the-middle attacks.',
        },
        {
          line: 5,
          prompt: 'Why can this ControlPath collide?',
          options: ['It omits the port and user', 'The directory is hidden', 'ControlMaster is disabled'],
          correct: 0,
          explanation: 'A path containing only %h cannot distinguish connections using another user or port. %C safely hashes all relevant values.',
        },
        {
          line: 10,
          prompt: 'Which algorithm should be removed?',
          options: ['aes256-gcm@openssh.com', '3des-cbc', 'Both algorithms'],
          correct: 1,
          explanation: '3des-cbc is obsolete. Prefer OpenSSH defaults, or keep only the modern cipher when an explicit list is required.',
        },
        {
          line: 12,
          prompt: 'What structural problem makes the config harder to reason about?',
          options: ['The Port directive is missing', 'The alias is too long', 'Host school-server is duplicated'],
          correct: 2,
          explanation: 'The same Host pattern appears twice. Combining both blocks makes the effective settings visible in one place.',
        },
      ],
    },
    brokenLabel: 'Configuration to inspect',
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
    title: 'SSH Config in 20 Minuten verstehen.',
    description: 'Eine kurze, praktische Einführung in Host-Blöcke, die Auswertung durch OpenSSH und sichere Vorgaben. Lies drei Lektionen, finde fünf echte Fehler und prüfe das Ergebnis im Browser.',
    duration: '20 Minuten',
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
    exerciseTitle: 'Finde fünf Probleme in dieser Config',
    exerciseIntro: 'Beantworte jede Frage. Währenddessen wird die passende Config-Zeile hervorgehoben. Nach fünf richtigen Antworten erscheint die Korrektur. Dein Fortschritt bleibt nur in diesem Browser.',
    quiz: {
      progress: '{correct} von {total} gelöst',
      correctLabel: 'Richtig',
      wrongLabel: 'Noch nicht',
      completeTitle: 'Config verstanden',
      completeText: 'Du hast alle fünf Probleme gefunden. Vergleiche deine Begründung jetzt mit der korrigierten Version.',
      reset: 'Aufgabe zurücksetzen',
      questionLabel: 'Frage {number}',
      questions: [
        {
          line: 1,
          prompt: 'Welcher User-Wert gilt für school-server?',
          options: ['User student', 'User deploy', 'Beide Werte werden kombiniert'],
          correct: 1,
          explanation: 'Host * trifft zuerst zu. Für User behält OpenSSH den ersten gefundenen Wert. Das spätere User student ersetzt ihn deshalb nicht.',
        },
        {
          line: 2,
          prompt: 'Welche Einstellung schwächt die Verbindungssicherheit?',
          options: ['HostName 203.0.113.42', 'StrictHostKeyChecking no', 'IdentityFile ~/.ssh/id_ed25519'],
          correct: 1,
          explanation: 'StrictHostKeyChecking no akzeptiert geänderte Host-Schlüssel und entfernt damit einen wichtigen Schutz vor Man-in-the-Middle-Angriffen.',
        },
        {
          line: 5,
          prompt: 'Warum kann dieser ControlPath kollidieren?',
          options: ['Port und Benutzer fehlen', 'Das Verzeichnis ist versteckt', 'ControlMaster ist deaktiviert'],
          correct: 0,
          explanation: 'Ein Pfad nur mit %h unterscheidet keine Verbindungen mit anderem Benutzer oder Port. %C bildet alle relevanten Werte sicher ab.',
        },
        {
          line: 10,
          prompt: 'Welcher Algorithmus sollte entfernt werden?',
          options: ['aes256-gcm@openssh.com', '3des-cbc', 'Beide Algorithmen'],
          correct: 1,
          explanation: '3des-cbc ist veraltet. Nutze möglichst die OpenSSH-Standards oder behalte nur den modernen Cipher in einer wirklich nötigen Liste.',
        },
        {
          line: 12,
          prompt: 'Welches strukturelle Problem macht die Config schwer verständlich?',
          options: ['Die Port-Direktive fehlt', 'Der Alias ist zu lang', 'Host school-server ist doppelt'],
          correct: 2,
          explanation: 'Dasselbe Host-Muster steht zweimal in der Datei. Ein gemeinsamer Block macht alle wirksamen Einstellungen an einer Stelle sichtbar.',
        },
      ],
    },
    brokenLabel: 'Konfiguration zum Prüfen',
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
    title: 'Comprendre la configuration SSH en 20 minutes.',
    description: 'Une introduction pratique aux blocs Host, aux règles OpenSSH et aux réglages sûrs. Lisez trois leçons, trouvez cinq erreurs réelles, puis vérifiez le résultat.',
    duration: '20 minutes',
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
    exerciseTitle: 'Trouvez cinq problèmes dans cette configuration',
    exerciseIntro: 'Répondez à chaque question. La ligne concernée est mise en évidence et la correction apparaît après cinq bonnes réponses. La progression reste dans ce navigateur.',
    quiz: {
      progress: '{correct} sur {total} résolus',
      correctLabel: 'Correct',
      wrongLabel: 'Réessayez',
      completeTitle: 'Configuration comprise',
      completeText: 'Vous avez trouvé les cinq problèmes. Comparez maintenant votre raisonnement avec la version corrigée.',
      reset: 'Recommencer l’exercice',
      questionLabel: 'Question {number}',
      questions: [
        {
          line: 1,
          prompt: 'Quelle valeur User reçoit school-server ?',
          options: ['User student', 'User deploy', 'Les deux valeurs sont combinées'],
          correct: 1,
          explanation: 'Host * correspond en premier. Pour User, OpenSSH conserve la première valeur obtenue. La valeur User student située plus bas ne la remplace pas.',
        },
        {
          line: 2,
          prompt: 'Quel réglage affaiblit la sécurité de la connexion ?',
          options: ['HostName 203.0.113.42', 'StrictHostKeyChecking no', 'IdentityFile ~/.ssh/id_ed25519'],
          correct: 1,
          explanation: 'StrictHostKeyChecking no accepte les clés modifiées et supprime une protection importante contre les attaques de type homme du milieu.',
        },
        {
          line: 5,
          prompt: 'Pourquoi ce ControlPath peut-il entrer en collision ?',
          options: ['Le port et l’utilisateur manquent', 'Le dossier est caché', 'ControlMaster est désactivé'],
          correct: 0,
          explanation: 'Un chemin qui contient uniquement %h ne distingue pas les connexions avec un autre port ou utilisateur. %C résume les valeurs utiles.',
        },
        {
          line: 10,
          prompt: 'Quel algorithme faut-il supprimer ?',
          options: ['aes256-gcm@openssh.com', '3des-cbc', 'Les deux algorithmes'],
          correct: 1,
          explanation: '3des-cbc est obsolète. Préférez les valeurs OpenSSH par défaut ou conservez uniquement le chiffrement moderne.',
        },
        {
          line: 12,
          prompt: 'Quel problème de structure complique la configuration ?',
          options: ['La directive Port manque', 'L’alias est trop long', 'Host school-server est dupliqué'],
          correct: 2,
          explanation: 'Le même motif Host apparaît deux fois. Un seul bloc rend tous les réglages effectifs visibles au même endroit.',
        },
      ],
    },
    brokenLabel: 'Configuration à examiner',
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
    title: 'Aprende SSH config en 20 minutos.',
    description: 'Una introducción práctica a los bloques Host, las coincidencias de OpenSSH y los ajustes seguros. Lee tres lecciones, encuentra cinco errores reales y comprueba el resultado.',
    duration: '20 minutos',
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
    exerciseTitle: 'Encuentra cinco problemas en esta configuración',
    exerciseIntro: 'Responde a cada pregunta. La línea relacionada se resalta y la corrección aparece tras cinco respuestas correctas. El progreso queda solo en este navegador.',
    quiz: {
      progress: '{correct} de {total} resueltos',
      correctLabel: 'Correcto',
      wrongLabel: 'Inténtalo de nuevo',
      completeTitle: 'Configuración comprendida',
      completeText: 'Has encontrado los cinco problemas. Compara ahora tu razonamiento con la versión corregida.',
      reset: 'Reiniciar ejercicio',
      questionLabel: 'Pregunta {number}',
      questions: [
        {
          line: 1,
          prompt: '¿Qué valor de User recibe school-server?',
          options: ['User student', 'User deploy', 'Se combinan ambos valores'],
          correct: 1,
          explanation: 'Host * coincide primero. Para User, OpenSSH conserva el primer valor obtenido, así que el User student posterior no lo sustituye.',
        },
        {
          line: 2,
          prompt: '¿Qué ajuste debilita la seguridad de la conexión?',
          options: ['HostName 203.0.113.42', 'StrictHostKeyChecking no', 'IdentityFile ~/.ssh/id_ed25519'],
          correct: 1,
          explanation: 'StrictHostKeyChecking no acepta claves modificadas y elimina una defensa importante contra ataques de intermediario.',
        },
        {
          line: 5,
          prompt: '¿Por qué puede colisionar este ControlPath?',
          options: ['Faltan el puerto y el usuario', 'El directorio está oculto', 'ControlMaster está desactivado'],
          correct: 0,
          explanation: 'Una ruta que solo contiene %h no distingue conexiones con otro usuario o puerto. %C resume todos los valores relevantes.',
        },
        {
          line: 10,
          prompt: '¿Qué algoritmo debe eliminarse?',
          options: ['aes256-gcm@openssh.com', '3des-cbc', 'Ambos algoritmos'],
          correct: 1,
          explanation: '3des-cbc está obsoleto. Usa los valores predeterminados de OpenSSH o conserva únicamente el cifrado moderno.',
        },
        {
          line: 12,
          prompt: '¿Qué problema estructural dificulta entender la configuración?',
          options: ['Falta la directiva Port', 'El alias es demasiado largo', 'Host school-server está duplicado'],
          correct: 2,
          explanation: 'El mismo patrón Host aparece dos veces. Un único bloque permite ver todos los ajustes efectivos en un solo lugar.',
        },
      ],
    },
    brokenLabel: 'Configuración para revisar',
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

export const brokenExercise = 'Host *\n  StrictHostKeyChecking no\n  User deploy\n  ControlMaster auto\n  ControlPath ~/.ssh/control-%h\n\nHost school-server\n  HostName 203.0.113.42\n  User student\n  Ciphers aes256-gcm@openssh.com,3des-cbc\n\nHost school-server\n  IdentityFile ~/.ssh/id_ed25519';

export const fixedExercise = 'Host school-server\n  HostName 203.0.113.42\n  User student\n  IdentityFile ~/.ssh/id_ed25519\n  StrictHostKeyChecking accept-new\n  Ciphers aes256-gcm@openssh.com\n\nHost *\n  ServerAliveInterval 60\n  ControlMaster auto\n  ControlPath ~/.ssh/control-%C';

export const exerciseHighlights = [
  { line: 1, target: 'Host *' },
  { line: 2, target: 'StrictHostKeyChecking no' },
  { line: 5, target: '~/.ssh/control-%h' },
  { line: 10, target: '3des-cbc' },
  { line: 12, target: 'Host school-server' },
];
