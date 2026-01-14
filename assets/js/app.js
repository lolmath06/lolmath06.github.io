/* Over Sight — app.js
   - thème (dark/light)
   - langue (FR/EN)
   - reveal on scroll
   - bouton "Retour en haut"
   - rendu des modes (page progress)
*/

const LANGS = ["fr", "en"];
const STORAGE_LANG = "oversight_lang";

const T = {
  fr: {
    badgeProject: "Projet",
    badgeProgress: "Avancement",
    navHome: "Accueil",
    navProblem: "Problématique",
    navSolution: "Solution",
    navHow: "Fonctionnement",
    navArch: "Architecture",
    navFeatures: "Caractéristiques",
    navRoadmap: "Évolutions",
    navBackPresentation: "Présentation",
    navDeliverables: "Livrables",
    navModes: "Modes",
    navDocs: "Docs",
    navTeam: "Équipe",
    theme: "Thème",
    ctaProgressTop: "Voir l’avancement",
    ctaDiscover: "Découvrir le projet",
    ctaProgress: "Accéder aux livrables",
    ctaDocs: "Lire la doc",

    kicker: "EIP — Dispositif de reconnaissance",
    heroTitle2: "Mini-drone de reco + vision 360°",
    heroSubtitle:
      "Un drone compact lancé dans une pièce, capable de se stabiliser, capturer une vue 360°, puis analyser la scène directement à bord (IA embarquée) et restituer les informations essentielles.",

    stat1k: "Capture",
    stat2k: "Analyse",
    stat2v: "IA locale",
    stat3k: "Objectif",
    stat3v: "Réduction du risque",

    calloutTitle: "Principe",
    calloutText: "“Voir avant d’entrer” : obtenir une situation claire de la pièce, en quelques secondes.",

    heroPreviewTitle: "Aperçu",
    heroPreviewCaption: "Illustration (remplace par une photo/3D si besoin).",
    heroMini1: "Déploiement rapide",
    heroMini1d: "Un lancé, stabilisation, capture — sans exposer l’humain.",
    heroMini2: "Décision assistée",
    heroMini2d: "IA + overlay (bbox/labels) pour interpréter vite.",

    problemTitle: "Problématique",
    problemSub: "Les interventions en milieu inconnu exposent les équipes à des risques immédiats.",
    problem1t: "Danger à l’entrée",
    problem1d: "Entrer sans visibilité : pièges, présence hostile, angles morts, obstacles.",
    problem1l1: "Angles morts",
    problem1l2: "Mauvaise appréciation des distances",
    problem1l3: "Réaction tardive",
    problem2t: "Temps critique",
    problem2d: "Même quelques secondes comptent : chaque hésitation augmente le risque.",
    problem2l1: "Informations incomplètes",
    problem2l2: "Communication difficile",
    problem2l3: "Décision sous stress",
    problem3t: "Outils limités",
    problem3d: "Caméras fixes ou drones “classiques” : pas toujours adaptés à l’intérieur.",
    problem3l1: "Stabilisation difficile",
    problem3l2: "Peu d’info structurée",
    problem3l3: "Intégration lourde",
    problemQuote: "Avoir une vue fiable de la pièce avant d’entrer peut éviter une décision irréversible.",
    problemQuoteMeta: "Constat projet — Over Sight",

    solutionTitle: "Notre solution",
    solutionSub: "Un mini-drone autonome qui embarque la capture + l’IA. Les résultats sont ensuite restitués à l’opérateur (modalités en cours de définition).",
    solutionPanelTitle: "Vue d’ensemble",
    solutionP1:
      "Le drone est projeté dans une pièce. Il se stabilise en vol et capture un panorama 360°. Le traitement IA s’exécute directement sur le drone, afin de réduire la latence et éviter une dépendance à une station externe.",
    solutionP2:
      "Le système produit un rendu exploitable : détections (bbox/labels), indicateurs (FPS), et éventuellement identification via dataset selon le mode choisi.",
    solutionB1: "Stabilisation",
    solutionB2: "Vision 360°",
    solutionB3: "Analyse IA",
    solutionB4: "Restitution",
    solutionDroneTitle: "Plateforme de capture",
    solutionDroneDesc: "Caméra 360°, stabilisation, mécanique robuste, autonomie courte mais suffisante.",
    solutionBoxBadge: "Restitution",
    solutionBoxTitle: "Rendu & preuves",
    solutionBoxDesc: "Overlay temps réel, modes de démo, outils dataset, logs et export.",
    solutionFig: "Schéma conceptuel (drone : capture + IA → restitution).",
    solutionSafetyTitle: "Bénéfice principal",
    solutionSafetyText:
      "Réduire l’exposition directe : reconnaissance d’une pièce sans engager une présence humaine immédiate.",

    howTitle: "Fonctionnement",
    howSub: "Du lancement à la décision : 4 étapes simples, reproductibles.",
    how1t: "Déploiement",
    how1d: "L’opérateur projette le drone dans la pièce. Objectif : mise en l’air + stabilisation rapide.",
    how2t: "Capture 360°",
    how2d: "Prise de vue panoramique (photo/flux). Le format 360° réduit les angles morts.",
    how3t: "Traitement IA",
    how3d: "Détection (YOLO), reconnaissance faciale, et éventuellement gestes/pose. Overlay lisible.",
    how4t: "Affichage & décision",
    how4d: "Les informations clés sont restituées à l’équipe (overlay + métriques). Décision avec plus de contexte.",
    howDiagramTitle: "Schéma simplifié",

    archTitle: "Architecture",
    archSub: "Matériel et logiciel s’articulent autour d’une chaîne courte : capturer, analyser embarqué, restituer.",
    archCard1b: "Drone",
    archCard1t: "Capture & stabilité",
    archCard1d: "Caméra 360° + stabilisation (IMU). Le drone doit tenir sa position pour un rendu exploitable.",
    archCard1m: "À intégrer : lidar pour distance/altitude.",
    archCard2b: "IA embarquée",
    archCard2t: "Traitement à bord",
    archCard2d: "Analyse IA directement sur le drone (YOLO/OpenCV). Compromis : puissance, chaleur et autonomie.",
    archCard2m: "Cible : Raspberry Pi (reçu) embarqué sur le drone. Lidar à venir.",
    archCard3b: "Restitution",
    archCard3t: "Rendu & export",
    archCard3d: "Snapshots, overlay et logs/export pour prouver les livrables. Modalités de restitution à préciser.",
    archCard3m: "Objectif : un retour clair, minimal, exploitable.",
    archDiagramTitle: "Diagramme d’architecture",

    featTitle: "Caractéristiques clés",
    featSub: "Ce qui rend Over Sight utile en intérieur : automatisation, lecture rapide, robustesse.",
    feat1b: "Auto",
    feat1t: "Déplacement autonome",
    feat1d: "Stabilité et trajectoire contrôlée pour une capture exploitable.",
    feat2b: "IA",
    feat2t: "Analyse en temps réel",
    feat2d: "Détection (personnes/objets/pose) + overlay clair pour décider vite.",
    feat3b: "Robuste",
    feat3t: "Résistance",
    feat3d: "Conçu pour encaisser : chocs, poussière, contraintes d’intérieur.",
    feat4b: "360°",
    feat4t: "Vision panoramique",
    feat4d: "Réduit les angles morts et facilite la compréhension de la scène.",
    feat5b: "UX",
    feat5t: "Affichage lisible",
    feat5d: "Informations utiles, pas de bruit : bbox, labels, compteur, FPS.",
    feat6b: "Modulaire",
    feat6t: "Évolutif",
    feat6d: "Modules indépendants : remplacer un bloc sans casser le reste.",

    roadTitle: "Évolutions futures",
    roadSub: "Prolonger l’utilité terrain : meilleure visibilité, meilleure communication, ergonomie.",
    road1t: "Flash lumineux ou caméra thermique",
    road1d: "Intégration d’un flash pour voir dans les environnements de nuit / sombre.",
    road2t: "Communication sans fil renforcée",
    road2d: "Amélioration de la portée et de la fiabilité de la transmission sans fil.",
    road3t: "Optimisation ergonomique",
    road3d: "Le rendre plus léger, plus facile à lancer.",
    roadCtaTitle: "Envie de voir ce qui est déjà fait ?",
    roadCtaSub: "La page “Avancement” regroupe les modes de démo, scripts et captures à rendre.",
    roadCtaBtn: "Ouvrir l’avancement",

    faqTitle: "Questions fréquentes",
    faqSub: "Pour cadrer le projet et éviter les confusions.",
    faq1q: "Pourquoi embarquer l’IA sur le drone ?",
    faq1a:
      "Pour réduire la latence et éviter de dépendre d’un boîtier externe. Le compromis : puissance, chaleur et autonomie — à optimiser.",
    faq2q: "Quels sont les traitements IA visés ?",
    faq2a:
      "Détection de personnes/objets (YOLO), reconnaissance faciale (si dataset), et modes complémentaires (pose/gestes) selon les besoins.",
    faq3q: "Le matériel est-il complet ?",
    faq3a: "Raspberry Pi reçu et configuré. Il manque encore le lidar pour compléter la partie capteurs.",

    footerTagline: "Reconnaissance d’intérieur — capture 360° + IA.",
    footerTop: "Retour en haut",
    footerProgress: "Avancement",
    footerNote: "",

    /* progress */
    progressKicker: "Ce qui a été produit / démontrable",
    progressTitle: "Livrables & Démos",
    progressSubtitle:
      "Cette page regroupe les livrables concrets : scripts, modes de démo via launcher, captures, et docs.",
    progressCtaModes: "Voir les modes",
    progressPanelTitle: "À mettre à jour",
    progressTodo1: "Remplacer les SVG par tes screenshots (1 par mode)",
    progressTodo2: "Vérifier les liens vers docs (chemin du repo)",
    progressTodo3: "Optionnel : ajouter une section “résultats”",

    deliverablesTitle: "Livrables",
    deliverablesSub: "Scripts + organisation + preuves visuelles (captures) pour rendre proprement.",
    delA: "Logiciel",
    delADesc2: "Scripts de vision (YOLO, face, pose, gestes) + orchestration via launcher.",
    delAmeta: "Point d’entrée unique + modes sélectionnables.",
    delB: "Démos",
    delBDesc2: "Chaque mode doit avoir une capture pour prouver la fonctionnalité.",
    delBmeta: "Dossier: website/assets/img/",
    delC: "Docs",
    delCDesc2: "Matériel, rapport logiciel, documentation technique (Markdown).",
    delCmeta: "Liens directs plus bas.",

    modesTitle: "Modes de démo (via le launcher)",
    modesSub2: "1 capture par mode, avec le nom de fichier indiqué ci‑dessous.",
    searchPh: "Rechercher un mode...",
    filterAll: "Tous",
    filterTools: "Outils",
    filterFace: "Face",
    filterYolo: "YOLO",
    filterHand: "Main",

    docsTitle: "Docs",
    docsSub: "Liens vers les Markdown du repo.",
    doc1: "Inventaire & choix matériel.",
    doc2: "Rapport logiciel (POC, pipeline, limites).",
    doc3: "Documentation technique détaillée.",

    teamTitle: "Équipe",
    teamSub: "Liens GitHub",
    footerBackToPresentation: "Retour présentation",
  },

  en: {
    badgeProject: "Project",
    badgeProgress: "Progress",
    navHome: "Home",
    navProblem: "Problem",
    navSolution: "Solution",
    navHow: "How it works",
    navArch: "Architecture",
    navFeatures: "Key features",
    navRoadmap: "Roadmap",
    navBackPresentation: "Presentation",
    navDeliverables: "Deliverables",
    navModes: "Modes",
    navDocs: "Docs",
    navTeam: "Team",
    theme: "Theme",
    ctaProgressTop: "View progress",
    ctaDiscover: "Discover the project",
    ctaProgress: "Open deliverables",
    ctaDocs: "Read docs",

    kicker: "EIP — Recon device",
    heroTitle2: "Recon mini-drone + 360° vision",
    heroSubtitle:
      "A compact drone thrown into a room, able to stabilize, capture a 360° view, then analyze the scene onboard (embedded AI) and deliver the essential information.",

    stat1k: "Capture",
    stat2k: "Analysis",
    stat2v: "Local AI",
    stat3k: "Goal",
    stat3v: "Risk reduction",

    calloutTitle: "Idea",
    calloutText: "“See before entering”: get a clear room situation in seconds.",

    heroPreviewTitle: "Preview",
    heroPreviewCaption: "Illustration (replace with a photo/3D if needed).",
    heroMini1: "Fast deployment",
    heroMini1d: "Throw, stabilize, capture — without exposing a human.",
    heroMini2: "Assisted decision",
    heroMini2d: "AI + overlay (bboxes/labels) for quick reading.",

    problemTitle: "Problem",
    problemSub: "Unknown environments create immediate risks for teams.",
    problem1t: "Entry danger",
    problem1d: "Entering blind: traps, hostile presence, blind spots, obstacles.",
    problem1l1: "Blind spots",
    problem1l2: "Poor distance perception",
    problem1l3: "Late reaction",
    problem2t: "Critical time",
    problem2d: "Seconds matter: every hesitation increases risk.",
    problem2l1: "Incomplete information",
    problem2l2: "Hard communication",
    problem2l3: "Decision under stress",
    problem3t: "Limited tools",
    problem3d: "Fixed cameras or classic drones are not always indoor‑friendly.",
    problem3l1: "Hard stabilization",
    problem3l2: "Low structured info",
    problem3l3: "Heavy integration",
    problemQuote: "Having a reliable room view before entering can prevent irreversible decisions.",
    problemQuoteMeta: "Project note — Over Sight",

    solutionTitle: "Our solution",
    solutionSub: "An autonomous mini-drone embedding capture + AI. Results are then delivered to the operator (delivery method still being defined).",
    solutionPanelTitle: "Overview",
    solutionP1:
      "The drone is thrown into a room. It stabilizes and captures a 360° panorama. AI processing runs directly on the drone to reduce latency and avoid relying on an external box.",
    solutionP2:
      "The system produces an actionable output: detections (bbox/labels), metrics (FPS), and optionally identification via a face dataset depending on the selected mode.",
    solutionB1: "Stabilization",
    solutionB2: "360° vision",
    solutionB3: "AI analysis",
    solutionB4: "Output",
    solutionDroneTitle: "Capture platform",
    solutionDroneDesc: "360 camera, stabilization, robust mechanics, short but sufficient autonomy.",
    solutionBoxBadge: "Output",
    solutionBoxTitle: "Output & evidence",
    solutionBoxDesc: "Real-time overlay, demo modes, dataset tools, logs and export.",
    solutionFig: "Concept diagram (drone: capture + AI → output).",
    solutionSafetyTitle: "Main benefit",
    solutionSafetyText:
      "Reduce direct exposure: recon a room without immediate human presence.",

    howTitle: "How it works",
    howSub: "From launch to decision: 4 simple repeatable steps.",
    how1t: "Deployment",
    how1d: "The operator throws the drone. Goal: quick take-off and stabilization.",
    how2t: "360° capture",
    how2d: "Panoramic photo/stream. 360° reduces blind spots.",
    how3t: "AI processing",
    how3d: "Detection (YOLO), face recognition, and possibly gestures/pose. Clear overlay.",
    how4t: "Display & decision",
    how4d: "Key information is delivered to the team (overlay + metrics). The team decides with more context.",
    howDiagramTitle: "Simplified diagram",

    archTitle: "Architecture",
    archSub: "Hardware and software follow a short chain: capture, onboard analysis, deliver.",
    archCard1b: "Drone",
    archCard1t: "Capture & stability",
    archCard1d: "360 camera + IMU stabilization. The drone must hold position for usable visuals.",
    archCard1m: "To add: lidar for distance/altitude.",
    archCard2b: "Onboard AI",
    archCard2t: "Onboard processing",
    archCard2d: "AI runs directly on the drone (YOLO/OpenCV). Trade-offs: compute, heat and autonomy.",
    archCard2m: "Target: Raspberry Pi (received) onboard the drone. Lidar to come.",
    archCard3b: "Output",
    archCard3t: "Render & export",
    archCard3d: "Snapshots, overlay and logs/export to validate deliverables. Output interface to be specified.",
    archCard3m: "Goal: clear, minimal, actionable feedback.",
    archDiagramTitle: "Architecture diagram",

    featTitle: "Key features",
    featSub: "What makes Over Sight useful indoors: automation, quick reading, robustness.",
    feat1b: "Auto",
    feat1t: "Autonomous movement",
    feat1d: "Stable, controlled trajectory for usable capture.",
    feat2b: "AI",
    feat2t: "Real-time analysis",
    feat2d: "Detection (people/objects/pose) + clear overlay for fast decisions.",
    feat3b: "Rugged",
    feat3t: "Resistance",
    feat3d: "Built to withstand shocks, dust, indoor constraints.",
    feat4b: "360°",
    feat4t: "Panoramic vision",
    feat4d: "Reduces blind spots and helps understand the scene.",
    feat5b: "UX",
    feat5t: "Readable display",
    feat5d: "Useful info, low noise: bboxes, labels, counters, FPS.",
    feat6b: "Modular",
    feat6t: "Evolutive",
    feat6d: "Independent modules: swap a block without breaking the rest.",

    roadTitle: "Roadmap",
    roadSub: "Extend field usefulness: better visibility, communication, ergonomics.",
    road1t: "Flash / thermal camera",
    road1d: "Add a flash (or a thermal camera) to operate in dark environments.",
    road2t: "Stronger wireless link",
    road2d: "Improve range and reliability of the wireless transmission.",
    road3t: "Ergonomics",
    road3d: "Make it lighter and easier to throw.",
    roadCtaTitle: "Want to see what’s already done?",
    roadCtaSub: "The “Progress” page lists demo modes, scripts and screenshots to deliver.",
    roadCtaBtn: "Open progress",

    faqTitle: "FAQ",
    faqSub: "To frame the project and avoid confusion.",
    faq1q: "Why run AI on the drone?",
    faq1a:
      "To reduce latency and avoid relying on an external box. The trade-off: compute, heat and battery life — to optimize.",
    faq2q: "Which AI processing is targeted?",
    faq2a:
      "People/object detection (YOLO), face recognition (with dataset), and optional modes (pose/gestures) depending on needs.",
    faq3q: "Is hardware complete?",
    faq3a: "Raspberry Pi received and configured. Lidar is still missing to complete sensors.",

    footerTagline: "Indoor reconnaissance — 360° capture + AI.",
    footerTop: "Back to top",
    footerProgress: "Progress",
    footerNote: "",

    /* progress */
    progressKicker: "What is produced / demonstrable",
    progressTitle: "Deliverables & Demos",
    progressSubtitle:
      "This page gathers concrete deliverables: scripts, launcher demo modes, screenshots, and docs.",
    progressCtaModes: "See modes",
    progressPanelTitle: "To update",
    progressTodo1: "Replace SVGs with your screenshots (1 per mode)",
    progressTodo2: "Check doc links (repo path)",
    progressTodo3: "Optional: add a “results” section",

    deliverablesTitle: "Deliverables",
    deliverablesSub: "Scripts + structure + visual proof (screenshots) to deliver cleanly.",
    delA: "Software",
    delADesc2: "Vision scripts (YOLO, face, pose, gestures) + orchestration via launcher.",
    delAmeta: "Single entry point + selectable modes.",
    delB: "Demos",
    delBDesc2: "Each mode should have a screenshot to prove it works.",
    delBmeta: "Folder: website/assets/img/",
    delC: "Docs",
    delCDesc2: "Hardware, software report, technical documentation (Markdown).",
    delCmeta: "Direct links below.",

    modesTitle: "Demo modes (via launcher)",
    modesSub2: "1 screenshot per mode, with the file name shown below.",
    searchPh: "Search a mode...",
    filterAll: "All",
    filterTools: "Tools",
    filterFace: "Face",
    filterYolo: "YOLO",
    filterHand: "Hand",

    docsTitle: "Docs",
    docsSub: "Links to repo Markdown files.",
    doc1: "Inventory & hardware choices.",
    doc2: "Software report (POC, pipeline, limits).",
    doc3: "Detailed technical documentation.",

    teamTitle: "Team",
    teamSub: "GitHub links",
    footerBackToPresentation: "Back to presentation",
  },
};

const MODES = [
  {
    title: { fr: "Launcher GUI (point d’entrée unique)", en: "Launcher GUI (single entry point)" },
    tags: ["tools"],
    meta: ["launcher_gui.py", "menu"],
    desc: {
      fr: "Menu central : lancer un mode, revenir en arrière et enchaîner les tests.",
      en: "Central menu: run a mode, go back, and chain tests.",
    },
    img: "screenshot_01_launcher.png",
    category: "tools",
  },
  {
    title: { fr: "Outil dataset visages", en: "Face dataset tool" },
    tags: ["tools", "face"],
    meta: ["tools/capture_faces.py", "dataset"],
    desc: {
      fr: "Saisie d’un nom → crée img/nom/ → captures numérotées.",
      en: "Enter a name → creates img/name/ → numbered captures.",
    },
    img: "screenshot_02_dataset.png",
    category: "tools",
  },
  {
    title: { fr: "Reco faciale (vidéo)", en: "Face recognition (video)" },
    tags: ["face"],
    meta: ["face_recognition/video_recognition.py", "realtime"],
    desc: {
      fr: "Reconnaissance en temps réel (bbox + nom), compatible dataset multi-personnes.",
      en: "Real-time recognition (bbox + name), supports multi-person dataset.",
    },
    img: "screenshot_03_face_reco.png",
    category: "face",
  },
  {
    title: { fr: "YOLO — détection objets/personnes", en: "YOLO — object/person detection" },
    tags: ["yolo"],
    meta: ["shape_detection/simple_shape_detection.py", "yolov8n"],
    desc: {
      fr: "Détection en live et overlay (bbox + labels).",
      en: "Live detection with overlay (bboxes + labels).",
    },
    img: "screenshot_04_yolo_objects.png",
    category: "yolo",
  },
  {
    title: { fr: "YOLO Pose — squelette", en: "YOLO Pose — skeleton" },
    tags: ["yolo"],
    meta: ["shape_detection/complex_shape_detection.py", "yolov8n-pose"],
    desc: {
      fr: "Affichage des points clés et connexions (pose estimation).",
      en: "Keypoints and connections (pose estimation).",
    },
    img: "screenshot_05_yolo_pose.png",
    category: "yolo",
  },
  {
    title: { fr: "Gestes de main", en: "Hand gestures" },
    tags: ["hand"],
    meta: ["hand_recognition/app.py", "mediapipe / tflite"],
    desc: {
      fr: "Détection main + classification de gestes en temps réel.",
      en: "Hand detection + real-time gesture classification.",
    },
    img: "screenshot_06_hand_gestures.png",
    category: "hand",
  },
];

const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

function getLang() {
  const saved = localStorage.getItem(STORAGE_LANG);
  if (saved && LANGS.includes(saved)) return saved;
  return "fr";
}

function setLang(lang) {
  localStorage.setItem(STORAGE_LANG, lang);
  document.documentElement.lang = lang;
  const label = qs("#langLabel");
  if (label) label.textContent = lang.toUpperCase();
  applyI18n(lang);
  if (qs("#modesGrid")) renderModesFiltered();
}

function applyI18n(lang) {
  const dict = T[lang] || T.fr;

  qsa("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  qsa("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });
}

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem("oversight_theme", t);
}

function initTheme() {
  const saved = localStorage.getItem("oversight_theme");
  if (saved === "light" || saved === "dark") return setTheme(saved);
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
}

function initReveal() {
  const els = qsa(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
    { threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
}

function initToTop() {
  const btn = qs("#toTop");
  if (!btn) return;

  const update = () => {
    if (window.scrollY > 500) btn.classList.add("is-visible");
    else btn.classList.remove("is-visible");
  };

  window.addEventListener("scroll", update, { passive: true });
  update();

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initThemeToggle() {
  const toggle = qs("#themeToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || "dark";
    setTheme(cur === "dark" ? "light" : "dark");
  });
}

function initLangToggle() {
  const toggle = qs("#langToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const cur = getLang();
    const next = cur === "fr" ? "en" : "fr";
    setLang(next);
  });
}

/* Modes rendering (progress page) */
function makeCover(cover, modeTitle) {
  const placeholder = document.createElement("div");
  placeholder.className = "mode__placeholder";
  placeholder.innerHTML = `
    <div class="mode__phIcon" aria-hidden="true">▣</div>
    <div class="mode__phText">${modeTitle}</div>
  `;

  const img = document.createElement("img");
  img.alt = `Screenshot — ${modeTitle}`;
  img.loading = "lazy";

  img.onerror = () => {
    img.remove();
    cover.appendChild(placeholder);
  };

  cover.appendChild(img);
  return img;
}

function renderModes(list) {
  const grid = qs("#modesGrid");
  if (!grid) return;

  const lang = getLang();
  grid.innerHTML = "";

  list.forEach((m) => {
    const titleText = (m.title && (m.title[lang] || m.title.fr)) || "Mode";
    const descText = (m.desc && (m.desc[lang] || m.desc.fr)) || "";

    const el = document.createElement("article");
    el.className = "mode reveal";

    const cover = document.createElement("div");
    cover.className = "mode__cover";

    const img = makeCover(cover, titleText);
    img.src = `./assets/img/${m.img}`;

    const body = document.createElement("div");
    body.className = "mode__body";

    const head = document.createElement("div");
    head.className = "mode__head";

    const title = document.createElement("div");
    title.className = "mode__title";
    title.textContent = titleText;

    const tags = document.createElement("div");
    tags.className = "mode__tags";
    (m.tags || []).forEach((t) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = t;
      tags.appendChild(tag);
    });

    head.appendChild(title);
    head.appendChild(tags);

    const desc = document.createElement("p");
    desc.className = "mode__desc";
    desc.textContent = descText;

    const meta = document.createElement("div");
    meta.className = "mode__meta";
    (m.meta || []).forEach((x) => {
      const s = document.createElement("span");
      s.textContent = x;
      meta.appendChild(s);
    });

    body.appendChild(head);
    body.appendChild(desc);
    body.appendChild(meta);

    el.appendChild(cover);
    el.appendChild(body);
    grid.appendChild(el);
  });

  initReveal();
}

let CURRENT_FILTER = "all";
let CURRENT_QUERY = "";

function renderModesFiltered() {
  const q = (CURRENT_QUERY || "").trim().toLowerCase();
  let out = [...MODES];

  if (CURRENT_FILTER !== "all") {
    out = out.filter((m) => m.category === CURRENT_FILTER || (m.tags && m.tags.includes(CURRENT_FILTER)));
  }

  if (q) {
    out = out.filter((m) => {
      const lang = getLang();
      const t = (m.title && (m.title[lang] || m.title.fr)) || "";
      const d = (m.desc && (m.desc[lang] || m.desc.fr)) || "";
      const hay = `${t} ${d} ${(m.meta || []).join(" ")} ${(m.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }

  renderModes(out);
}

function initFilters() {
  const grid = qs("#modesGrid");
  if (!grid) return;

  const search = qs("#modeSearch");
  const btns = qsa(".chipbtn");

  if (search) {
    search.addEventListener("input", (e) => {
      CURRENT_QUERY = e.target.value || "";
      renderModesFiltered();
    });
  }

  btns.forEach((b) =>
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
      CURRENT_FILTER = b.dataset.filter;
      renderModesFiltered();
    })
  );

  renderModesFiltered();
}

/* Smooth anchor scroll (both pages) */
function initSmoothAnchors() {
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
}

(function boot() {
  initTheme();
  initThemeToggle();
  initLangToggle();
  setLang(getLang());
  initReveal();
  initToTop();
  initSmoothAnchors();
  initFilters();
})();
