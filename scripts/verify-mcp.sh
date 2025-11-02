#!/bin/bash
# Script de vérification et configuration MCP Chrome DevTools pour Cursor

echo "🔍 Vérification de la configuration MCP Chrome DevTools..."
echo ""

# Vérifier Node.js
echo "1. Vérification de Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   ✅ Node.js détecté: $NODE_VERSION"
    
    NODE_VERSION_NUM=$(echo $NODE_VERSION | cut -d'v' -f2)
    REQUIRED_VERSION="22.12.0"
    
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION_NUM" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
        echo "   ⚠️  Version $NODE_VERSION_NUM détectée. Version requise: 22.12.0+"
    else
        echo "   ✅ Version compatible"
    fi
else
    echo "   ❌ Node.js non installé"
    exit 1
fi

echo ""

# Vérifier chrome-devtools-mcp
echo "2. Vérification de chrome-devtools-mcp..."
if npm list -g chrome-devtools-mcp &> /dev/null; then
    echo "   ✅ chrome-devtools-mcp installé"
    VERSION=$(npm list -g chrome-devtools-mcp --depth=0 2>/dev/null | grep "chrome-devtools-mcp@")
    echo "   📦 $VERSION"
else
    echo "   ⚠️  chrome-devtools-mcp non installé"
    echo "   💡 Exécutez: ./scripts/setup-mcp.sh pour l'installer"
fi

echo ""

# Vérifier les fichiers de configuration
echo "3. Vérification des fichiers de configuration..."

if [ -f ".cursor/mcp.json" ]; then
    echo "   ✅ .cursor/mcp.json existe"
    if grep -q "chrome-devtools" ".cursor/mcp.json"; then
        echo "   ✅ Configuration chrome-devtools trouvée"
    fi
else
    echo "   ❌ .cursor/mcp.json introuvable"
fi

if [ -f "mcp-config.json" ]; then
    echo "   ✅ mcp-config.json existe"
fi

echo ""

# Instructions pour Cursor
echo "4. Configuration dans Cursor IDE..."
echo ""
echo "   📝 Étapes à suivre dans Cursor:"
echo ""
echo "   1. Ouvrez Cursor et appuyez sur Cmd+, ou Ctrl+, (Paramètres)"
echo "   2. Cherchez 'MCP' dans la barre de recherche"
echo "   3. Allez dans Features > MCP"
echo "   4. Cliquez sur '+ Ajouter un nouveau serveur MCP'"
echo "   5. Remplissez:"
echo "      - Nom: chrome-devtools"
echo "      - Commande: npx"
echo "      - Arguments: chrome-devtools-mcp@latest"
echo "   6. Sauvegardez et redémarrez Cursor"
echo ""

# Vérifier si Chrome est installé
echo "5. Vérification de Chrome/Chromium..."
if command -v google-chrome &> /dev/null || command -v chromium &> /dev/null || command -v chromium-browser &> /dev/null; then
    echo "   ✅ Chrome/Chromium détecté"
else
    echo "   ⚠️  Chrome non détecté dans PATH"
    echo "   💡 Assurez-vous que Chrome est installé et accessible"
fi

echo ""
echo "✅ Vérification terminée!"
echo ""
echo "📚 Documentation complète: voir MCP-SETUP.md"

