# Script de vérification et configuration MCP Chrome DevTools pour Cursor

Write-Host "🔍 Vérification de la configuration MCP Chrome DevTools..." -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
Write-Host "1. Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "   ✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
    
    $nodeVersionNum = (node -v) -replace 'v', ''
    $requiredVersion = [Version]"22.12.0"
    $currentVersion = [Version]$nodeVersionNum
    
    if ($currentVersion -lt $requiredVersion) {
        Write-Host "   ⚠️  Version $nodeVersionNum détectée. Version requise: 22.12.0+" -ForegroundColor Red
    } else {
        Write-Host "   ✅ Version compatible" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Node.js non installé" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Vérifier chrome-devtools-mcp
Write-Host "2. Vérification de chrome-devtools-mcp..." -ForegroundColor Yellow
$mcpInstalled = npm list -g chrome-devtools-mcp 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ chrome-devtools-mcp installé" -ForegroundColor Green
    $version = (npm list -g chrome-devtools-mcp --depth=0 2>$null | Select-String "chrome-devtools-mcp@").ToString()
    Write-Host "   📦 $version" -ForegroundColor Gray
} else {
    Write-Host "   ⚠️  chrome-devtools-mcp non installé" -ForegroundColor Yellow
    Write-Host "   💡 Exécutez: .\scripts\setup-mcp.ps1 pour l'installer" -ForegroundColor Cyan
}

Write-Host ""

# Vérifier les fichiers de configuration
Write-Host "3. Vérification des fichiers de configuration..." -ForegroundColor Yellow

$mcpConfigExists = Test-Path ".cursor/mcp.json"
if ($mcpConfigExists) {
    Write-Host "   ✅ .cursor/mcp.json existe" -ForegroundColor Green
    $config = Get-Content ".cursor/mcp.json" | ConvertFrom-Json
    if ($config.mcpServers."chrome-devtools") {
        Write-Host "   ✅ Configuration chrome-devtools trouvée" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ .cursor/mcp.json introuvable" -ForegroundColor Red
}

$mcpConfigGeneric = Test-Path "mcp-config.json"
if ($mcpConfigGeneric) {
    Write-Host "   ✅ mcp-config.json existe" -ForegroundColor Green
}

Write-Host ""

# Instructions pour Cursor
Write-Host "4. Configuration dans Cursor IDE..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   📝 Étapes à suivre dans Cursor:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. Ouvrez Cursor et appuyez sur Ctrl+, (Paramètres)" -ForegroundColor White
Write-Host "   2. Cherchez 'MCP' dans la barre de recherche" -ForegroundColor White
Write-Host "   3. Allez dans Features > MCP" -ForegroundColor White
Write-Host "   4. Cliquez sur '+ Ajouter un nouveau serveur MCP'" -ForegroundColor White
Write-Host "   5. Remplissez:" -ForegroundColor White
Write-Host "      - Nom: chrome-devtools" -ForegroundColor Gray
Write-Host "      - Commande: npx" -ForegroundColor Gray
Write-Host "      - Arguments: chrome-devtools-mcp@latest" -ForegroundColor Gray
Write-Host "   6. Sauvegardez et redémarrez Cursor" -ForegroundColor White
Write-Host ""

# Vérifier si Chrome est installé
Write-Host "5. Vérification de Chrome/Chromium..." -ForegroundColor Yellow
$chromePaths = @(
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"
)

$chromeFound = $false
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        Write-Host "   ✅ Chrome trouvé: $path" -ForegroundColor Green
        $chromeFound = $true
        break
    }
}

if (-not $chromeFound) {
    Write-Host "   ⚠️  Chrome non détecté dans les emplacements standard" -ForegroundColor Yellow
    Write-Host "   💡 Assurez-vous que Chrome est installé et accessible" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Vérification terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Documentation complète: voir MCP-SETUP.md" -ForegroundColor Cyan

