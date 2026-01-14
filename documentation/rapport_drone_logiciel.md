
---

# Rapport – Fonctionnement du mini-drone et partie logicielle (vision)

## 1. Contexte général du projet

L’objectif de notre EIP est de concevoir un **mini-drone de reconnaissance** que l’on peut jeter dans une pièce (chambre, bureau, couloir, etc.). Une fois lancé, le drone doit :

1. **Se stabiliser en vol** malgré un lancement peu contrôlé.
2. **Observer la pièce** grâce à une caméra (idéalement 360° ou grand angle).
3. **Analyser ce qu’il voit** :
   - détecter la présence de personnes,
   - reconnaître éventuellement des personnes connues (pour les tests),
   - analyser grossièrement la posture (debout, assis, au sol).
4. **Transmettre un retour à l’opérateur** (image annotée, alerte sonore, etc.).

À ce stade du projet, le **matériel du mini-drone n’est pas encore disponible**. Nous avons donc concentré le travail sur :

- la compréhension du **fonctionnement d’un drone** (physique, capteurs, stabilisation),
- la mise en place de **prototypes logiciels de vision** à partir d’une simple webcam,
- la **structuration du code** et le début de la documentation.

L’idée est que, lorsque le drone physique arrivera, la partie “vision” soit déjà prête ou presque, et qu’il reste “juste” l’intégration avec la caméra embarquée.

---

## 2. Rappels sur le fonctionnement d’un drone quadricoptère

### 2.1. Architecture physique d’un mini-drone

Un mini-drone de type quadricoptère est généralement composé de :

- **Châssis**
  - Structure en croix (en X ou en +) qui supporte tous les composants.
  - Compromis entre **légèreté** (autonomie) et **rigidité** (stabilité).

- **Moteurs brushless + hélices**
  - 4 moteurs, 4 hélices :
    - 2 tournent dans le sens horaire,
    - 2 dans le sens antihoraire.
  - En jouant sur la vitesse de chaque moteur, on contrôle :
    - l’inclinaison gauche/droite (**roll**),
    - l’inclinaison avant/arrière (**pitch**),
    - la rotation autour de l’axe vertical (**yaw**),
    - la poussée globale (monter / descendre).

- **ESC (Electronic Speed Controllers)**
  - Petits modules qui reçoivent une consigne du contrôleur de vol
    (“moteur 1 à 60 %”, etc.) et ajustent réellement la puissance envoyée
    aux moteurs.

- **Batterie (souvent LiPo)**
  - Fournit un courant important sur une courte durée.
  - Sensible aux chocs, aux surcharges et aux décharges profondes.

- **Contrôleur de vol**
  - “Cerveau bas niveau” du drone.
  - Lit les capteurs (IMU, baromètre, etc.).
  - Exécute les algorithmes de stabilisation.
  - Met à jour en boucle les consignes envoyées aux ESC.

### 2.2. Capteurs principaux

Pour voler de façon stable, le drone doit connaître son **orientation** et, si possible, sa **position**. Les capteurs typiques sont :

- **IMU (Inertial Measurement Unit)**
  - Accéléromètre 3 axes : mesure les accélérations.
  - Gyroscope 3 axes : mesure les vitesses de rotation.
  - Parfois magnétomètre (boussole).
  - Permet d’estimer les angles **roll / pitch / yaw**.

- **Baromètre**
  - Mesure la pression atmosphérique.
  - Permet d’estimer une **altitude relative** (utile pour garder une hauteur constante).

- **GNSS (GPS & co.)**
  - Très utile en extérieur.
  - En intérieur, c’est généralement inexploitable (signal trop faible).

- **Caméra**
  - Capteur central pour notre projet.
  - Peut être frontale, vers le bas ou de type 360°.
  - Sert à :
    - observer la scène,
    - détecter des personnes / objets,
    - éventuellement aider à la navigation (optical flow, SLAM, etc.).

- **Autres capteurs possibles**
  - LiDAR, capteurs ultrason, capteurs ToF, systèmes UWB pour la localisation indoor, etc.
  - Intéressant en perspective, mais pas indispensables pour une première version.

### 2.3. Axes de contrôle et vol stationnaire

On manipule classiquement quatre commandes :

- **Roll** : inclinaison gauche ↔ droite.
- **Pitch** : inclinaison avant ↔ arrière.
- **Yaw** : rotation sur l’axe vertical.
- **Throttle / gaz** : puissance globale des moteurs (donc altitude).

Pour un **vol stationnaire** :

- roll ≈ 0°,
- pitch ≈ 0°,
- yaw stable,
- poussée = poids (en gros).

En réalité, on accepte une petite marge, car les mesures sont bruitées et l’environnement (courants d’air, turbulences, etc.) n’est jamais parfait.

### 2.4. Stabilisation avec des contrôleurs PID

Pour garder le drone stable, on utilise des boucles de rétroaction de type **PID** sur chaque axe (roll, pitch, yaw, altitude).

Exemple sur le pitch :

1. On mesure l’angle de pitch actuel via l’IMU.
2. On fixe une consigne (par exemple 0°).
3. On calcule l’erreur = consigne – valeur mesurée.
4. Le PID transforme cette erreur en correction moteur :
   - partie P : réagit à l’erreur instantanée,
   - partie I : corrige les petits biais accumulés,
   - partie D : anticipe la tendance (stabilise).

Ce calcul est répété en continu (plusieurs centaines de fois par seconde).  
En cas de perturbation, le contrôleur ajuste la puissance des moteurs pour revenir vers la consigne.

On retrouve ce principe :

- pour le **roll**,
- pour le **pitch**,
- pour le **yaw**,
- pour la **hauteur** (en utilisant l’altitude mesurée).

### 2.5. Spécificités du vol indoor (sans GPS)

En intérieur :

- pas de GPS,
- espace plus restreint (murs, plafond),
- luminosité variable.

Le drone doit donc se débrouiller avec :

- l’IMU (orientation, accélérations),
- des capteurs de distance éventuels,
- et surtout la **vision** : la caméra devient un capteur clé (détection de mouvement, repères visuels, etc.).

Dans notre projet, on ne code pas toute la navigation indoor, mais on prépare la brique logicielle qui exploite l’image pour **détecter des personnes, reconnaître des visages et analyser la scène**.

---

## 3. Architecture cible de notre système

### 3.1. Séparation drone embarqué / boîtier opérateur

On sépare le système en deux blocs :

1. **Mini-drone (embarqué)**
   - IMU, baromètre, caméra.
   - Contrôleur de vol (stabilisation).
   - Module de communication (envoi des images ou d’un flux vidéo).

2. **Boîtier / PC de l’opérateur**
   - Réception des images / du flux.
   - Traitement de vision (YOLO, reconnaissance faciale, gestes, etc.).
   - Interface utilisateur (affichage, sons, synthèse de la situation).

Schéma logique :

```text
[ Mini-drone ]
  - Stabilisation (PID + capteurs)
  - Caméra (360° ou grand angle)
  - Transmission des images
            |
            v
[ Boîtier / PC opérateur ]
  - Réception du flux
  - Vision (détection de personnes, visages, gestes)
  - Alerte / interface (image annotée, son, texte)
```

### 3.2. Scénario d’utilisation

1. L’opérateur se trouve devant une pièce inconnue.
2. Il active le mini-drone et le jette dans la pièce.
3. Le drone se stabilise (contrôleur de vol + capteurs).
4. Une fois à peu près stable, il capture :
   - soit une **photo globale**,
   - soit un **flux vidéo** court.
5. Le boîtier / PC reçoit ces images et lance les algos de vision :
   - détection de personnes,
   - reconnaissance de visages,
   - éventuellement détection de gestes / postures.
6. Le système produit un retour (image annotée, texte, alarme sonore).
7. L’opérateur prend une décision (intervention, repli, etc.).

---

## 4. Organisation actuelle du dépôt et structuration du code

### 4.1. Arborescence simplifiée

À la racine, on trouve le dossier `EIP_proto/` avec notamment : fileciteturn1file0L1-L40

- `camera/`
  - `camera.py` : tests de capture vidéo.
- `Code/`
  - `combined_recognition/`
    - `combined_recognition.py` : détection d’objets (YOLO) + mains (MediaPipe).
  - `face_recognition/`
    - `image_recognition.py` : comparaison de deux images.
    - `simple_facerec.py` : classe de reconnaissance de visages.
    - `video_recognition.py` : reconnaissance de visages en temps réel.
  - `face_tracking/`
    - `haarcascade_frontalface_default.xml` : modèle Haar pour les visages.
    - `tracking.py` : détection simple de visages.
  - `hand_recognition/`
    - `app.py` : détection et classification de gestes de la main.
    - `model/` : modèles TFLite + labels.
    - `utils/` : calcul du FPS.
  - `shape_and_face/`
    - `shape_and_face.py` : détection de personnes + visages + alarme sonore.
    - `shape_and_face_logitech_webcam.py` : version avec une autre caméra.
    - `complex_shape_and_face.py` : pose + visages.
    - `simple_facerec.py` : version locale pour ce module.
  - `shape_detection/`
    - `simple_shape_detection.py` : YOLO détection d’objets.
    - `complex_shape_detection.py` : YOLO pose (squelette).
- `img/`
  - images des membres de l’équipe pour la base de visages.
- `utils/`
  - `beep.mp3` : son d’alerte.
- `main.py`
  - point d’entrée générique (pour l’instant très minimal).

Cette organisation sépare les **expérimentations par thème** : caméra, visage, pose, gestes, fusion des infos, etc.

### 4.2. Structuration prévue (qualité du code)

Pour améliorer la qualité et montrer une vraie démarche de structuration, on prévoit :

- un fichier `requirements.txt` à la racine, avec les principales dépendances :
  - `opencv-python`
  - `ultralytics`
  - `face_recognition`
  - `mediapipe`
  - `numpy`
  - `pygame`
  - `cvzone`
  - éventuellement `tensorflow` (pour les modèles TFLite de main).
- un formatage automatique avec **Black** :
  - `black EIP_proto`
- un linter (par exemple **Ruff**) :
  - `ruff check EIP_proto`
- une base de **CI** (GitHub Actions ou autre) :
  - installation des dépendances,
  - exécution de Black en mode check,
  - exécution du linter,
  - lancement de quelques scripts de test “à sec” (import, etc.).

Cette partie peut être enrichie au fur et à mesure, mais l’idée est déjà posée.

---

## 5. Prototypes logiciels réalisés / en cours

### 5.1. Capture vidéo – `camera/camera.py`

Deux prototypes :

1. **Prototype avec Matplotlib (`firstPrototypeWithPLT`)**
   - Utilise OpenCV pour récupérer une frame.
   - Affiche l’image avec Matplotlib (`plt.imshow`).
   - Permet de tester rapidement la connexion à la caméra.
   - Inconvénient : rafraîchissement lent (≈ 1 fps), donc pas adapté au temps réel.

2. **Prototype avec OpenCV (`secondPrototypeWithCV2`)**
   - Boucle de capture avec `cap.read()`.
   - Affichage direct avec `cv2.imshow('frame', frame)`.
   - Utilisation de `cv2.waitKey(1)` pour gérer les touches.
   - Fluide et proche de ce qui sera utilisé avec la caméra du drone.

Ce module sert de **base commune** : la majeure partie des scripts de vision reprennent la même structure de boucle vidéo.

---

### 5.2. Reconnaissance de visages – `Code/face_recognition/`

#### 5.2.1. Comparaison de deux images – `image_recognition.py`

- Charge deux images (ex.: `quentin.jpg` et `big_quentin.JPG`).
- Calcule l’**encodage** de chaque visage avec la librairie `face_recognition`.
- Compare les encodages et indique si ce sont probablement la même personne.
- Affiche les deux images avec OpenCV pour vérifier visuellement.

Ce script valide le principe : **un visage peut être représenté par un vecteur d’encodage** et comparé à d’autres.

#### 5.2.2. Classe réutilisable `SimpleFacerec` – `simple_facerec.py`

La classe `SimpleFacerec` :

- parcourt un dossier d’images (`../img/`),
- calcule un encodage pour chaque visage détecté,
- associe chaque encodage à un nom (nom du fichier),
- expose la méthode `detect_known_faces(frame)` qui :
  - détecte les visages dans la frame,
  - compare chaque visage aux encodages connus,
  - renvoie les positions des visages et les noms correspondants (ou “Unknown”).

Cette classe est réutilisée dans d’autres modules (par ex. `video_recognition.py`, `shape_and_face.py`, etc.).

#### 5.2.3. Reconnaissance en temps réel – `video_recognition.py`

- Initialise `SimpleFacerec` avec le dossier `../img/`.
- Ouvre la webcam.
- À chaque frame :
  - appelle `detect_known_faces`,
  - dessine un rectangle et affiche le nom de la personne reconnue.

Résultat : on obtient un **prototypage complet de reconnaissance de visage en direct** avec une simple webcam.

---

### 5.3. Détection de visages simple – `Code/face_tracking/tracking.py`

- Utilise un modèle **Haar cascade** (`haarcascade_frontalface_default.xml`).
- Ouvre la webcam, convertit chaque frame en niveaux de gris.
- Applique `detectMultiScale` pour détecter les visages.
- Dessine des rectangles sur les visages détectés.

Même si cette méthode est moins moderne que `face_recognition`, elle est :

- très simple à mettre en place,
- légère,
- suffisante pour des tests rapides de détection de visage.

---

### 5.4. Détection d’objets et de pose – `Code/shape_detection/`

#### 5.4.1. YOLO détection “classique” – `simple_shape_detection.py`

- Charge un modèle YOLO (par ex. `yolov8n.pt`).
- Capture le flux de la webcam.
- Passe chaque frame dans le modèle.
- Récupère et affiche les objets détectés (classes, scores, boîtes).
- Affiche la frame annotée avec `results[0].plot()`.

Ce prototype valide l’intégration de YOLO dans le projet et montre ce que le drone pourra “voir” en termes d’objets.

#### 5.4.2. YOLO pose (squelette) – `complex_shape_detection.py`

- Utilise un modèle YOLO de **pose humaine** (par ex. `yolov8n-pose.pt`).
- Pour chaque personne détectée :
  - récupère les **keypoints** (tête, épaules, coudes, genoux, etc.),
  - dessine ces points sur une image noire,
  - relie certains points pour former un squelette.

- Affiche côte à côte :
  - la frame annotée originale,
  - la représentation du squelette.

Ce prototype ouvre la voie à une **analyse de posture** (debout, assis, couché, etc.).

---

### 5.5. Fusion détection de personnes + visages + alarme – `Code/shape_and_face/`

#### 5.5.1. Script principal – `shape_and_face.py`

Fonctionnement :

- Charge un modèle YOLO (détection d’objets, dont la classe “person”).
- Initialise `SimpleFacerec` pour la reconnaissance de visages.
- Initialise le système audio (`pygame.mixer`) et charge un son (`../utils/beep.mp3`).
- Ouvre la webcam.
- Dans la boucle :
  - redimensionne la frame,
  - applique YOLO pour détecter des personnes,
  - si une personne apparaît dans la frame alors qu’il n’y en avait pas juste avant :
    - joue une fois le son d’alerte,
  - applique la reconnaissance de visages pour annoter les personnes connues.

On obtient une **brique logicielle proche du cas d’usage final** :

- “Quelqu’un vient d’entrer dans le champ” → alerte.
- Si c’est quelqu’un de connu (dans notre petit dataset) → nom affiché.

#### 5.5.2. Variante multi-caméra – `shape_and_face_logitech_webcam.py`

Même logique que `shape_and_face.py`, mais :

- utilise un autre index de caméra (par ex. `cap = cv2.VideoCapture(2)`),
- permet de tester une webcam USB externe (Logitech).

#### 5.5.3. Visages + pose – `complex_shape_and_face.py`

- Combine la reconnaissance faciale (`SimpleFacerec`) avec la détection de pose (YOLO pose).
- Affiche :
  - les visages reconnus sur la frame originale,
  - un squelette bâti à partir des keypoints sur une image auxiliaire,
  - le tout est affiché côte à côte (via `cvzone.stackImages`).

Ce script est un bon prototype pour une **vision “riche”** de la scène : qui est là + où sont les articulations.

---

### 5.6. Détection d’objets + reconnaissance de mains – `Code/combined_recognition/combined_recognition.py`

Ce script va un cran plus loin dans la fusion d’informations :

- Utilise YOLO (`yolov8n.pt`) pour détecter plusieurs types d’objets :
  - `person`, `door`, `window`, `chair`, `couch`, `bed`, `dining table`, `tv`,
  - `laptop`, `mouse`, `keyboard`, `cell phone`, `book`, `clock`, `bottle`, `cup`, etc.
- Utilise **MediaPipe Hands** pour détecter et suivre les mains de l’utilisateur.
- Maintient un objet `CvFpsCalc` pour calculer un FPS moyen sur un historique.

Pour chaque frame :

1. **Détection YOLO**
   - Application du modèle YOLO sur l’image.
   - Filtrage des objets qui nous intéressent (liste `objects_to_detect`).
   - Dessin de rectangles colorés en fonction du type d’objet :
     - `person` en vert,
     - `door` en rouge,
     - `window` en bleu,
     - autres en jaune.
   - Comptage des objets détectés par catégorie, affiché en bas de l’image.

2. **Reconnaissance de mains (MediaPipe)**
   - Conversion de l’image en RGB.
   - Détection des landmarks de mains via MediaPipe Hands.
   - Dessin des landmarks et des connexions sur l’image.
   - Affichage de la latéralité (main gauche / main droite).

3. **Affichage du FPS**
   - Utilisation de la classe `CvFpsCalc` pour calculer un FPS lissé,
   - affichage du FPS dans le coin de l’image.

Ce module montre comment **combiner plusieurs briques de vision en temps réel** sur une seule image (objets + mains + FPS + comptage).

---

### 5.7. Détection et classification de gestes de la main – `Code/hand_recognition/`

Cette partie est inspirée d’exemples MediaPipe + TFLite, mais adaptée à notre projet.

#### 5.7.1. `app.py` – pipeline de reconnaissance de gestes

- Parse quelques arguments (device, width, height, etc.).
- Ouvre la caméra avec la résolution souhaitée.
- Initialise MediaPipe Hands :
  - `max_num_hands = 1`,
  - `min_detection_confidence` et `min_tracking_confidence` configurables.
- Charge deux classifieurs TFLite :
  - `KeyPointClassifier` : classifie la forme instantanée de la main (main ouverte, poing, etc.).
  - `PointHistoryClassifier` : classifie des gestes basés sur l’historique de mouvement (ex.: cercle, ligne, etc.).
- Charge les labels depuis :
  - `model/keypoint_classifier/keypoint_classifier_label.csv`,
  - `model/point_history_classifier/point_history_classifier_label.csv`.
- Utilise la classe `CvFpsCalc` pour suivre le FPS.

Pour chaque frame :

1. Détection des mains (MediaPipe).
2. Calcul de la **bounding box** de la main.
3. Extraction d’une liste de points (landmarks) représentant la main.
4. Prétraitement :
   - coordonnées relatives,
   - normalisation,
   - conversion en vecteur 1D.
5. Classification :
   - `KeyPointClassifier` → signe instantané.
   - `PointHistoryClassifier` → geste basé sur l’historique de points.
6. Option logging :
   - possibilité d’enregistrer des données dans des CSV pour enrichir le dataset.
7. Affichage :
   - dessin de la main (lignes + points),
   - texte avec la main (gauche/droite) + le signe reconnu,
   - affichage d’un nom de geste en fonction du classifieur d’historique,
   - dessin de l’historique de points,
   - affichage du FPS et du mode courant.

Ce module est intéressant pour le projet car, à terme, on peut imaginer que certains **gestes de la main** de l’opérateur pourraient déclencher des actions (changement de mode, capture d’image, etc.), même si ce n’est pas la priorité pour l’instant.

#### 5.7.2. Classes de modèle – `model/`

- `KeyPointClassifier` :
  - charge un modèle TFLite de classification de points de main.
  - prend en entrée un vecteur normalisé (landmarks).
  - renvoie un index de classe (correspondant à une ligne du CSV).

- `PointHistoryClassifier` :
  - similaire mais pour l’historique de points (mouvements de la main).
  - intègre un seuil `score_th` pour marquer certains gestes comme “non valides”.

#### 5.7.3. Utilitaire FPS – `utils/cvfpscalc.py`

- Classe `CvFpsCalc` :
  - stocke un petit buffer de durées entre frames,
  - calcule un FPS moyen,
  - renvoie un FPS arrondi à 2 décimales.

Cet utilitaire est réutilisé dans plusieurs modules pour avoir une idée de la performance en temps réel.

---

## 6. Structuration, qualité de code et documentation

### 6.1. Fichier de dépendances

À mettre en place (ou en cours) :

- `requirements.txt` à la racine, contenant les librairies Python nécessaires.
- Objectif : permettre un `pip install -r requirements.txt` propre sur une nouvelle machine.

### 6.2. Formatage et lint

Outils envisagés :

- **Black** : formatage automatique du code (PEP 8).
- **Ruff** : linter rapide pour :
  - détecter les imports inutiles,
  - repérer des erreurs simples,
  - homogénéiser quelques conventions.

Idée : pouvoir lancer régulièrement :

```bash
black EIP_proto
ruff check EIP_proto
```

pour garder une base de code propre.

### 6.3. Intégration continue (CI)

Sur une forge type GitHub :

- workflow simple avec :
  - installation de Python + dépendances,
  - lancement de Black en mode check,
  - lancement du linter,
  - exécution de quelques scripts basiques (import, exécution sans caméra si possible).

Même une CI très simple montre une vraie **structuration de projet** et évite les régressions.

### 6.4. Documentation

Ce rapport fait partie de la documentation globale du projet :

- description du **contexte** et de la **vision** du système,
- inventaire des **prototypes logiciels** déjà réalisés,
- explication du **fonctionnement d’un drone** et du lien avec la partie vision.

À terme, on peut compléter avec :

- un `README.md` plus détaillé à la racine,
- une doc par module (face recognition, YOLO, etc.),
- quelques schémas (architecture, pipeline de traitement, etc.).

---

## 7. Ressources étudiées (vidéos, tutos, docs)

Le travail réalisé s’est appuyé sur plusieurs types de ressources :

### 7.1. OpenCV (capture vidéo et affichage)

- Tutoriels sur :
  - ouverture de la webcam (`cv2.VideoCapture`),
  - lecture des frames (`cap.read()`),
  - affichage (`cv2.imshow`),
  - gestion du clavier (`cv2.waitKey`).

Ces bases sont réutilisées dans quasiment tous les scripts du projet.

### 7.2. YOLOv8 (détection d’objets et de pose)

- Documentation Ultralytics sur YOLOv8 :
  - installation du package,
  - chargement d’un modèle pré-entraîné,
  - compréhension de la structure des résultats,
  - usage de `results[0].plot()` pour générer une image annotée rapidement.

- Tutoriels vidéo sur :
  - la détection d’objets (classes COCO),
  - la détection de pose (squelettes humains, keypoints).

### 7.3. Reconnaissance faciale (librairie `face_recognition`)

- Documentation et exemples simples :
  - calcul d’encodages pour des visages connus,
  - comparaison avec des visages inconnus,
  - gestion de petits datasets de visages,
  - intégration avec OpenCV pour l’affichage.

### 7.4. MediaPipe (mains)

- Tutoriels sur MediaPipe Hands :
  - récupération des points clés de la main,
  - visualisation des landmarks,
  - interprétation des coordonnées normalisées,
  - combinaison avec du code perso (prétraitement, classification).

### 7.5. Drones et stabilisation

- Articles et vidéos expliquant :
  - la structure d’un quadricoptère,
  - le rôle de l’IMU, du baromètre, du GPS,
  - le fonctionnement des PID,
  - les difficultés spécifiques du vol indoor (sans GPS) et l’importance de la vision.

Ces ressources ont été synthétisées dans la partie théorique du présent document.

---

## 8. Lien entre les prototypes actuels et le futur mini-drone

Même si le **drone matériel n’est pas encore reçu**, le projet a déjà avancé sur plusieurs points importants :

1. **Compréhension de la plateforme drone**
   - ce que fait un contrôleur de vol,
   - comment la stabilisation est assurée,
   - quelles sont les limitations en intérieur.

2. **Briques logicielles de vision déjà opérationnelles**
   - capture vidéo en temps réel,
   - détection de personnes et d’objets,
   - reconnaissance de visages,
   - détection de pose (squelette),
   - reconnaissance de gestes de la main,
   - fusion de plusieurs sources d’information (objets + mains, visages + personnes, etc.),
   - alerte sonore lors de la détection d’une personne.

3. **Structuration du projet**
   - séparation claire des modules (visage, forme, main, fusion…),
   - début de réflexion sur les dépendances, la qualité de code et la CI,
   - documentation rédigée pour pouvoir présenter l’état du projet.

### 8.1. Étapes suivantes après réception du hardware

Quand le mini-drone sera là, les principaux travaux seront :

- remplacer la webcam par la **caméra du drone** comme source vidéo,
- vérifier les performances en conditions réelles (latence, FPS),
- adapter, si besoin, les résolutions / tailles d’images,
- choisir le ou les modules de vision à activer en priorité (par ex. simple détection de personnes + alarme),
- éventuellement déporter une partie du traitement sur une machine embarquée si nécessaire.

---

## 9. Conclusion

En résumé, pendant cette phase sans matériel, le travail a surtout porté sur :

- la **théorie du drone** (fonctionnement, capteurs, stabilisation),
- la **mise en place d’un ensemble de prototypes logiciels de vision** réutilisables,
- la **structuration du dépôt** pour préparer la suite (qualité, doc, CI).

Les briques développées autour d’OpenCV, YOLO, face_recognition, MediaPipe et les scripts associés montrent que la partie “vision” du projet est déjà bien entamée.
L’arrivée du drone physique permettra d’entrer dans la phase d’intégration et de tests en situation réelle, en capitalisant sur tout ce travail préparatoire.

