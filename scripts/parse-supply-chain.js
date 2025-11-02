const fs = require('fs');
const path = require('path');

// Lire le document markdown
const docPath = path.join(__dirname, '..', 'doc', 'nvidia-supply-chain-complete.md');
const content = fs.readFileSync(docPath, 'utf-8');

const companies = [];

// Extraire les étoiles d'importance
function extractStars(text) {
  if (!text) return 0;
  const matches = text.match(/⭐+/g);
  return matches ? matches[0].length : 0;
}

// Extraire le ticker principal (premier ticker US si disponible)
function extractPrimaryTicker(tickerText) {
  if (!tickerText) return null;
  // Priorité: NASDAQ/NYSE tickers, puis autres
  const nasdaqMatch = tickerText.match(/([A-Z]{1,5})\s*\(NASDAQ\)/i);
  if (nasdaqMatch) return nasdaqMatch[1];
  
  const nyseMatch = tickerText.match(/([A-Z]{1,5})\s*\(NYSE\)/i);
  if (nyseMatch) return nyseMatch[1];
  
  // Prendre le premier ticker mentionné
  const firstMatch = tickerText.match(/^([A-Z0-9]{1,10})/);
  return firstMatch ? firstMatch[1] : null;
}

// Extraire recommandation du texte de l'entreprise
function extractRecommendation(text) {
  if (!text) return null;
  const upperText = text.toUpperCase();
  if (upperText.includes('TOP PICK')) return 'TOP PICK';
  if (upperText.includes('À ÉVITER') || upperText.includes('EVITER')) return 'À ÉVITER';
  if (upperText.includes('LEADER')) return 'LEADER';
  return null;
}

// Parser une entreprise individuelle
function parseCompany(match, block, level, sectionTitle) {
  const companyNumber = match[1];
  const nameMatch = match[2];
  const companyName = nameMatch.trim();
  
  const companyData = {
    id: parseInt(companyNumber),
    name: companyName,
    level: level,
    section: sectionTitle,
    ticker: null,
    tickerFull: null,
    role: null,
    capitalisation: null,
    importance: 0,
    correlation: null,
    partMarche: null,
    produits: [],
    position: null,
    recommendation: null,
    metadata: {}
  };
  
  const lines = block.split('\n');
  
  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();
    
    // Ticker
    if (trimmed.includes('**Ticker**:')) {
      const tickerMatch = trimmed.match(/- \*\*Ticker\*\*:\s*(.+)/);
      if (tickerMatch) {
        companyData.tickerFull = tickerMatch[1].trim();
        companyData.ticker = extractPrimaryTicker(tickerMatch[1]);
      }
    }
    
    // Rôle
    if (trimmed.includes('**Rôle**:')) {
      const roleMatch = trimmed.match(/- \*\*Rôle\*\*:\s*(.+)/);
      if (roleMatch) companyData.role = roleMatch[1].trim();
    }
    
    // Capitalisation
    if (trimmed.includes('**Capitalisation**:')) {
      const capMatch = trimmed.match(/- \*\*Capitalisation\*\*:\s*(.+)/);
      if (capMatch) companyData.capitalisation = capMatch[1].trim();
    }
    
    // Importance
    if (trimmed.includes('**Importance**:')) {
      const impMatch = trimmed.match(/- \*\*Importance\*\*:\s*(.+)/);
      if (impMatch) {
        companyData.importance = extractStars(impMatch[1]);
        companyData.metadata.importanceText = impMatch[1].trim();
      }
    }
    
    // Corrélation
    if (trimmed.includes('**Corrélation')) {
      const corrMatch = trimmed.match(/- \*\*Corrélation (?:Nvidia|NVIDIA)\*\*:\s*(.+)/);
      if (corrMatch) companyData.correlation = corrMatch[1].trim();
    }
    
    // Part de marché
    if (trimmed.includes('**Part de marché')) {
      const pmMatch = trimmed.match(/- \*\*Part de marché\*\*:\s*(.+)/);
      if (pmMatch) companyData.partMarche = pmMatch[1].trim();
    }
    
    // Produits (peut être multiligne avec sous-points)
    if (trimmed.includes('**Produits')) {
      const produitsMatch = trimmed.match(/- \*\*Produits (?:clés|pour Nvidia)?\*\*:\s*(.+)/);
      if (produitsMatch) {
        let produitsText = produitsMatch[1].trim();
        // Collecter les lignes suivantes avec des tirets
        for (let i = lineIndex + 1; i < lines.length && i < lineIndex + 10; i++) {
          const nextLine = lines[i].trim();
          if (nextLine.startsWith('- ')) {
            produitsText += ', ' + nextLine.replace(/^-\s*/, '');
          } else if (!nextLine.startsWith('-') && nextLine.length > 0 && !nextLine.startsWith('**')) {
            break;
          }
        }
        companyData.produits = produitsText.split(',').map(p => p.trim()).filter(p => p);
      }
    }
    
    // Position
    if (trimmed.includes('**Position')) {
      const posMatch = trimmed.match(/- \*\*Position (?:chaîne|marché)?\*\*:\s*(.+)/);
      if (posMatch) companyData.position = posMatch[1].trim();
    }
    
    // Détecter recommandations
    const upperLine = trimmed.toUpperCase();
    if (upperLine.includes('TOP PICK')) {
      companyData.recommendation = 'TOP PICK';
    }
    if (upperLine.includes('À ÉVITER') || upperLine.includes('EVITER')) {
      companyData.recommendation = 'À ÉVITER';
    }
  });
  
  // Extraire recommandation globale du bloc
  if (!companyData.recommendation) {
    companyData.recommendation = extractRecommendation(block);
  }
  
  // Métadonnées
  const upperBlock = block.toUpperCase();
  if (upperBlock.includes('CRITIQUE')) {
    companyData.metadata.isCritical = true;
  }
  if (upperBlock.includes('ABSOLUMENT CRITIQUE')) {
    companyData.metadata.isAbsolutelyCritical = true;
  }
  
  return companyData;
}

// Diviser le contenu par sections de niveau
const levelPatterns = [
  { pattern: /##\s+⛏️\s+NIVEAU\s+1\s+[^-]+{#niveau-1/, level: 1, title: 'Matières premières et équipements' },
  { pattern: /##\s+🏭\s+NIVEAU\s+2\s+[^-]+{#niveau-2/, level: 2, title: 'Fabrication des composants' },
  { pattern: /##\s+🔨\s+NIVEAU\s+3\s+[^-]+{#niveau-3/, level: 3, title: 'Assemblage et packaging' },
  { pattern: /##\s+🏢\s+NIVEAU\s+4\s+[^-]+{#niveau-4/, level: 4, title: 'Infrastructure datacenter' },
  { pattern: /##\s+👥\s+NIVEAU\s+5\s+[^-]+{#niveau-5/, level: 5, title: 'Clients finaux' },
];

// Trouver toutes les entreprises avec regex
const companyPattern = /####\s+\*\*(\d+)\.\s+(.+?)\*\*/g;
let match;

while ((match = companyPattern.exec(content)) !== null) {
  const companyNumber = match[1];
  const companyName = match[2];
  
  // Trouver dans quelle section/niveau se trouve cette entreprise
  let level = 0;
  let sectionTitle = '';
  
  // Chercher le niveau le plus proche avant cette position
  const position = match.index;
  const beforeText = content.substring(0, position);
  
  for (const levelPattern of levelPatterns) {
    const lastMatch = beforeText.match(new RegExp(levelPattern.pattern.source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    if (lastMatch) {
      level = levelPattern.level;
      sectionTitle = levelPattern.title;
      break;
    }
  }
  
  // Extraire le bloc de l'entreprise (jusqu'à la prochaine entreprise ou section)
  const startIndex = match.index;
  let endIndex = content.length;
  
  // Chercher la prochaine entreprise
  const nextMatch = companyPattern.exec(content);
  if (nextMatch) {
    endIndex = nextMatch.index;
    companyPattern.lastIndex = startIndex + 1; // Réinitialiser pour continuer
  }
  
  const companyBlock = content.substring(startIndex, endIndex);
  
  // Parser l'entreprise
  const companyData = parseCompany(match, companyBlock, level, sectionTitle);
  
  if (companyData.ticker || companyData.name) {
    companies.push(companyData);
  }
}

// Ajouter NVIDIA au centre
const nvidia = {
  id: 0,
  name: 'NVIDIA',
  ticker: 'NVDA',
  tickerFull: 'NVDA (NASDAQ)',
  level: 0,
  section: 'CENTRE',
  role: 'Fabricant de GPU et systèmes AI',
  capitalisation: '~4 trillions $',
  importance: 5,
  correlation: '1.0',
  recommendation: 'CORE',
  produits: ['H100', 'H200', 'Blackwell (GB200)', 'Rubin'],
  metadata: { isCore: true }
};

companies.unshift(nvidia);

// Trier par ID
companies.sort((a, b) => a.id - b.id);

// Créer le JSON de sortie
const output = {
  metadata: {
    generatedAt: new Date().toISOString(),
    source: 'nvidia-supply-chain-complete.md',
    totalCompanies: companies.length
  },
  companies: companies
};

// Créer le dossier data s'il n'existe pas
const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Écrire le fichier JSON
const outputPath = path.join(dataDir, 'companies.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

console.log(`✅ Parsed ${companies.length} companies`);
console.log(`📄 Output written to ${outputPath}`);
console.log(`\nBreakdown by level:`);
[0, 1, 2, 3, 4, 5].forEach(level => {
  const count = companies.filter(c => c.level === level).length;
  if (count > 0) {
    console.log(`  Level ${level}: ${count} companies`);
  }
});
