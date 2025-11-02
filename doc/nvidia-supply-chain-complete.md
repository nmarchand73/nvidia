# CHAÎNE D'APPROVISIONNEMENT NVIDIA - GUIDE COMPLET 2025

**Document mis à jour : Novembre 2025**

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble de la chaîne](#vue-densemble)
2. [Niveau 1 - Matières premières et équipements](#niveau-1-matières-premières)
3. [Niveau 2 - Fabrication des composants](#niveau-2-composants)
4. [Niveau 3 - Assemblage et packaging](#niveau-3-assemblage)
5. [Niveau 4 - Infrastructure datacenter](#niveau-4-infrastructure)
6. [Niveau 5 - Clients finaux](#niveau-5-clients)
7. [Synthèse par catégorie](#synthèse-catégories)

---

## 🔍 VUE D'ENSEMBLE {#vue-densemble}

La chaîne d'approvisionnement Nvidia est l'une des plus complexes de l'industrie technologique, impliquant plus de 100 entreprises réparties sur 5 continents.

### Flux principal de valeur

```
MATIÈRES PREMIÈRES → ÉQUIPEMENTS → COMPOSANTS → ASSEMBLAGE → INFRASTRUCTURE → CLIENTS
     (ASML)       (Applied)      (TSMC)      (ASE)       (Vertiv)     (Microsoft)
```

### Valeur totale de la chaîne : ~5 trillions $

---

## ⛏️ NIVEAU 1 - MATIÈRES PREMIÈRES ET ÉQUIPEMENTS DE FABRICATION {#niveau-1-matières-premières}

### 🎯 ÉQUIPEMENTIERS LITHOGRAPHIE (Critical Path)

#### **1. ASML Holding**
- **Ticker**: ASML (NASDAQ) / ASML (Euronext Amsterdam)
- **Rôle**: Monopole machines lithographie EUV
- **Produits clés**: EUV scanners (nécessaires pour <7nm)
- **Position chaîne**: Fournit TSMC/Samsung/Intel
- **Capitalisation**: ~350 milliards $
- **Importance**: ⭐⭐⭐⭐⭐ (CRITIQUE - Pas d'alternative)
- **Clients Nvidia**: Indirect (via TSMC)

---

### 🔧 ÉQUIPEMENTIERS FABRICATION SEMICONDUCTEURS

#### **2. Applied Materials (AMAT)**
- **Ticker**: AMAT (NASDAQ)
- **Rôle**: Équipement dépôt/gravure/implantation ionique
- **Produits clés**: 
  - Systèmes de dépôt chimique en phase vapeur (CVD)
  - Systèmes de gravure plasma
  - Équipements CMP (polissage)
- **Position chaîne**: Vend à TSMC, Samsung, Intel
- **Capitalisation**: ~150 milliards $
- **Corrélation Nvidia**: 0.8+ (Très forte - #1)
- **Importance**: ⭐⭐⭐⭐⭐

#### **3. Lam Research (LRCX)**
- **Ticker**: LRCX (NASDAQ)
- **Rôle**: Équipement gravure et dépôt
- **Produits clés**: 
  - Systèmes de gravure pour puces avancées
  - Équipements de nettoyage
- **Position chaîne**: Fournit fonderies
- **Capitalisation**: ~100 milliards $
- **Corrélation Nvidia**: 0.8+ (Très forte - #2)
- **Importance**: ⭐⭐⭐⭐⭐

#### **4. KLA Corporation (KLAC)**
- **Ticker**: KLAC (NASDAQ)
- **Rôle**: Inspection et métrologie (contrôle qualité)
- **Produits clés**: 
  - Systèmes d'inspection optique
  - Équipements de métrologie
- **Position chaîne**: Critique pour rendement fabrication
- **Capitalisation**: ~85 milliards $
- **Corrélation Nvidia**: 0.8+ (Très forte - #3)
- **Importance**: ⭐⭐⭐⭐⭐

#### **5. Tokyo Electron (TEL)**
- **Ticker**: 8035 (Tokyo Stock Exchange)
- **Rôle**: Équipement gravure et dépôt
- **Produits clés**: Équipements de traitement wafer
- **Position chaîne**: Concurrent Applied Materials/Lam
- **Capitalisation**: ~70 milliards $
- **Importance**: ⭐⭐⭐⭐

---

### 🧪 MATÉRIAUX SPÉCIALISÉS

#### **6. Ajinomoto**
- **Ticker**: 2802 (Tokyo)
- **Rôle**: Inventeur et fournisseur matériau ABF (Ajinomoto Build-up Film)
- **Produits clés**: Films diélectriques ABF pour substrats
- **Position chaîne**: Fournit Ibiden, Unimicron, Shinko
- **Importance**: ⭐⭐⭐⭐⭐ (Matériau essentiel substrats IC)

#### **7. Shin-Etsu Chemical**
- **Ticker**: 4063 (Tokyo)
- **Rôle**: Wafers silicium et matériaux photorésist
- **Produits clés**: Wafers 300mm, matériaux lithographie
- **Importance**: ⭐⭐⭐⭐

#### **8. Sumitomo Chemical**
- **Ticker**: 4005 (Tokyo)
- **Rôle**: Matériaux photorésist et chimiques de process
- **Importance**: ⭐⭐⭐

---

## 🏭 NIVEAU 2 - FABRICATION DES COMPOSANTS {#niveau-2-composants}

### 💎 FONDERIES (Chip Manufacturing)

#### **9. TSMC - Taiwan Semiconductor Manufacturing**
- **Ticker**: TSM (NYSE) / 2330 (TWSE)
- **Rôle**: Fabrique 100% des GPU Nvidia avancés
- **Capacités**: 3nm, 4nm, 5nm, 7nm (leader mondial)
- **Clients Nvidia**: H100, H200, Blackwell (GB200), Rubin (futur)
- **Technologies clés**: 
  - CoWoS (Chip-on-Wafer-on-Substrate) packaging
  - InFO (Integrated Fan-Out) packaging
- **Position chaîne**: CRITIQUE - Pas d'alternative pour puces avancées
- **Part de marché**: 60% fonderies mondiales, 90% puces <7nm
- **Revenus**: 75 milliards $ (2024)
- **Croissance T2 2025**: +54% YoY
- **Importance**: ⭐⭐⭐⭐⭐ (ABSOLUMENT CRITIQUE)
- **Investissements**: 165 milliards $ Arizona (3 fabs + 2 packaging)

#### **10. Samsung Foundry**
- **Ticker**: 005930 (Korea Exchange) - Samsung Electronics
- **Rôle**: Fonderie alternative (backup pour Nvidia)
- **Capacités**: 3nm, 4nm, 5nm
- **Statut Nvidia**: Qualification HBM en cours, faible volume GPU
- **Position chaîne**: Concurrent TSMC mais en retard
- **Part de marché fonderie**: ~15%
- **Importance**: ⭐⭐⭐

#### **11. Intel Foundry Services (IFS)**
- **Ticker**: INTC (NASDAQ)
- **Rôle**: Fonderie émergente (pas encore pour Nvidia)
- **Capacités en développement**: Intel 18A (~1.8nm équivalent)
- **Importance pour Nvidia**: ⭐ (Futur potentiel)

---

### 🧠 MÉMOIRE HBM (High Bandwidth Memory) - COMPOSANT CRITIQUE

#### **12. SK Hynix** ⭐ LEADER HBM
- **Ticker**: 000660 (Korea Exchange)
- **Rôle**: Principal fournisseur HBM de Nvidia (50-60% part marché)
- **Produits pour Nvidia**: 
  - HBM3 (H100)
  - HBM3E 12-Hi 36GB (H200, Blackwell)
  - HBM4 (Rubin - 2026)
- **Position**: Fournisseur exclusif jusqu'à récemment
- **Performance**: 
  - Revenus record T3 2025: 24,45 trillions won
  - Profit opérationnel: +62% YoY
  - HBM = 77% des revenus
- **Statut 2025**: Production vendue jusqu'à fin 2026
- **Capitalisation**: ~130 milliards $ (+80 milliards en 2025)
- **Importance**: ⭐⭐⭐⭐⭐ (CRITIQUE)
- **Avance technologique**: 1b nanometer DRAM (vs Samsung 1a nm)

#### **13. Micron Technology** ⭐ MONTÉE EN PUISSANCE
- **Ticker**: MU (NASDAQ)
- **Rôle**: Deuxième fournisseur HBM Nvidia (en croissance rapide)
- **Produits pour Nvidia**: 
  - HBM3E 12-Hi pour GB200/GB300
  - SOCAMM (Small Outline Compression Attached Memory Module) - "2ème HBM"
- **Position**: Premier qualifié SOCAMM pour Nvidia
- **Part de marché HBM**: 5-10% (objectif 20-25% d'ici 2026)
- **Statut 2025**: Production HBM vendue jusqu'à fin 2025
- **Investissements**: 14 milliards $ capex 2025 (fabs Singapour, Japon, Taiwan, New York)
- **Capitalisation**: ~120 milliards $
- **Importance**: ⭐⭐⭐⭐⭐
- **Avantage**: Efficacité énergétique supérieure (20% vs concurrents)

#### **14. Samsung Electronics (Memory Division)**
- **Ticker**: 005930 (Korea Exchange)
- **Rôle**: Fournisseur HBM en qualification
- **Statut Nvidia**: Tests de qualification HBM3E en cours
- **Problèmes**: Surchauffe et consommation excessive lors tests
- **Part de marché HBM**: 40-42% (mais peu pour Nvidia)
- **Production**: Utilise 1a nm DRAM (génération derrière SK Hynix)
- **Importance pour Nvidia**: ⭐⭐⭐ (En attente qualification)

---

### 🔌 SUBSTRATS IC (Interconnexion chip-to-package)

Les substrats IC sont essentiels pour connecter le GPU au package final. Le marché ABF (Ajinomoto Build-up Film) est critique pour les GPU haute performance.

#### **15. Unimicron Technology** ⭐ LEADER SUBSTRATS
- **Ticker**: 3037 (TWSE Taiwan)
- **Rôle**: #1 mondial substrats ABF (26.6% part marché ABF)
- **Produits pour Nvidia**: FC-BGA substrates pour H100/H200/Blackwell
- **Technologies**: ABF 30μm pitch, HDI substrates
- **Clients**: Nvidia, AMD, Broadcom
- **Expansions 2025-2027**:
  - Taichung Phase I: 2.5M m²/mois (Q4 2025)
  - Taichung Phase II: 3M m²/mois (Q3 2026)
  - Taichung Phase III: 2M m²/mois (Q1 2027)
- **Part marché IC substrates**: 17.7% (total)
- **Importance**: ⭐⭐⭐⭐⭐

#### **16. Ibiden**
- **Ticker**: 4062 (Tokyo)
- **Rôle**: #2 mondial substrats ABF (14.6% part marché ABF)
- **Spécialité**: Ultra-fine pitch (≤20μm) pour GPU avancés
- **Produits**: Substrats pour Nvidia Blackwell, AMD MI300
- **Technologies**: Low-k dielectric, advanced ABF
- **Expansion 2025**: +40% capacité substrats AI
- **Expansions planifiées**:
  - Philippines Plant-1: 2M m²/mois (Q4 2025)
  - Japan Line-3: 3M m²/mois (Q2 2027)
- **Importance**: ⭐⭐⭐⭐⭐

#### **17. Nan Ya PCB (Formosa Plastics Group)**
- **Ticker**: 8046 (TWSE Taiwan)
- **Rôle**: #3 mondial substrats ABF (13.5% part marché)
- **Produits**: Substrats haute densité pour datacenters
- **Part marché**: 10.3% (IC substrates total)
- **Importance**: ⭐⭐⭐⭐

#### **18. Shinko Electric Industries**
- **Ticker**: 6967 (Tokyo)
- **Rôle**: Major substrats ABF (12.8% part marché ABF)
- **Produits**: Substrats haute performance computing/networking
- **Technologies**: Embedded components, advanced ABF
- **Part marché**: 8.5% (IC substrates total)
- **Importance**: ⭐⭐⭐⭐

#### **19. AT&S (Austria Technologie & Systemtechnik)**
- **Ticker**: ATS (Vienna Stock Exchange)
- **Rôle**: Leader européen substrats ABF (8% part marché ABF)
- **Focus**: FC-BGA, HDI substrates
- **Investissements**: Plus gros investisseur 2021-2022 (>15.5 milliards $)
- **Part marché**: 6.1% (IC substrates total)
- **Importance**: ⭐⭐⭐⭐

#### **20. Samsung Electro-Mechanics (SEMCO)**
- **Ticker**: 009150 (Korea Exchange)
- **Rôle**: Substrats BT et ABF
- **Part marché**: 9.1% (IC substrates total)
- **Technologies**: Multi-layer substrates
- **Importance**: ⭐⭐⭐

#### **21. Kinsus Interconnect Technology**
- **Ticker**: 3189 (TWSE Taiwan)
- **Rôle**: Substrats organiques haute fréquence
- **Spécialité**: Science des matériaux avancée
- **Importance**: ⭐⭐⭐

#### **22. Zhen Ding Technology (ZDT)**
- **Ticker**: 4958 (TWSE Taiwan)
- **Rôle**: Montée rapide substrats ABF (cost-effective)
- **Technologies**: 25-30μm pitch, production de masse
- **Clients**: AMD, Broadcom, Meta
- **Expansions massives**:
  - Kunshan Greenfield: 3M m²/mois (Q3 2025)
  - Kunshan Phase II: 2M m²/mois (Q2 2026)
  - Kunshan Phase III: 1.5M m²/mois (Q4 2027)
- **Capacité de base**: 10M m²/mois
- **Importance**: ⭐⭐⭐⭐

---

### 🔋 COMPOSANTS ÉLECTRONIQUES PASSIFS & ACTIFS

#### **23. Murata Manufacturing**
- **Ticker**: 6981 (Tokyo)
- **Rôle**: Condensateurs MLCC, inducteurs
- **Produits**: Composants passifs haute performance
- **Importance**: ⭐⭐⭐

#### **24. TDK Corporation**
- **Ticker**: 6762 (Tokyo)
- **Rôle**: Inducteurs, transformateurs, capteurs
- **Importance**: ⭐⭐⭐

#### **25. Infineon Technologies**
- **Ticker**: IFX (Frankfurt) / IFNNY (OTC)
- **Rôle**: Power management ICs, MOSFETs
- **Produits**: Circuits gestion alimentation pour GPU
- **Importance**: ⭐⭐⭐⭐

#### **26. Texas Instruments**
- **Ticker**: TXN (NASDAQ)
- **Rôle**: Analog ICs, power management
- **Importance**: ⭐⭐⭐

#### **27. Analog Devices**
- **Ticker**: ADI (NASDAQ)
- **Rôle**: Analog/mixed-signal ICs
- **Importance**: ⭐⭐⭐

---

## 🔨 NIVEAU 3 - ASSEMBLAGE ET PACKAGING {#niveau-3-assemblage}

### 📦 OSAT (Outsourced Semiconductor Assembly and Test)

#### **28. ASE Technology Holding (Advanced Semiconductor Engineering)**
- **Ticker**: ASX (NYSE) / 3711 (TWSE Taiwan)
- **Rôle**: #1 mondial OSAT - assemblage final GPU Nvidia
- **Services**: 
  - Packaging flip-chip
  - Test final
  - System-in-Package (SiP)
- **Technologies**: 
  - Advanced packaging pour HBM integration
  - 2.5D/3D packaging
- **Part de marché OSAT**: ~25%
- **Importance**: ⭐⭐⭐⭐⭐

#### **29. Amkor Technology**
- **Ticker**: AMKR (NASDAQ)
- **Rôle**: Major OSAT - packaging avancé
- **Services**: Flip-chip, wafer-level packaging
- **Part de marché**: ~15%
- **Importance**: ⭐⭐⭐⭐

#### **30. JCET Group (Jiangsu Changjiang Electronics Technology)**
- **Ticker**: 600584 (Shanghai)
- **Rôle**: #3 mondial OSAT (Chine)
- **Part de marché**: ~10%
- **Importance**: ⭐⭐⭐

#### **31. Powertech Technology (PTI)**
- **Ticker**: 6239 (TWSE Taiwan)
- **Rôle**: Packaging et test mémoire/logic
- **Spécialité**: Memory packaging (HBM)
- **Importance**: ⭐⭐⭐

---

### 🖥️ SERVEURS & SYSTÈMES (ODM - Original Design Manufacturers)

#### **32. Foxconn (Hon Hai Precision)**
- **Ticker**: 2317 (TWSE Taiwan)
- **Rôle**: Assemblage serveurs AI Nvidia (DGX systems)
- **Produits**: DGX H100, DGX SuperPOD
- **Services**: Manufacturing, assembly, logistics
- **Capitalisation**: ~60 milliards $
- **Importance**: ⭐⭐⭐⭐⭐

#### **33. Wistron**
- **Ticker**: 3231 (TWSE Taiwan)
- **Rôle**: Assemblage serveurs cloud/AI
- **Clients**: Microsoft, Google, Amazon (utilisant GPU Nvidia)
- **Importance**: ⭐⭐⭐⭐

#### **34. Quanta Computer**
- **Ticker**: 2382 (TWSE Taiwan)
- **Rôle**: #1 mondial notebooks, serveurs datacenter
- **Produits**: Serveurs pour hyperscalers avec GPU Nvidia
- **Importance**: ⭐⭐⭐⭐

#### **35. Inventec**
- **Ticker**: 2356 (TWSE Taiwan)
- **Rôle**: Serveurs et infrastructure cloud
- **Importance**: ⭐⭐⭐

#### **36. Super Micro Computer (Supermicro)**
- **Ticker**: SMCI (NASDAQ)
- **Rôle**: Serveurs optimisés GPU, systèmes AI
- **Produits**: 
  - SuperServers avec GPU Nvidia
  - Liquid cooling solutions
  - GPU optimized racks
- **Position**: Partenaire direct Nvidia
- **Importance**: ⭐⭐⭐⭐⭐

---

### 🔗 NETWORKING & INTERCONNECT

#### **37. Broadcom**
- **Ticker**: AVGO (NASDAQ)
- **Rôle**: DOUBLE - Concurrent ET Fournisseur
  - **Concurrent**: ASICs custom AI (alternative GPU)
  - **Fournisseur**: Networking chips pour datacenters Nvidia
- **Produits**: 
  - Networking ASICs pour AI
  - Ethernet switches
  - PCIe switches
  - Custom AI accelerators pour hyperscalers
- **Capitalisation**: 1.58 trillion $ (Octobre 2025)
- **Croissance**: +100% en 2025
- **Dividende**: 2% yield
- **Importance**: ⭐⭐⭐⭐⭐
- **Corrélation Nvidia**: 0.51 (forte mais partiellement opposée)

#### **38. Marvell Technology**
- **Ticker**: MRVL (NASDAQ)
- **Rôle**: Networking chips, data infrastructure
- **Produits**: Ethernet switches, optical interconnects
- **Importance**: ⭐⭐⭐⭐

#### **39. Mellanox (acquis par Nvidia 2020)**
- **Intégré dans**: NVDA
- **Rôle**: InfiniBand networking pour HPC
- **Importance**: Technologie propriétaire Nvidia

---

### 📡 CONNECTEURS & CÂBLES

#### **40. Amphenol**
- **Ticker**: APH (NYSE)
- **Rôle**: Connecteurs haute vitesse, câbles datacenter
- **Produits**: PCIe connectors, high-speed interconnects
- **Importance**: ⭐⭐⭐

#### **41. TE Connectivity**
- **Ticker**: TEL (NYSE)
- **Rôle**: Connecteurs et câbles industriels
- **Importance**: ⭐⭐⭐

---

## 🏢 NIVEAU 4 - INFRASTRUCTURE DATACENTER {#niveau-4-infrastructure}

### ❄️ REFROIDISSEMENT (COOLING) - CRITIQUE POUR AI

#### **42. Vertiv Holdings** ⭐ TOP PICK COOLING
- **Ticker**: VRT (NYSE)
- **Rôle**: #1 cooling et power pour datacenters AI
- **Produits pour Nvidia**:
  - Vertiv 360AI platform (air-to-liquid, liquid-to-liquid)
  - Liquid cooling pour GB200 (jusqu'à 100kW/rack)
  - Rear door heat exchangers
  - Direct-to-chip cooling + CDU (Coolant Distribution Units)
  - Free-cooling chillers
- **Partenariat**: Solution Advisor NVIDIA Partner Network (NPN)
- **Technologies**: Supporte retrofits air→liquid
- **Capitalisation**: ~40 milliards $
- **Importance**: ⭐⭐⭐⭐⭐
- **Opportunité marché**: 4.8 milliards $ (cooling GPU)

#### **43. Schneider Electric** ⭐ LEADER INTÉGRÉ
- **Ticker**: SU (Euronext Paris) / SBGSF (OTC)
- **Rôle**: Infrastructure complète datacenter (power + cooling)
- **Produits pour Nvidia**:
  - Liquid cooling systems GB200
  - 800VDC power architecture
  - ETAP power simulation software
  - EcoStruxure datacenter management
- **Partenariats**: 
  - NVIDIA Omniverse Blueprint (digital twins)
  - Reference designs 800VDC pour 1MW racks
- **Position**: Fournisseur intégré power + cooling
- **Capitalisation**: ~110 milliards €
- **Importance**: ⭐⭐⭐⭐⭐

#### **44. Delta Electronics** ⭐ TOP PICK MORGAN STANLEY
- **Ticker**: 2308 (TWSE Taiwan)
- **Rôle**: Cooling et power solutions AI datacenters
- **Produits Nvidia GTC 2025**:
  - 1.5MW liquid cooling units
  - Power capacitance shelves (stabilisation GPU spikes)
  - L2A (liquid-to-air) cooling - solution mainstream 2025-2027
  - Sidecar CDU designs (leader marché)
- **Opportunité 2025**: +280 millions $ revenus AI cooling
- **Morgan Stanley price target**: 488 TWD (+26% upside)
- **Technologies**: Lithium-ion capacitors pour power stability
- **Capitalisation**: ~30 milliards $
- **Importance**: ⭐⭐⭐⭐⭐

#### **45. AVC (Asia Vital Components)**
- **Ticker**: 6153 (TWSE Taiwan)
- **Rôle**: Cold plates pour liquid cooling Nvidia
- **Produits**: 
  - Reference design cold plate GB200
  - Air + liquid cooling products
- **Part de marché GB200**: 30% supply share (prévu Q3 2025)
- **Morgan Stanley**: Très positif
- **Importance**: ⭐⭐⭐⭐

#### **46. CoolIT Systems** (Privé)
- **Rôle**: Direct liquid cooling solutions
- **Technologies**: Direct-to-chip cooling
- **Clients**: Hyperscalers, HPC facilities
- **Importance**: ⭐⭐⭐

#### **47. Asetek**
- **Ticker**: ASETEK (Oslo Børs)
- **Rôle**: Liquid cooling pour datacenters
- **Technologies**: Warm water cooling, direct-to-chip
- **Importance**: ⭐⭐⭐

#### **48. Green Revolution Cooling (GRC)** (Privé)
- **Rôle**: Immersion cooling pioneer
- **Technologies**: Two-phase immersion cooling
- **Importance**: ⭐⭐⭐

---

### ⚡ ALIMENTATION (POWER)

#### **49. Eaton Corporation**
- **Ticker**: ETN (NYSE)
- **Rôle**: Power distribution, UPS, ePDU
- **Produits**: 
  - 800VDC power distribution units
  - Energy storage systems
  - Power backup
- **Importance**: ⭐⭐⭐⭐

#### **50. ABB**
- **Ticker**: ABB (SIX Swiss) / ABB (NYSE)
- **Rôle**: Power systems datacenter
- **Produits**: 800VDC architecture, transformers
- **Importance**: ⭐⭐⭐⭐

#### **51. Siemens**
- **Ticker**: SIE (Frankfurt) / SIEGY (OTC)
- **Rôle**: On-premises power delivery, automation
- **Produits**: 
  - Gigawatt-scale power systems
  - Digital twin solutions (avec Nvidia Omniverse)
- **Importance**: ⭐⭐⭐⭐

#### **52. GE Vernova**
- **Ticker**: GEV (NYSE) - spin-off GE
- **Rôle**: Power generation et électrification
- **Produits**: Grid integration, power to rack
- **Importance**: ⭐⭐⭐⭐

#### **53. Hitachi Energy**
- **Ticker**: Privé (détenu Hitachi Ltd 7012 Tokyo)
- **Rôle**: HVDC, grid solutions
- **Importance**: ⭐⭐⭐

---

### 🔌 COMPOSANTS POWER DISTRIBUTION

#### **54. BizLink**
- **Ticker**: 3665 (TWSE Taiwan)
- **Rôle**: Power interconnects, cables
- **Produits**: Liquid-cooled busbars
- **Importance**: ⭐⭐⭐

#### **55. Flex (Flextronics)**
- **Ticker**: FLEX (NASDAQ)
- **Rôle**: Power shelves, composants power
- **Importance**: ⭐⭐⭐

#### **56. Liteon Technology**
- **Ticker**: 2301 (TWSE Taiwan)
- **Rôle**: Power supplies, LED
- **Importance**: ⭐⭐

---

### 🔗 CONNECTEURS REFROIDISSEMENT (QD - Quick Disconnects)

#### **57. CPC (Colder Products Company)** (Privé - Dover Corporation)
- **Rôle**: Quick disconnect couplings liquid cooling
- **Produits**: QDs certifiés GB200 program
- **Importance**: ⭐⭐⭐

#### **58. Parker Hannifin**
- **Ticker**: PH (NYSE)
- **Rôle**: Quick disconnects, fluid systems
- **Produits**: High-performance QDs pour cooling
- **Importance**: ⭐⭐⭐

#### **59. Danfoss**
- **Ticker**: Privé (Danemark)
- **Rôle**: Thermal management, QDs
- **Importance**: ⭐⭐⭐

#### **60. Stäubli**
- **Ticker**: Privé (Suisse)
- **Rôle**: Quick connectors haute performance
- **Produits**: Certifications GB200
- **Importance**: ⭐⭐⭐

---

### 🧊 CHILLERS & SYSTÈMES THERMIQUES

#### **61. Daikin Applied**
- **Ticker**: 6367 (Tokyo) - Daikin Industries
- **Rôle**: Chillers industriels, HVAC
- **Importance**: ⭐⭐⭐

#### **62. STULZ**
- **Ticker**: Privé (Allemagne)
- **Rôle**: Precision cooling datacenters
- **Importance**: ⭐⭐⭐

#### **63. Carrier Global**
- **Ticker**: CARR (NYSE)
- **Rôle**: HVAC, refrigeration
- **Importance**: ⭐⭐⭐

---

### 🏗️ CONCEPTION & INTÉGRATION

#### **64. Jacobs Solutions**
- **Ticker**: J (NYSE)
- **Rôle**: Design integrator AI factories
- **Services**: Coordination physique + digital AI factories
- **Partenariat Nvidia**: Reference design AI factories
- **Importance**: ⭐⭐⭐⭐

#### **65. Cadence Design Systems**
- **Ticker**: CDNS (NASDAQ)
- **Rôle**: EDA tools + Reality Digital Twin Platform
- **Produits**: Simulation cooling/airflow (avec Nvidia Omniverse)
- **Technologies**: CFD accelerated by CUDA
- **Importance**: ⭐⭐⭐⭐

#### **66. Ansys**
- **Ticker**: ANSS (NASDAQ)
- **Rôle**: Simulation engineering
- **Produits**: Thermal simulation GB200
- **Importance**: ⭐⭐⭐

#### **67. ETAP (Operation Technology Inc)**
- **Ticker**: Privé (acquis Schneider Electric)
- **Rôle**: Power system simulation
- **Importance**: ⭐⭐⭐

---

## 👥 NIVEAU 5 - CLIENTS FINAUX (HYPERSCALERS) {#niveau-5-clients}

### ☁️ CLOUD SERVICE PROVIDERS - CLIENTS MAJEURS NVIDIA

#### **68. Microsoft**
- **Ticker**: MSFT (NASDAQ)
- **Rôle**: Client #1 ou #2 GPU Nvidia
- **Utilisation**: Azure AI, Azure OpenAI Service
- **Capex AI**: Dizaines de milliards $/an
- **Croissance Azure AI**: +33% YoY (Q3 FY2025), 16% du à AI
- **Capitalisation**: 3.82 trillion $ (Nov 2025)
- **Importance achat GPU**: ⭐⭐⭐⭐⭐
- **Corrélation Nvidia**: 0.36

#### **69. Meta Platforms (Facebook)**
- **Ticker**: META (NASDAQ)
- **Rôle**: Client #1 ou #2 GPU Nvidia
- **Utilisation**: Llama models training, inference
- **Capex 2025**: 68 milliards $ (augmenté de 62.5 milliards $)
- **Stratégie**: Infrastructure AI massive pour Llama
- **Capitalisation**: 1.8 trillion $ (vers 3 trillion d'ici 2029)
- **Importance achat GPU**: ⭐⭐⭐⭐⭐
- **Corrélation Nvidia**: 0.4-0.5

#### **70. Amazon Web Services (AWS)**
- **Ticker**: AMZN (NASDAQ)
- **Rôle**: Client majeur GPU Nvidia
- **Utilisation**: EC2 P5 instances (H100), inference
- **Stratégie duale**: 
  - Achète Nvidia GPU massivement
  - Développe chips custom (Trainium, Inferentia)
- **Capitalisation**: 2.4 trillion $
- **Importance achat GPU**: ⭐⭐⭐⭐⭐
- **Corrélation Nvidia**: 0.4
- **Note**: Custom chips réduisent dépendance long-terme

#### **71. Alphabet/Google Cloud**
- **Ticker**: GOOGL (NASDAQ)
- **Rôle**: Client majeur GPU Nvidia
- **Utilisation**: Google Cloud AI, Gemini training
- **Stratégie duale**:
  - Achète Nvidia GPU
  - TPU (Tensor Processing Units) propriétaires
- **Capitalisation**: 3.3 trillion $
- **Importance achat GPU**: ⭐⭐⭐⭐
- **Corrélation Nvidia**: 0.35-0.4

#### **72. Oracle Cloud**
- **Ticker**: ORCL (NYSE)
- **Rôle**: Client GPU Nvidia
- **Contrats majeurs**: OpenAI (10 milliards $ infrastructure)
- **Utilisation**: OCI AI services
- **Capitalisation**: ~350 milliards $
- **Importance achat GPU**: ⭐⭐⭐⭐
- **Corrélation Nvidia**: 0.3-0.4

---

### 🤖 AI COMPANIES - UTILISATEURS INTENSIFS

#### **73. OpenAI** (Privé - Microsoft invested)
- **Rôle**: Client majeur indirect (via Microsoft Azure)
- **Utilisation**: GPT-4, GPT-5 training
- **Infrastructure**: Des dizaines de milliers GPU Nvidia
- **Importance**: ⭐⭐⭐⭐⭐

#### **74. Anthropic** (Privé)
- **Rôle**: Client GPU (via AWS, GCP)
- **Utilisation**: Claude models training
- **Importance**: ⭐⭐⭐

#### **75. xAI (Elon Musk)** (Privé)
- **Rôle**: Client direct Nvidia
- **Infrastructure**: Colossus supercomputer (100,000 H100)
- **Importance**: ⭐⭐⭐⭐

---

### 🏢 ENTREPRISES TECH DÉVELOPPANT AI

#### **76. Tesla**
- **Ticker**: TSLA (NASDAQ)
- **Rôle**: Client GPU Nvidia
- **Utilisation**: Dojo + Nvidia pour FSD (Full Self-Driving)
- **Capitalisation**: ~1 trillion $
- **Importance**: ⭐⭐⭐
- **Corrélation Nvidia**: 0.3

#### **77. Apple**
- **Ticker**: AAPL (NASDAQ)
- **Rôle**: Client indirect (via cloud providers pour AI services)
- **Utilisation**: Apple Intelligence training
- **Capitalisation**: 3.9 trillion $
- **Importance**: ⭐⭐
- **Note**: Principalement utilise TPU Google et propres chips

---

### 🎮 GAMING & CONSUMER

#### **78. Sony (PlayStation)**
- **Ticker**: 6758 (Tokyo) / SONY (NYSE)
- **Rôle**: Potentiel client futur (PS6 rumeurs AMD/Nvidia)
- **Importance actuelle**: ⭐

---

## 🎯 SYNTHÈSE PAR CATÉGORIE {#synthèse-catégories}

### 💰 PAR CAPITALISATION BOURSIÈRE (Top 20)

| Rang | Entreprise | Ticker | Cap. (Nov 2025) | Catégorie |
|------|-----------|--------|-----------------|-----------|
| 1 | Apple | AAPL | 3.9T $ | Client (indirect) |
| 2 | Microsoft | MSFT | 3.82T $ | Client (Azure) |
| 3 | Alphabet | GOOGL | 3.3T $ | Client (GCP) |
| 4 | Amazon | AMZN | 2.4T $ | Client (AWS) |
| 5 | Meta | META | 1.8T $ | Client |
| 6 | Broadcom | AVGO | 1.58T $ | Concurrent/Fournisseur |
| 7 | TSMC | TSM | 1.25T $ | Fonderie (CRITIQUE) |
| 8 | Tesla | TSLA | ~1T $ | Client |
| 9 | ASML | ASML | 350B $ | Équipement (CRITIQUE) |
| 10 | Oracle | ORCL | 350B $ | Client |
| 11 | Applied Materials | AMAT | 150B $ | Équipement |
| 12 | SK Hynix | 000660 | 130B $ | HBM (CRITIQUE) |
| 13 | Micron | MU | 120B $ | HBM (CRITIQUE) |
| 14 | Schneider Electric | SU | 110B € | Infrastructure |
| 15 | Lam Research | LRCX | 100B $ | Équipement |
| 16 | KLA Corp | KLAC | 85B $ | Équipement |
| 17 | Tokyo Electron | 8035 | 70B $ | Équipement |
| 18 | Foxconn | 2317 | 60B $ | Assemblage |
| 19 | Vertiv | VRT | 40B $ | Cooling |
| 20 | Delta Electronics | 2308 | 30B $ | Cooling |

---

### ⭐ PAR CRITICITÉ POUR NVIDIA

#### NIVEAU 5 - ABSOLUMENT CRITIQUES (Pas d'alternative)

1. **TSMC** (TSM) - Seul fabricant GPU avancés
2. **SK Hynix** (000660) - Principal fournisseur HBM
3. **ASML** (ASML) - Monopole lithographie EUV
4. **Applied Materials** (AMAT) - Équipement fab essentiel
5. **Lam Research** (LRCX) - Équipement gravure critique

#### NIVEAU 4 - TRÈS CRITIQUES (Alternatives limitées)

6. **Micron** (MU) - HBM backup essentiel
7. **Unimicron** (3037) - Leader substrats ABF
8. **Ibiden** (4062) - Substrats ultra-fine pitch
9. **Vertiv** (VRT) - Cooling haute densité
10. **Schneider Electric** (SU) - Infrastructure power+cooling
11. **Delta Electronics** (2308) - Cooling systems
12. **Foxconn** (2317) - Assemblage serveurs
13. **ASE Technology** (ASX) - Packaging final
14. **KLA Corp** (KLAC) - Inspection qualité
15. **Broadcom** (AVGO) - Networking (+ concurrent)

#### NIVEAU 3 - IMPORTANTS (Alternatives disponibles)

16-50. Fournisseurs composants, substrats, cooling, power

#### NIVEAU 2 - CLIENTS (Demande)

51-77. Hyperscalers et entreprises AI

---

### 📊 PAR CORRÉLATION BOURSIÈRE NVIDIA

#### CORRÉLATION TRÈS FORTE (>0.7)

1. **Applied Materials** (AMAT) - 0.8+
2. **Lam Research** (LRCX) - 0.8+
3. **KLA Corporation** (KLAC) - 0.8+

#### CORRÉLATION FORTE (0.5-0.7)

4. **TSMC** (TSM) - 0.5-0.6
5. **Broadcom** (AVGO) - 0.51
6. **AMD** (AMD) - 0.51 (mais opposée)

#### CORRÉLATION MODÉRÉE (0.3-0.5)

7. **Meta** (META) - 0.4-0.5
8. **Amazon** (AMZN) - 0.4
9. **Alphabet** (GOOGL) - 0.35-0.4
10. **Microsoft** (MSFT) - 0.36

---

### 🌍 PAR GÉOGRAPHIE

#### 🇹🇼 TAIWAN (Concentration risque géopolitique)
- **TSMC** - Fonderie GPU
- **Unimicron, Nan Ya PCB, Kinsus** - Substrats
- **ASE, Powertech** - Packaging
- **Foxconn, Quanta, Wistron** - Serveurs
- **Delta Electronics, AVC** - Cooling
- **Zhen Ding** - Substrats montée

#### 🇺🇸 ÉTATS-UNIS
- **Applied Materials, Lam Research, KLA** - Équipements
- **Micron** - HBM
- **Broadcom, Marvell** - Networking
- **AMD, Intel** - Concurrents/Alternatives
- **Microsoft, Amazon, Google, Meta, Oracle** - Clients
- **Vertiv, Eaton** - Infrastructure
- **Cadence, Ansys** - Design tools

#### 🇰🇷 CORÉE DU SUD
- **SK Hynix** - HBM leader
- **Samsung** - Fonderie + HBM
- **Samsung Electro-Mechanics** - Substrats

#### 🇯🇵 JAPON
- **Ibiden, Shinko** - Substrats premium
- **Tokyo Electron** - Équipements
- **Sony, Murata, TDK** - Composants
- **Ajinomoto** - Matériaux ABF

#### 🇪🇺 EUROPE
- **ASML** (Pays-Bas) - Lithographie EUV
- **AT&S** (Autriche) - Substrats
- **Schneider Electric** (France) - Infrastructure
- **Infineon** (Allemagne) - Power ICs
- **STMicroelectronics** (France/Italie) - Semiconducteurs

#### 🇨🇳 CHINE
- **SMIC** - Fonderie (limité par sanctions)
- **JCET** - OSAT
- **Zhen Ding** - Substrats (expansion rapide)

---

### 💡 PAR FONCTION DANS LA CHAÎNE

#### ⛏️ MATIÈRES PREMIÈRES & ÉQUIPEMENTS AMONT
- ASML, Applied Materials, Lam Research, KLA Corp
- Tokyo Electron, Shin-Etsu, Ajinomoto

#### 🏭 FABRICATION SEMICONDUCTEURS
- **Fonderies**: TSMC, Samsung, Intel
- **Mémoire HBM**: SK Hynix, Micron, Samsung
- **Substrats IC**: Unimicron, Ibiden, Nan Ya, Shinko, AT&S, SEMCO, Zhen Ding

#### 🔨 ASSEMBLAGE & PACKAGING
- ASE, Amkor, JCET, Powertech
- Foxconn, Quanta, Wistron, Supermicro

#### 🔌 COMPOSANTS & INTERCONNECT
- Broadcom, Marvell, Infineon, TI, Analog Devices
- Murata, TDK, Amphenol, TE Connectivity

#### 🏢 INFRASTRUCTURE DATACENTER
- **Cooling**: Vertiv, Schneider, Delta, AVC, Asetek, CoolIT
- **Power**: Eaton, ABB, Siemens, GE Vernova
- **Design**: Jacobs, Cadence, Ansys

#### 👥 CLIENTS FINAUX
- Microsoft, Meta, Amazon, Google, Oracle
- Tesla, OpenAI, xAI, Anthropic

---

## 📈 OPPORTUNITÉS D'INVESTISSEMENT PAR PROFIL

### 🎯 POUR SUIVRE NVIDIA DE PRÈS (Corrélation maximale)
1. **AMAT** (Applied Materials) - 0.8+
2. **LRCX** (Lam Research) - 0.8+
3. **KLAC** (KLA Corp) - 0.8+

**Avantage**: Monte/descend avec Nvidia
**Risque**: Corrélation = pas de diversification

---

### 🛡️ POUR EXPOSITION AVEC MOINS DE VOLATILITÉ
1. **TSM** (TSMC) - Incontournable, diversifié (Apple, AMD...)
2. **AVGO** (Broadcom) - Diversifié, dividende 2%
3. **ASML** - Monopole, sert tous les fabricants

**Avantage**: Moins volatile, exposition large semiconducteurs
**Risque**: Croissance potentiellement plus lente

---

### 💰 POUR JOUER LA DEMANDE (Hyperscalers)
1. **MSFT** (Microsoft) - Azure AI leader
2. **META** (Meta) - Capex 68B$ en AI
3. **GOOGL** (Alphabet) - P/E ratio attractif (29x)

**Avantage**: Entreprises profitables, diversifiées
**Risque**: Développent chips custom (réduisent dépendance)

---

### 🔥 POUR L'INFRASTRUCTURE NOUVELLE (High growth)
1. **VRT** (Vertiv) - Cooling leader
2. **2308** (Delta Electronics) - Top pick Morgan Stanley
3. **3037** (Unimicron) - Leader substrats ABF

**Avantage**: Croissance explosive avec AI
**Risque**: Plus petit cap, plus volatile

---

### 🧊 PURE PLAY COOLING (Thématique émergente)
1. **Vertiv** (VRT) - US, large cap
2. **Delta** (2308) - Taiwan, momentum
3. **Schneider** (SU) - Europe, intégré

**Opportunité marché**: 4.8 milliards $ cooling GPU
**Croissance 2025**: Liquid cooling 14%→33% penetration

---

### 🧠 PURE PLAY HBM (Mémoire critique)
1. **SK Hynix** (000660) - Leader 50-60%
2. **Micron** (MU) - Montée rapide 5%→20%
3. ❌ **Samsung** - Éviter (problèmes qualification)

**Statut 2025**: SK Hynix vendu jusqu'à 2026, Micron jusqu'à fin 2025
**Avantage**: Goulot d'étranglement = pricing power

---

### ⚠️ À ÉVITER ACTUELLEMENT

1. **AMD** (AMD) - Performance médiocre, Zacks Rank #4 (Sell)
2. **Intel** (INTC) - Fonderie en difficulté
3. **Samsung HBM** - Problèmes de qualification Nvidia

---

## 🚨 RISQUES DE LA CHAÎNE D'APPROVISIONNEMENT

### 1️⃣ RISQUE GÉOPOLITIQUE - TAIWAN
- **Impact**: TSMC + majorité OSAT + substrats = Taiwan
- **Scénario**: Conflit Taiwan/Chine = arrêt GPU Nvidia
- **Mitigation Nvidia**: TSMC Arizona (165B$ investissement)
- **Timeline mitigation**: 2026-2027 (3 fabs Arizona)

### 2️⃣ GOULOT D'ÉTRANGLEMENT HBM
- **Impact**: SK Hynix vendu jusqu'à 2026
- **Conséquence**: Limite production GPU même si demande forte
- **Mitigation**: Micron ramping, Samsung qualification

### 3️⃣ GOULOT SUBSTRATS ABF
- **Impact**: Pénurie substrats limite packaging GPU
- **Investissements**: 15.5B$ expansions 2021-2027
- **Timeline**: Nouvelles capacités 2025-2027

### 4️⃣ COOLING NOUVEAU PARADIGME
- **Impact**: GB200 nécessite liquid cooling (15-20x coût vs air)
- **Opportunité**: 4.8B$ marché cooling GPU
- **Défi**: Retrofits datacenters existants

### 5️⃣ POWER INFRASTRUCTURE
- **Impact**: GB200 = 130-140kW/rack (vs 10-15kW traditionnel)
- **Défi**: 800VDC nouvelle architecture nécessaire
- **Timeline**: Standards en développement 2025

### 6️⃣ CONCURRENCE AI CHIPS
- **Impact**: Broadcom ASICs, Amazon Trainium, Google TPU
- **Tendance**: Hyperscalers développent alternatives
- **Horizon**: Pression long-terme sur parts marché Nvidia

---

## 📊 CHIFFRES CLÉS DE LA CHAÎNE (2025)

### Production & Demande

| Métrique | Valeur | Note |
|----------|--------|------|
| **GPU Nvidia produits/an** | ~3-4 millions unités | H100/H200/Blackwell |
| **HBM capacité mondiale** | 1.85M m²/mois | 2025 (vs 1.2M en 2024) |
| **ABF substrats capacité** | ~15M m²/mois | 2025 (croissance +32%) |
| **TSMC revenus AI** | 60% des 75B$ | ~45B$ liés HPC/AI |
| **SK Hynix revenus HBM** | 77% du total | HBM = core business |
| **Liquid cooling penetration** | 33% en 2025 | vs 14% en 2024 |

### Investissements Capex (2024-2027)

| Entreprise | Capex | Focus |
|------------|-------|-------|
| **TSMC** | 165B $ (USA) | 3 fabs + 2 packaging Arizona |
| **Samsung** | ~50B $ | Foundry + HBM |
| **SK Hynix** | ~20B $ | HBM capacity (M15X fab) |
| **Micron** | 14B $/an | HBM fabs global |
| **Substrats (cumulé)** | 15.5B $ | ABF capacity expansion |
| **Intel** | ~100B $ | IFS (Foundry Services) |

### Timeline Expansions Critiques

| Année | Événements clés |
|-------|-----------------|
| **2025** | - HBM3E 12-Hi production masse<br>- TSMC Arizona Fab 1 prod<br>- Liquid cooling 33% penetration<br>- ABF +32% capacity |
| **2026** | - HBM4 production début<br>- TSMC 2nm mass production<br>- SK Hynix M15X fab operational<br>- ABF +31% capacity |
| **2027** | - TSMC Arizona 3 fabs operational<br>- Liquid-to-liquid cooling mainstream<br>- 800VDC standard deployed<br>- ABF +16% capacity |

---

## 🔍 COMMENT UTILISER CE DOCUMENT

### Pour investisseurs boursiers
1. **Corrélation forte**: AMAT, LRCX, KLAC
2. **Exposition diversifiée**: TSM, AVGO, ASML
3. **Thématique émergente**: Vertiv, Delta (cooling)
4. **Goulot critique**: SK Hynix, Micron (HBM)

### Pour analystes supply chain
- **Points uniques d'échec**: TSMC (GPU), SK Hynix (HBM), ASML (EUV)
- **Goulots actuels**: HBM memory, ABF substrates, liquid cooling
- **Risque géopolitique**: Taiwan concentration

### Pour acheteurs d'actions
- **Voir tickers** dans chaque section
- **Capitalisation** pour taille position
- **Corrélation** pour diversification
- **Importance** (⭐) pour criticité

---

## 📚 SOURCES

Ce document compile des informations de:
- Rapports financiers entreprises (Q3 2025)
- TrendForce, Yole Group, Counterpoint Research
- CNBC, Bloomberg, Morgan Stanley research
- Annonces Nvidia GTC 2025
- Taiwan Semiconductor Association
- Recherches web Novembre 2025

---

## ⚠️ DISCLAIMER

Ce document est à but informatif uniquement. Il ne constitue pas un conseil en investissement. Les valorisations et données sont approximatives et basées sur des sources publiques en Novembre 2025. Consultez un conseiller financier avant toute décision d'investissement.

**Risques**: 
- Volatilité semiconducteurs élevée
- Risque géopolitique Taiwan/Chine
- Concurrence émergente AI chips
- Cycles boom/bust historiques

---

**Document créé: Novembre 2025**
**Dernière mise à jour: 02/11/2025**
**Version: 1.0**

---

*© 2025 - Analyse Chaîne d'Approvisionnement Nvidia*