# Configuration MCP Chrome DevTools pour Cursor

Ce guide vous explique comment configurer le serveur MCP Chrome DevTools dans Cursor IDE.

## Méthode 1: Configuration automatique (si supporté)

Le fichier `.cursor/mcp.json` devrait être automatiquement détecté par Cursor. Si ce n'est pas le cas, utilisez la méthode manuelle ci-dessous.

## Méthode 2: Configuration manuelle dans Cursor

### Étape 1: Installer le serveur MCP Chrome DevTools

Ouvrez PowerShell dans le répertoire du projet et exécutez:

```powershell
.\scripts\setup-mcp.ps1
```

Ou manuellement:

```powershell
npm install -g chrome-devtools-mcp@latest
```

### Étape 2: Configurer dans Cursor

1. **Ouvrez Cursor** et accédez aux paramètres:
   - Appuyez sur `Ctrl+,` (Windows/Linux) ou `Cmd+,` (Mac)
   - Ou allez dans `File > Preferences > Settings`

2. **Naviguez vers les paramètres MCP**:
   - Cherchez "MCP" dans la barre de recherche des paramètres
   - Ou allez dans `Features > MCP`

3. **Ajoutez un nouveau serveur MCP**:
   - Cliquez sur le bouton **"+ Ajouter un nouveau serveur MCP"** ou **"Add MCP Server"**
   - Remplissez les champs suivants:
     - **Nom / Name**: `chrome-devtools`
     - **Type**: `stdio`
     - **Commande / Command**: `npx`
     - **Arguments / Args**: `chrome-devtools-mcp@latest`

4. **Sauvegardez** et redémarrez Cursor si nécessaire

### Étape 3: Vérifier l'intégration

Pour tester que l'intégration fonctionne, demandez à l'assistant IA de Cursor:

```
Peux-tu vérifier les performances de https://web.dev ?
```

ou

```
Analyse la page http://localhost:5173 avec Chrome DevTools
```

## Structure de configuration

Le fichier `.cursor/mcp.json` contient:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

## Fonctionnalités disponibles

Une fois configuré, l'assistant IA peut:

- 🌐 **Naviguer** vers des URLs
- 📊 **Analyser les performances** (LCP, FID, CLS, etc.)
- 📸 **Capturer des screenshots**
- 🔍 **Inspecter le DOM** et les éléments
- 🌐 **Analyser le réseau** (requêtes HTTP, timing)
- 📝 **Examiner la console** (erreurs, warnings)
- 🧪 **Automatiser des interactions** avec le navigateur
- 🎯 **Créer des traces de performance**

## Prérequis

- Node.js version 22.12.0 ou supérieure
- Chrome ou Chromium installé
- Cursor IDE version récente avec support MCP

## Dépannage

### Le serveur MCP n'apparaît pas dans Cursor

1. Vérifiez que Node.js est installé: `node -v` (doit être ≥ 22.12.0)
2. Vérifiez que `chrome-devtools-mcp` est installé: `npm list -g chrome-devtools-mcp`
3. Redémarrez Cursor complètement
4. Vérifiez les logs de Cursor pour les erreurs MCP

### Erreur "Command not found"

Assurez-vous que `npx` est disponible dans votre PATH. Testez avec:
```powershell
npx --version
```

### Chrome ne s'ouvre pas

Vérifiez que Chrome ou Chromium est installé et accessible dans votre PATH système.

## Références

- [Chrome DevTools MCP sur npm](https://www.npmjs.com/package/chrome-devtools-mcp)
- [Documentation MCP](https://modelcontextprotocol.io/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)

