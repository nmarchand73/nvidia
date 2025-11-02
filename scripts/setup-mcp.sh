#!/bin/bash
# Script d'installation du serveur MCP Chrome DevTools

echo "🚀 Installation du serveur MCP Chrome DevTools..."

# Vérifier Node.js version (nécessite 22.12.0+)
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="22.12.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION détectée. Version requise: $REQUIRED_VERSION ou supérieure"
    echo "Veuillez mettre à jour Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Installer globalement chrome-devtools-mcp
echo "📦 Installation de chrome-devtools-mcp..."
npm install -g chrome-devtools-mcp@latest

if [ $? -eq 0 ]; then
    echo "✅ chrome-devtools-mcp installé avec succès!"
    echo ""
    echo "📝 Configuration:"
    echo "La configuration MCP est disponible dans:"
    echo "  - .cursor/mcp.json (pour Cursor)"
    echo "  - mcp-config.json (configuration générique)"
    echo ""
    echo "💡 Pour utiliser avec Cursor:"
    echo "  Le fichier .cursor/mcp.json est déjà configuré et sera automatiquement détecté."
    echo ""
    echo "💡 Fonctionnalités disponibles:"
    echo "  - Analyse de performance des pages web"
    echo "  - Navigation et interaction avec le navigateur"
    echo "  - Capture de screenshots et snapshots"
    echo "  - Debugging et inspection d'éléments"
    echo "  - Analyse réseau et console"
else
    echo "❌ Erreur lors de l'installation"
    exit 1
fi

