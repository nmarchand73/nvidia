# Configuration GitHub Pages

## Étapes pour activer GitHub Pages

1. **Aller dans les paramètres du dépôt** :
   - Cliquez sur "Settings" dans votre dépôt GitHub
   - Allez dans la section "Pages" dans le menu de gauche

2. **Configurer la source** :
   - Dans "Source", sélectionnez **"GitHub Actions"** (pas "Deploy from a branch")
   - Cela permet d'utiliser le workflow automatique

3. **Vérifier les permissions** :
   - Dans "Settings" > "Actions" > "General"
   - Dans "Workflow permissions", sélectionnez "Read and write permissions"
   - Cochez "Allow GitHub Actions to create and approve pull requests"

4. **Attendre le premier déploiement** :
   - Le workflow se déclenche automatiquement sur chaque push vers `main`
   - Vous pouvez aussi le déclencher manuellement dans "Actions" > "Deploy to GitHub Pages" > "Run workflow"

5. **Vérifier l'URL** :
   - Une fois déployé, votre site sera disponible à :
   - `https://nmarchand73.github.io/nvidia/`

## Dépannage

Si vous voyez l'erreur "Get Pages site failed" :
1. Vérifiez que GitHub Pages est activé avec "GitHub Actions" comme source
2. Vérifiez que les permissions du workflow sont correctes
3. Attendez quelques minutes après la première activation
4. Vérifiez les logs du workflow dans "Actions" pour voir les erreurs détaillées

