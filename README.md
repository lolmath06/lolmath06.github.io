# Over Sight — Website (suivi / avancement)

Site statique (HTML/CSS/JS) destiné à présenter **les livrables** récents :
- Point d’entrée unique (launcher GUI)
- Outil dataset visages (capture webcam + dossiers par personne)
- Amélioration SimpleFacerec (parcours récursif de img/)
- État hardware (Raspberry reçu, LIDAR en attente)

## Lancer en local
### Option 1 — ouvrir directement
Ouvre `website/index.html` dans ton navigateur.

### Option 2 — serveur local (recommandé)
Dans le dossier `website/` :
```bash
python -m http.server 5173
```
Puis va sur `http://localhost:5173`.

## Ajouter des images (optionnel)
Place des screenshots dans `website/assets/img/` :
- `screenshot_launcher.png`
- `screenshot_yolo.png`
- `screenshot_face.png`
