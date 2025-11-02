import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { Company, SupplyChainData, TimeRange, StockData } from '../types';
import { fetchStockData, getStockColor } from '../services/stockApi';

export type ViewType = 'levels' | 'radial' | 'quadrant';

interface SupplyChainGraphProps {
  companies: Company[];
  data: SupplyChainData;
  timeRange: TimeRange;
  selectedCompany: Company | null;
  onCompanyClick: (company: Company) => void;
  viewType?: ViewType;
}

interface Node extends Company {
  x?: number;
  y?: number;
  stockData?: StockData | null;
}

export default function SupplyChainGraph({
  companies,
  data,
  timeRange,
  selectedCompany,
  onCompanyClick,
  viewType = 'levels',
}: SupplyChainGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [stockDataCache, setStockDataCache] = useState<Map<string, StockData | null>>(new Map());
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  // Fetch stock data for all companies
  useEffect(() => {
    const fetchAllStockData = async () => {
      const cache = new Map<string, StockData | null>();
      const promises = companies
        .filter(c => c.ticker)
        .map(async (company) => {
          try {
            const stockData = await fetchStockData(company.ticker!, timeRange, company.exchange, company.alternate_ticker, company.alternate_exchange);
            cache.set(company.ticker!, stockData);
          } catch (error) {
            cache.set(company.ticker!, null);
          }
        });
      
      await Promise.all(promises);
      setStockDataCache(cache);
    };

    fetchAllStockData();
  }, [companies, timeRange]);

  const resetZoom = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(750).call(
        zoomRef.current.transform,
        d3.zoomIdentity
      );
    }
  }, []);

  const zoomIn = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
    }
  }, []);

  const zoomOut = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomRef.current.scaleBy, 1 / 1.5);
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 1200;
    const height = svgRef.current.clientHeight || 800;
    // Adjust margins based on view type
    const margin = viewType === 'quadrant' 
      ? { top: 50, right: 50, bottom: 80, left: 100 }
      : { top: 100, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group with transform for zoom/pan
    const mainGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
          .on('zoom', (event) => {
            const zoomTransform = event.transform;
            mainGroup.attr('transform', `translate(${margin.left + zoomTransform.x},${margin.top + zoomTransform.y}) scale(${zoomTransform.k})`);
          });

    zoomRef.current = zoom;
    svg.call(zoom);

    // Group companies by level
    const levels = [0, 1, 2, 3, 4, 5];
    const nodesByLevel = levels.map(level => ({
      level,
      companies: companies.filter(c => c.level === level),
    }));

    let nodes: Node[] = [];

    if (viewType === 'radial') {
      // Radial layout: NVIDIA at center, levels in concentric circles
      const centerX = innerWidth / 2;
      const centerY = innerHeight / 2;
      const nvidiaNode = companies.find(c => c.name.toLowerCase().includes('nvidia'));
      
      // Find NVIDIA and place at center
      if (nvidiaNode) {
        const node: Node = {
          ...nvidiaNode,
          x: centerX,
          y: centerY,
          stockData: stockDataCache.get(nvidiaNode.ticker || ''),
        };
        nodes.push(node);
      }

      // Place other companies in concentric circles around NVIDIA
      const maxRadius = Math.min(innerWidth, innerHeight) / 2.5;
      const levelRadii: Record<number, number> = {
        0: maxRadius * 0.15,  // NVIDIA at center (level 0)
        1: maxRadius * 0.35,
        2: maxRadius * 0.55,
        3: maxRadius * 0.75,
        4: maxRadius * 0.90,
        5: maxRadius * 1.0,
      };

      nodesByLevel.forEach(({ level, companies: levelCompanies }) => {
        if (level === 0) return; // NVIDIA already placed
        
        const radius = levelRadii[level] || maxRadius;
        const angleStep = (2 * Math.PI) / Math.max(levelCompanies.length, 1);
        
        levelCompanies.forEach((company, idx) => {
          const angle = idx * angleStep;
          const node: Node = {
            ...company,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            stockData: stockDataCache.get(company.ticker || ''),
          };
          nodes.push(node);
        });
      });

      // Draw concentric circles for visual reference
      levels.forEach(level => {
        if (level === 0) return;
        const radius = levelRadii[level];
        if (radius) {
          mainGroup
            .append('circle')
            .attr('cx', centerX)
            .attr('cy', centerY)
            .attr('r', radius)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(75, 85, 99, 0.2)')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '5,5')
            .lower();
        }
      });
    } else if (viewType === 'quadrant') {
      // Quadrant view: X = level (rank), Y = market cap
      // Get market cap range
      const marketCaps = companies
        .map(c => c.market_cap_billions || 0.5)
        .filter(cap => cap > 0);
      const minCap = Math.min(...marketCaps);
      const maxCap = Math.max(...marketCaps);
      
      // Scales
      const xScale = d3.scaleBand()
        .domain(levels.map(l => l.toString()))
        .range([0, innerWidth])
        .padding(0.1);
      
      const yScale = d3.scaleLog()
        .domain([Math.max(minCap, 0.1), maxCap])
        .range([innerHeight, 0])
        .nice();
      
      // Place companies
      companies.forEach(company => {
        const level = company.level ?? 0;
        const cap = company.market_cap_billions || 0.5;
        
        // X position: center of the level band
        const xPos = (xScale(level.toString()) || 0) + (xScale.bandwidth() || 0) / 2;
        
        // Y position: based on market cap
        const yPos = yScale(cap);
        
        // Add small random offset within level band to avoid overlaps
        const randomOffset = (Math.random() - 0.5) * (xScale.bandwidth() || 0) * 0.6;
        
        const node: Node = {
          ...company,
          x: xPos + randomOffset,
          y: yPos,
          stockData: stockDataCache.get(company.ticker || ''),
        };
        nodes.push(node);
      });
    } else {
      // Original horizontal levels layout
      const levelWidth = innerWidth / (levels.length + 1);

      nodesByLevel.forEach(({ level, companies: levelCompanies }) => {
        const x = (level + 0.5) * levelWidth;
        const spacing = Math.min(100, innerHeight / (levelCompanies.length + 1));
        
        levelCompanies.forEach((company, idx) => {
          const node: Node = {
            ...company,
            x,
            y: (idx + 1) * spacing,
            stockData: stockDataCache.get(company.ticker || ''),
          };
          nodes.push(node);
        });
      });
    }

    // Draw links
    const linkGroup = mainGroup.append('g').attr('class', 'links');
    
    if (viewType === 'quadrant') {
      // No links in quadrant view - focus on positioning
    } else if (viewType === 'radial') {
      // Radial links: connect each level to the next, with NVIDIA at center
      const nvidiaNode = nodes.find(n => n.level === 0);
      
      for (let i = 1; i < levels.length; i++) {
        const sourceLevel = levels[i - 1];
        const targetLevel = levels[i];
        const sources = sourceLevel === 0 
          ? (nvidiaNode ? [nvidiaNode] : [])
          : nodes.filter(n => n.level === sourceLevel);
        const targets = nodes.filter(n => n.level === targetLevel);

        targets.forEach((target, idx) => {
          if (target.x === undefined || target.y === undefined) return;
          
          // Connect to nearest source or NVIDIA
          let source: Node | undefined;
          if (sourceLevel === 0 && nvidiaNode) {
            source = nvidiaNode;
          } else if (sources.length > 0) {
            source = sources[idx % sources.length];
          }
          
          if (source && source.x !== undefined && source.y !== undefined) {
            linkGroup
              .append('line')
              .attr('x1', source.x)
              .attr('y1', source.y)
              .attr('x2', target.x)
              .attr('y2', target.y)
              .attr('stroke', '#4b5563')
              .attr('stroke-width', 1)
              .attr('opacity', 0.3)
              .attr('class', 'link');
          }
        });
      }
    } else {
      // Horizontal levels links
      for (let i = 0; i < levels.length - 1; i++) {
        const sourceLevel = levels[i];
        const targetLevel = levels[i + 1];
        const sources = nodes.filter(n => n.level === sourceLevel);
        const targets = nodes.filter(n => n.level === targetLevel);

        sources.forEach((source, idx) => {
          if (source.x === undefined || source.y === undefined) return;
          const target = targets[Math.floor((idx / sources.length) * targets.length)];
          if (target && target.x !== undefined && target.y !== undefined) {
            linkGroup
              .append('line')
              .attr('x1', source.x)
              .attr('y1', source.y)
              .attr('x2', target.x)
              .attr('y2', target.y)
              .attr('stroke', '#4b5563')
              .attr('stroke-width', 1.5)
              .attr('opacity', 0.4)
              .attr('class', 'link');
          }
        });
      }
    }

    // Tooltip element - follows mouse with white opaque background
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'fixed pointer-events-none z-50 border border-gray-300 rounded-lg p-3 shadow-2xl opacity-0 transition-opacity')
      .style('font-size', '12px')
      .style('max-width', '300px')
      .style('background-color', 'rgba(255, 255, 255, 1)')
      .style('color', '#1f2937');

    // Draw nodes
    const nodeGroup = mainGroup.append('g').attr('class', 'nodes');

    // Create a scale for node sizes based on market cap
    // Use sqrt scale so area is proportional to market cap
    const marketCaps = nodes
      .map(d => d.market_cap_billions || 0.5)
      .filter(cap => cap > 0);
    const minCap = Math.min(...marketCaps);
    const maxCap = Math.max(...marketCaps);
    
    // Size scale: min radius 12px, max radius 60px
    // Using sqrt scale ensures area is proportional to market cap
    const sizeScale = d3.scaleSqrt()
      .domain([minCap, maxCap])
      .range([12, 60]);

    // Smart algorithm to determine if a company is undervalued
    // Uses multiple factors: criticality, market cap, correlation, position, and stock trend
    const isUndervalued = (company: Node): boolean => {
      const criticality = company.criticality || 0;
      const marketCap = company.market_cap_billions || 0;
      const correlation = company.nvidia_correlation || 0;
      const supplyPosition = company.supply_chain_position || '';
      
      // Skip if no market cap data or criticality too low
      if (marketCap <= 0 || criticality < 3) {
        return false;
      }
      
      // Calculate statistics for comparison
      const allCaps = nodes.map(n => n.market_cap_billions || 0).filter(c => c > 0);
      const medianCap = d3.median(allCaps) || 50;
      const p25Cap = d3.quantile(allCaps, 0.25) || 10;
      
      // Get companies with similar criticality for peer comparison
      const peers = nodes.filter(n => 
        n.criticality === criticality && 
        (n.market_cap_billions || 0) > 0
      );
      const peerMedianCap = peers.length > 0 
        ? (d3.median(peers.map(p => p.market_cap_billions || 0)) || medianCap)
        : medianCap;
      
      // Factor 1: Criticality-to-Market Cap Ratio (higher is better for undervaluation)
      // Higher criticality companies should have proportionally higher market caps
      const expectedCapForCriticality = criticality * 30; // Baseline: 30B per criticality point
      const capDeficit = expectedCapForCriticality - marketCap;
      
      // Factor 2: Position in supply chain multiplier
      // Upstream and direct suppliers are more critical
      let positionMultiplier = 1.0;
      if (supplyPosition === 'upstream' || supplyPosition === 'direct_supplier') {
        positionMultiplier = 1.3;
      } else if (supplyPosition === 'supplier') {
        positionMultiplier = 1.1;
      }
      
      // Factor 3: NVIDIA correlation multiplier
      // Higher correlation means more impact on NVIDIA, should be valued more
      const correlationMultiplier = 0.5 + (correlation * 0.5); // 0.5 to 1.0 range
      
      // Factor 4: Stock trend (negative trend might indicate undervaluation opportunity)
      const stockData = stockDataCache.get(company.ticker || '');
      const trend = stockData?.trend || 0;
      const trendBonus = trend < -10 ? 0.2 : (trend < 0 ? 0.1 : 0); // Bonus for negative trends
      
      // Factor 5: Comparison to peers
      const peerRatio = marketCap / peerMedianCap;
      
      // Calculate composite score
      const score = (
        // Base: Is market cap below expected for criticality?
        (capDeficit > 0 ? Math.min(capDeficit / 50, 2.0) : 0) * 0.3 +
        // Relative to peers
        (peerRatio < 0.5 ? 1.5 : (peerRatio < 0.7 ? 1.0 : 0)) * 0.25 +
        // Relative to overall market
        (marketCap < p25Cap ? 1.0 : (marketCap < medianCap * 0.7 ? 0.7 : 0)) * 0.25 +
        // Criticality boost
        (criticality >= 5 ? 1.0 : (criticality >= 4 ? 0.7 : 0)) * 0.2
      ) * positionMultiplier * correlationMultiplier + trendBonus;
      
      // Threshold: Score must be above 0.7 to be considered undervalued
      // But also require minimum criticality of 3
      return score >= 0.7 && criticality >= 3;
    };

    const nodeSelection = nodeGroup.selectAll('g.node').data(nodes);
    
    // Exit old nodes
    nodeSelection.exit().remove();
    
    // Enter new nodes
    const nodeEnter = nodeSelection
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    // Background for labels - Improved contrast (only shown on hover or when needed)
    // Completely hidden by default using visibility: hidden
    nodeEnter
      .append('rect')
      .attr('x', -35)
      .attr('y', -10)
      .attr('width', 70)
      .attr('height', 18)
      .attr('fill', 'rgba(17, 24, 39, 0.95)')
      .attr('rx', 4)
      .attr('stroke', 'rgba(75, 85, 99, 0.5)')
      .attr('stroke-width', 0.5)
      .attr('class', 'label-bg')
      .attr('opacity', 0) // Hidden by default
      .attr('visibility', 'hidden') // Completely hidden - not rendered at all
      .attr('pointer-events', 'none');

    // Merge enter and update
    const nodeUpdate = nodeEnter.merge(nodeSelection as any);
    
    // Update positions for all nodes
    nodeUpdate.attr('transform', d => `translate(${d.x},${d.y})`);
    
    // Ensure label background is always hidden by default (both new and existing)
    // Select all label backgrounds in the entire graph and force them to be invisible
    nodeGroup.selectAll('.label-bg')
      .attr('opacity', 0)
      .attr('visibility', 'hidden')
      .attr('pointer-events', 'none');

    // Add pink dashed outline circle for undervalued companies (behind the main circle)
    nodeEnter
      .filter(d => isUndervalued(d))
      .append('circle')
      .attr('r', d => {
        const cap = d.market_cap_billions || 0.5;
        return sizeScale(cap) + 5; // Slightly larger than main circle
      })
      .attr('fill', 'none')
      .attr('stroke', '#ec4899') // Pink color (rose-500)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5,3') // Dashed pattern: 5px dash, 3px gap
      .attr('opacity', 0.9)
      .attr('class', 'undervalued-ring')
      .lower(); // Place behind the main circle

    // Node circles with color based on stock trend and size based on market cap
    nodeEnter
      .append('circle')
      .attr('r', d => {
        const cap = d.market_cap_billions || 0.5;
        return sizeScale(cap);
      })
      .attr('fill', d => {
        if (!d.ticker) return '#6b7280';
        // Try to get stockData from node first, then from cache
        const stockData = d.stockData || stockDataCache.get(d.ticker);
        if (!stockData || stockData.trend === null || stockData.trend === undefined) {
          return '#6b7280'; // Gray for no data
        }
        return getStockColor(stockData.trend);
      })
      .attr('stroke', d => {
        if (selectedCompany?.id === d.id) return '#3b82f6';
        // No stroke for normal and undervalued companies (only the ring has stroke)
        return 'none';
      })
      .attr('stroke-width', d => {
        if (selectedCompany?.id === d.id) return 3;
        return 0;
      })
      .attr('opacity', d => (selectedCompany?.id === d.id ? 1 : 0.95))
      .on('mouseenter', function(event, d) {
        const mainCircle = d3.select(this);
        const parentNode = this.parentNode;
        const nodeGroup = parentNode ? d3.select(parentNode as Element) : null;
        const undervaluedRing = nodeGroup ? nodeGroup.select('.undervalued-ring') : d3.select(null);
        const labelBg = nodeGroup ? nodeGroup.select('.label-bg') : d3.select(null);
        
        // Show label background on hover
        if (!labelBg.empty()) {
          (labelBg as any)
            .attr('visibility', 'visible')
            .transition()
            .duration(200)
            .attr('opacity', 0.95);
        }
        
        mainCircle
          .attr('stroke-width', 4)
          .attr('opacity', 0.9)
          .transition()
          .duration(200)
          .attr('r', () => {
            const cap = d.market_cap_billions || 0.5;
            return sizeScale(cap) * 1.2;
          })
          .on('end', function() {
            mainCircle.transition().duration(200).attr('r', () => {
              const cap = d.market_cap_billions || 0.5;
              return sizeScale(cap);
            });
          });
        
        // Also animate the red ring if present
        if (!undervaluedRing.empty()) {
          undervaluedRing
            .transition()
            .duration(200)
            .attr('r', () => {
              const cap = d.market_cap_billions || 0.5;
              return sizeScale(cap) * 1.2 + 5;
            })
            .on('end', function() {
              undervaluedRing.transition().duration(200).attr('r', () => {
                const cap = d.market_cap_billions || 0.5;
                return sizeScale(cap) + 5;
              });
            });
        }

        // Show tooltip
        const stockData = stockDataCache.get(d.ticker || '');
        const trend = stockData?.trend ?? null;
        const trendColor = getStockColor(trend);
        
        const tooltipHtml = `
          <div class="space-y-1">
            <div class="font-bold text-gray-900 text-sm">${d.name}</div>
            ${d.ticker ? `<div class="text-blue-600 font-semibold">${d.ticker}</div>` : ''}
            ${d.role ? `<div class="text-gray-700 text-xs">${d.role}</div>` : ''}
            ${d.market_cap_billions ? `<div class="text-gray-700 text-xs">Capitalisation: $${d.market_cap_billions}B</div>` : ''}
            ${trend !== null ? `<div class="text-xs" style="color: ${trendColor}">Tendance: ${trend > 0 ? '+' : ''}${trend.toFixed(2)}%</div>` : ''}
            ${d.criticality ? `<div class="text-gray-700 text-xs">Criticité: ${d.criticality}/5</div>` : ''}
            ${isUndervalued(d) ? `<div class="text-pink-500 text-xs font-semibold">⚠️ Sous-cotée</div>` : ''}
          </div>
        `;

        // Position tooltip at mouse position with offset
        tooltip
          .html(tooltipHtml)
          .style('opacity', 1)
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY + 15) + 'px')
          .style('right', 'auto');
      })
      .on('mousemove', function(event) {
        // Follow mouse position
        tooltip
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY + 15) + 'px');
      })
      .on('mouseleave', function(_event, d) {
        const mainCircle = d3.select(this);
        const parentNode = this.parentNode;
        const nodeGroup = parentNode ? d3.select(parentNode as Element) : null;
        const labelBg = nodeGroup ? nodeGroup.select('.label-bg') : d3.select(null);
        
        // Hide label background on mouse leave
        if (!labelBg.empty()) {
          (labelBg as any)
            .transition()
            .duration(200)
            .attr('opacity', 0)
            .on('end', function(this: SVGRectElement) {
              // Completely hide after transition
              d3.select(this)
                .attr('visibility', 'hidden');
            });
        }
        
        mainCircle
          .attr('stroke-width', selectedCompany?.id === d.id ? 3 : 2)
          .attr('opacity', 1);
        tooltip.style('opacity', 0);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        onCompanyClick(d);
      });

        // Node labels - Improved readability
        nodeEnter
          .append('text')
          .attr('dy', 5)
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('font-size', '11px')
          .attr('font-weight', '600')
          .attr('pointer-events', 'none')
          .attr('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.8)')
          .text(d => d.ticker || d.name.substring(0, 4));

    // Level labels and axes (not affected by zoom)
    const levelLabelGroup = svg.append('g').attr('class', 'level-labels');
    
    if (viewType === 'quadrant') {
      // Draw grid lines and axes for quadrant view
      const marketCaps = companies
        .map(c => c.market_cap_billions || 0.5)
        .filter(cap => cap > 0);
      const minCap = Math.min(...marketCaps);
      const maxCap = Math.max(...marketCaps);
      
      const xScale = d3.scaleBand()
        .domain(levels.map(l => l.toString()))
        .range([0, innerWidth])
        .padding(0.1);
      
      const yScale = d3.scaleLog()
        .domain([Math.max(minCap, 0.1), maxCap])
        .range([innerHeight, 0])
        .nice();
      
      const axisGroup = mainGroup.append('g').attr('class', 'axes');
      
      // Y-axis (market cap) on the left
      const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => {
          const val = Number(d);
          if (val >= 1000) return `$${(val / 1000).toFixed(1)}T`;
          if (val >= 1) return `$${val.toFixed(0)}B`;
          return `$${val.toFixed(1)}B`;
        })
        .ticks(8);
      
      axisGroup
        .append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(0, 0)`)
        .call(yAxis)
        .selectAll('text')
        .attr('fill', '#9ca3af')
        .attr('font-size', '11px');
      
      axisGroup
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9ca3af')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('Capitalisation boursière');
      
      // X-axis (levels) at the bottom
      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d => `Niveau ${d}`);
      
      axisGroup
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis)
        .selectAll('text')
        .attr('fill', '#ffffff')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('stroke', '#1f2937')
        .attr('stroke-width', '0.5')
        .attr('paint-order', 'stroke fill');
      
      axisGroup
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 50)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9ca3af')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('Rang / Niveau dans la chaîne');
      
      // Draw grid lines (4x4 quadrant grid)
      const gridGroup = mainGroup.append('g').attr('class', 'grid').lower();
      
      // Horizontal grid lines (4 divisions for market cap)
      const yTicks = yScale.ticks(4);
      yTicks.forEach(tick => {
        gridGroup
          .append('line')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('y1', yScale(tick))
          .attr('y2', yScale(tick))
          .attr('stroke', 'rgba(75, 85, 99, 0.2)')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3');
      });
      
      // Vertical grid lines (4 divisions for levels)
      const levelDivisions = 4;
      const xStep = innerWidth / levelDivisions;
      for (let i = 1; i < levelDivisions; i++) {
        gridGroup
          .append('line')
          .attr('x1', i * xStep)
          .attr('x2', i * xStep)
          .attr('y1', 0)
          .attr('y2', innerHeight)
          .attr('stroke', 'rgba(75, 85, 99, 0.2)')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3');
      }
      
      // Style axis lines
      axisGroup.selectAll('.domain')
        .attr('stroke', '#4b5563')
        .attr('stroke-width', 1.5);
      
      axisGroup.selectAll('.tick line')
        .attr('stroke', '#4b5563')
        .attr('stroke-width', 1);
      
    } else if (viewType === 'radial') {
      const centerX = innerWidth / 2;
      const centerY = innerHeight / 2;
      const maxRadius = Math.min(innerWidth, innerHeight) / 2.5;
      const levelRadii: Record<number, number> = {
        1: maxRadius * 0.35,
        2: maxRadius * 0.55,
        3: maxRadius * 0.75,
        4: maxRadius * 0.90,
        5: maxRadius * 1.0,
      };

      levels.forEach(level => {
        if (level === 0) return;
        const levelData = data.supply_chain_levels.find(l => l.level === level);
        if (levelData) {
          const radius = levelRadii[level];
          if (radius) {
            levelLabelGroup
              .append('text')
              .attr('x', margin.left + centerX + radius)
              .attr('y', margin.top + centerY - 5)
              .attr('text-anchor', 'start')
              .attr('fill', '#ffffff')
              .attr('font-size', '13px')
              .attr('font-weight', 'bold')
              .attr('pointer-events', 'none')
              .attr('stroke', '#1f2937')
              .attr('stroke-width', '0.5')
              .attr('paint-order', 'stroke fill')
              .text(`Niveau ${level}`);
          }
        }
      });

      // NVIDIA label at center
      const nvidiaNode = nodes.find(n => n.level === 0);
      if (nvidiaNode && nvidiaNode.x !== undefined && nvidiaNode.y !== undefined) {
        mainGroup
          .append('text')
          .attr('x', nvidiaNode.x)
          .attr('y', nvidiaNode.y - 35)
          .attr('text-anchor', 'middle')
          .attr('fill', '#60a5fa')
          .attr('font-size', '16px')
          .attr('font-weight', 'bold')
          .attr('pointer-events', 'none')
          .text('NVIDIA');
      }
    } else {
      const levelWidth = innerWidth / (levels.length + 1);
      const maxLabelWidth = levelWidth * 0.95; // Max width for each label (95% of available space)
      levels.forEach(level => {
        const levelData = data.supply_chain_levels.find(l => l.level === level);
        if (levelData) {
          const fullText = `Niveau ${level}: ${levelData.name}`;
          // Calculate approximate text width (rough estimate: 6.2px per character for 10.5px font)
          const charWidth = 6.2;
          const estimatedWidth = fullText.length * charWidth;
          const displayText = estimatedWidth > maxLabelWidth 
            ? `Niveau ${level}: ${levelData.name.substring(0, Math.floor((maxLabelWidth / charWidth) - 15))}...`
            : fullText;
          
          const labelGroup = levelLabelGroup
            .append('g')
            .attr('class', 'level-label-group');
          
          labelGroup
            .append('text')
            .attr('x', margin.left + (level + 0.5) * levelWidth)
            .attr('y', margin.top - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffffff')
            .attr('font-size', '10.5px')
            .attr('font-weight', 'bold')
            .attr('pointer-events', 'none')
            .attr('stroke', '#1f2937')
            .attr('stroke-width', '0.5')
            .attr('paint-order', 'stroke fill')
            .text(displayText);
          
          // Add tooltip with full text if truncated
          if (displayText !== fullText) {
            labelGroup.append('title').text(fullText);
          }
        }
      });

      // Add NVIDIA label
      const nvidiaNode = nodes.find(n => n.name.toLowerCase().includes('nvidia'));
      if (nvidiaNode && nvidiaNode.x !== undefined && nvidiaNode.y !== undefined) {
        mainGroup
          .append('text')
          .attr('x', nvidiaNode.x)
          .attr('y', nvidiaNode.y - 30)
          .attr('text-anchor', 'middle')
          .attr('fill', '#60a5fa')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .attr('pointer-events', 'none')
          .text('NVIDIA');
      }
    }

    // Cleanup
    return () => {
      tooltip.remove();
      svg.on('.zoom', null);
    };
      }, [companies, data, timeRange, selectedCompany, stockDataCache, onCompanyClick, resetZoom, viewType]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Legend - Top left, compact design */}
      <div className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-40 pointer-events-auto">
        <div className="flex items-center justify-between mb-2 px-4 pt-3">
          <span className="text-sm font-semibold text-gray-200">Légende</span>
          <button
            onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800/50 rounded"
            aria-label="Toggle legend"
            aria-expanded={!isLegendCollapsed}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isLegendCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
          </button>
        </div>
        {!isLegendCollapsed && (
          <div className="px-4 pb-3 space-y-1.5 min-w-[200px]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                <span className="text-gray-300 text-xs">Hausse (+5%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500 flex-shrink-0"></div>
                <span className="text-gray-300 text-xs">Stable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
                <span className="text-gray-300 text-xs">Baisse modérée</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                <span className="text-gray-300 text-xs">Forte baisse</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800/50">
              <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0"></div>
              <span className="text-gray-300 text-xs">Taille = Capitalisation</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" className="flex-shrink-0">
                <circle cx="8" cy="8" r="6" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="3,2" opacity="0.9" />
              </svg>
              <span className="text-gray-300 text-xs">Contour rose pointillé = Sous-cotée</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Zoom Controls - Bottom right */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-40 pointer-events-none">
        <button
          onClick={zoomIn}
          className="bg-gray-900/95 hover:bg-gray-800/90 border border-gray-700/50 rounded-lg p-2.5 text-white shadow-xl transition-all hover:scale-105 active:scale-95 pointer-events-auto backdrop-blur-sm"
          aria-label="Zoom in"
          title="Zoom avant"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </button>
        <button
          onClick={zoomOut}
          className="bg-gray-900/95 hover:bg-gray-800/90 border border-gray-700/50 rounded-lg p-2.5 text-white shadow-xl transition-all hover:scale-105 active:scale-95 pointer-events-auto backdrop-blur-sm"
          aria-label="Zoom out"
          title="Zoom arrière"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        <button
          onClick={resetZoom}
          className="bg-gray-900/95 hover:bg-gray-800/90 border border-gray-700/50 rounded-lg p-2.5 text-white shadow-xl transition-all hover:scale-105 active:scale-95 pointer-events-auto backdrop-blur-sm"
          aria-label="Reset view"
          title="Réinitialiser la vue"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Instructions - Bottom left */}
      <div className="absolute bottom-4 left-4 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl px-3 py-2 text-xs text-gray-400 z-20 shadow-xl">
        <div className="flex items-center gap-2">
          <span>🖱️</span>
          <span>Clic pour sélectionner</span>
          <span className="text-gray-600">•</span>
          <span>🔍</span>
          <span>Molette pour zoomer</span>
          <span className="text-gray-600">•</span>
          <span>👆</span>
          <span>Glisser pour déplacer</span>
        </div>
      </div>
    </div>
  );
}

