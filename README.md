# Over Sight — Website (présentation / avancement)

Site statique HTML/CSS/JS utilisé pour présenter :
- la page de présentation du projet (`index.html`),
- la page d’avancement et de livrables (`progress.html`),
- les captures des modes de démo,
- les liens vers la documentation Markdown du projet.

## Lancer en local

### Option 1 — ouverture directe
Ouvre simplement `index.html` dans ton navigateur.

### Option 2 — serveur local (recommandé)
Depuis ce dossier :

```bash
python -m http.server 5173
```

Puis ouvre :

```text
http://localhost:5173
```

## Arborescence utile

- `index.html` : page de présentation
- `progress.html` : page d’avancement / livrables
- `assets/css/styles.css` : styles du site
- `assets/js/app.js` : interactions (langue, thème, filtres, reveal, retour en haut)
- `assets/img/` : captures, schémas et visuels
- `documentation/` : documents Markdown liés au projet

## Images attendues

Le site s’appuie notamment sur ces fichiers :
- `hero_drone.png`
- `solution_overview.png`
- `flow_diagram.png`
- `architecture_diagram.png`
- `screenshot_01_launcher.png`
- `screenshot_02_dataset.png`
- `screenshot_03_face_reco.png`
- `screenshot_04_yolo_objects.png`
- `screenshot_05_yolo_pose.png`
- `screenshot_06_hand_gestures.png`

## Modifications incluses dans cette mise à jour
- correction du chemin du schéma d’architecture (`.png` au lieu de `.svg`)
- correction des liens de documentation dans `progress.html`
- mise à jour du README du site pour correspondre à l’arborescence réelle
