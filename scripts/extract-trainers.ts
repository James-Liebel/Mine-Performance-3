/**
 * Optional: extract trainer/coach data from StatStak site for import.
 * Run: npm run extract-trainers
 * If the live site exposes structured trainer data (e.g. API or parseable DOM),
 * this script can output JSON for content/coaches.ts. Otherwise we use
 * placeholder bios and document "content needed from client" in launch-checklist.
 */

const TRAINERS_URL = 'https://mine-performance.statstak.io/trainers';

async function main() {
  try {
    const res = await fetch(TRAINERS_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    // StatStak trainer pages may render client-side; without Playwright we only get shell.
    // If you have an API or server-rendered list, parse here and write to content/coaches.ts.
    const hasTrainerContent = html.includes('trainer') || html.includes('coach') || html.length > 2000;
    console.log('Trainers page length:', html.length, 'hasTrainerContent:', hasTrainerContent);
    if (!hasTrainerContent) {
      console.log('No structured trainer data found in HTML. Use placeholder bios and collect from client. See docs/launch-checklist.md.');
    }
  } catch (e) {
    console.warn('Fetch failed:', e);
  }
}

main();
