# Script d'installation du serveur MCP Chrome DevTools (PowerShell)

Write-Host "Installation du serveur MCP Chrome DevTools..." -ForegroundColor Cyan

# Verifier si Node.js est installe
try {
    $nodeVersion = node -v
    Write-Host "[OK] Node.js detecte: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Node.js n'est pas installe. Veuillez l'installer depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verifier la version Node.js (necessite 22.12.0+)
$nodeVersionNum = (node -v) -replace 'v', ''
$requiredVersion = [Version]"22.12.0"
$currentVersion = [Version]$nodeVersionNum

if ($currentVersion -lt $requiredVersion) {
    Write-Host "[ERREUR] Node.js version $nodeVersionNum detectee. Version requise: 22.12.0 ou superieure" -ForegroundColor Red
    Write-Host "Veuillez mettre a jour Node.js: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Installer globalement chrome-devtools-mcp
Write-Host "[INFO] Installation de chrome-devtools-mcp..." -ForegroundColor Cyan
npm install -g chrome-devtools-mcp@latest

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] chrome-devtools-mcp installe avec succes!" -ForegroundColor Green
    Write-Host ""
    Write-Host "[INFO] Configuration:" -ForegroundColor Cyan
    Write-Host "La configuration MCP est disponible dans:" -ForegroundColor Yellow
    Write-Host "  - .cursor/mcp.json (pour Cursor)" -ForegroundColor Yellow
    Write-Host "  - mcp-config.json (configuration generique)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[INFO] Pour utiliser avec Cursor:" -ForegroundColor Cyan
    Write-Host "  Le fichier .cursor/mcp.json est deja configure et sera automatiquement detecte." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[INFO] Fonctionnalites disponibles:" -ForegroundColor Cyan
    Write-Host "  - Analyse de performance des pages web" -ForegroundColor Yellow
    Write-Host "  - Navigation et interaction avec le navigateur" -ForegroundColor Yellow
    Write-Host "  - Capture de screenshots et snapshots" -ForegroundColor Yellow
    Write-Host "  - Debugging et inspection d'elements" -ForegroundColor Yellow
    Write-Host "  - Analyse reseau et console" -ForegroundColor Yellow
} else {
    Write-Host "[ERREUR] Erreur lors de l'installation" -ForegroundColor Red
    exit 1
}
