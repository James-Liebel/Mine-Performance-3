/**
 * Extract leaderboard rows from StatStak HTML (e.g. from artifacts/crawl2/leaderboard.html).
 * Run after crawl: npx tsx scripts/extract-leaderboard.ts [path-to-leaderboard.html]
 *
 * If StatStak blocks scraping or structure differs, use data/mock-leaderboard.json instead.
 * Output: JSON to stdout or --out file.
 */

import * as fs from 'fs';
import * as path from 'path';

const defaultPath = path.join(process.cwd(), 'artifacts', 'crawl2', 'leaderboard.html');

function extractFromHtml(html: string): { metric?: string; unit?: string; rows: { rank: number; name: string; value: number; percentile?: number }[] } {
  const rows: { rank: number; name: string; value: number; percentile?: number }[] = [];

  // Common patterns: table rows with rank, name, value columns. Adapt selectors to actual StatStak markup.
  const tableMatch = html.match(/<table[^>]*>[\s\S]*?<\/table>/i);
  const table = tableMatch ? tableMatch[0] : html;

  // Match <tr>...</tr> and then cells - generic extraction
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  let rowIndex = 0;
  while ((trMatch = trRegex.exec(table)) !== null) {
    const trContent = trMatch[1];
    const cells: string[] = [];
    const tdRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let tdMatch;
    while ((tdMatch = tdRegex.exec(trContent)) !== null) {
      cells.push(tdMatch[1].replace(/<[^>]+>/g, '').trim());
    }
    if (cells.length >= 3 && rowIndex > 0) {
      const rank = parseInt(cells[0], 10);
      if (!Number.isNaN(rank)) {
        rows.push({
          rank,
          name: cells[1] || `Row ${rank}`,
          value: parseFloat(cells[2]) || 0,
          percentile: cells[3] ? parseInt(cells[3], 10) : undefined,
        });
      }
    }
    rowIndex++;
  }

  const metricMatch = html.match(/leaderboard[^>]*>[\s\S]*?<h[12][^>]*>([^<]+)/i);
  const metric = metricMatch ? metricMatch[1].trim() : undefined;

  return { metric, unit: 'mph', rows };
}

function main() {
  const htmlPath = process.argv[2] || defaultPath;
  const outFlag = process.argv.indexOf('--out');
  const outPath = outFlag !== -1 ? process.argv[outFlag + 1] : null;

  if (!fs.existsSync(htmlPath)) {
    console.error('File not found:', htmlPath);
    console.error('Run crawl first or use data/mock-leaderboard.json.');
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const result = extractFromHtml(html);

  const json = JSON.stringify(result, null, 2);
  if (outPath) {
    fs.writeFileSync(outPath, json, 'utf8');
    console.error('Wrote', outPath);
  } else {
    console.log(json);
  }
}

main();
