# NVIDIA Supply Chain Visualizer

Application web interactive pour visualiser la chaîne d'approvisionnement NVIDIA avec :

- Visualisation graphique interactive de la chaîne avec entreprises cliquables
- Couleurs dynamiques indiquant la tendance boursière (horizon configurable : 1M, 3M, 6M, 1Y)
- Panneau détail à droite avec informations complètes sur l'entreprise sélectionnée
- Données boursières en temps réel via Yahoo Finance API
- Filtres par niveau et recherche d'entreprises
- Recommandations d'investissement extraites du document source

## Structure du Projet

```
NVIDIA/
├── doc/
│   ├── nvidia-supply-chain-complete.md    # Document source complet
│   └── nvidia-supply-chain.json           # Données structurées JSON
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SupplyChainGraph.tsx       # Graphique interactif D3
│   │   │   ├── DetailPanel.tsx            # Panneau détails
│   │   │   ├── ControlsPanel.tsx          # Contrôles et filtres
│   │   │   └── StockTrendChart.tsx         # Graphique tendance Recharts
│   │   ├── services/
│   │   │   ├── stockApi.ts                 # API Yahoo Finance
│   │   │   └── dataLoader.ts               # Chargement données
│   │   └── types.ts                        # Types TypeScript
│   └── public/
│       └── companies.json                   # Données entreprises
├── scripts/
│   ├── setup-mcp.sh                        # Script installation MCP (Unix)
│   ├── setup-mcp.ps1                       # Script installation MCP (PowerShell)
│   └── parse-supply-chain.js              # Script parsing données
├── .cursor/
│   └── mcp.json                            # Configuration MCP pour Cursor
├── mcp-config.json                         # Configuration MCP générique
└── README.md
```

## Technologies

- **React 18** + **TypeScript** : Framework frontend
- **Vite** : Build tool et dev server
- **D3.js** : Visualisation graphique interactive
- **Recharts** : Graphiques de tendance boursière
- **Tailwind CSS** : Styling
- **Yahoo Finance API** : Données boursières (gratuite)
- **localStorage** : Cache des données boursières (30 minutes)

## Installation et Développement

```bash
cd frontend
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Build pour Production

```bash
cd frontend
npm run build
```

Les fichiers seront générés dans `frontend/dist/`

## Déploiement GitHub Pages

Le projet est configuré pour être déployé sur GitHub Pages avec base path `/NVIDIA/`.

1. **Configuration GitHub Actions** (déjà créé) :
   - `.github/workflows/deploy.yml` - Auto-deploy sur push vers `main`

2. **Build automatique** :
   - Push vers `main` déclenche le build et déploiement
   - Les fichiers sont publiés sur `https://[username].github.io/NVIDIA/`

## Fonctionnalités

### Visualisation Graphique
- Layout hiérarchique par niveaux (1-5)
- NVIDIA au centre
- Nœuds cliquables avec taille selon capitalisation
- Couleurs selon tendance boursière :
  - 🔴 Rouge : < -5%
  - 🟠 Orange : -5% à 0%
  - ⚫ Gris : 0% à +5%
  - 🟢 Vert : > +5%

### Contrôles
- **Horizon temporel** : 1 mois, 3 mois, 6 mois, 1 an
- **Filtre par niveau** : Filtrer par niveau de la chaîne
- **Recherche** : Rechercher par nom ou ticker

### Panneau Détails
- Informations complètes de l'entreprise
- Graphique de tendance boursière
- Métriques clés (capitalisation, corrélation NVIDIA, criticité)
- Produits et clients
- Recommandations d'investissement (TOP PICK, À ÉVITER, etc.)

## Structure des Données

Le fichier `companies.json` contient :
- **78 entreprises** organisées en 5 niveaux
- Métadonnées complètes (ticker, capitalisation, rôle, corrélation)
- Recommandations d'investissement
- Relations fournisseur-client
- Statistiques de marché

## API Yahoo Finance

L'application utilise l'API Yahoo Finance (gratuite, sans authentification) :
- Endpoint : `https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1d&range={RANGE}`
- Cache localStorage : 30 minutes
- Fallback : Si API échoue, affiche données statiques

## MCP Chrome DevTools

Le projet inclut la configuration pour le serveur MCP Chrome DevTools, permettant à l'assistant IA de contrôler Chrome via le Chrome DevTools Protocol (CDP).

📚 **Documentation complète**: Consultez [MCP-SETUP.md](MCP-SETUP.md) pour les instructions détaillées.

### Installation

**Windows (PowerShell):**
```powershell
# Installation
.\scripts\setup-mcp.ps1

# Vérification
.\scripts\verify-mcp.ps1
```

**Unix/Linux/Mac:**
```bash
chmod +x scripts/setup-mcp.sh
chmod +x scripts/verify-mcp.sh
./scripts/setup-mcp.sh
```

**Installation manuelle:**
```bash
npm install -g chrome-devtools-mcp@latest
```

### Configuration

La configuration MCP est automatiquement détectée par Cursor dans `.cursor/mcp.json`. Pour d'autres clients MCP, utilisez `mcp-config.json`.

### Fonctionnalités disponibles

Une fois configuré, l'assistant IA peut :
- 🌐 Naviguer vers des URLs et interagir avec les pages web
- 📊 Analyser les performances des pages (Lighthouse, traces de performance)
- 📸 Capturer des screenshots et snapshots d'accessibilité
- 🔍 Inspecter et déboguer les éléments DOM
- 🌐 Analyser les requêtes réseau et les messages de console
- 🧪 Automatiser des tests et interactions avec le navigateur

### Prérequis

- Node.js version 22.12.0 ou supérieure
- Chrome ou Chromium installé sur le système

## Licence

MIT

