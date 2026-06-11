/* Verification: drive the running dev server through the story's key beats
   and capture a screenshot of each into shots-verify/. Uses the installed
   Chrome (channel) so no browser download is needed.

   Usage: node scripts/story-shots.mjs [baseUrl]   (default http://localhost:5174) */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.argv[2] ?? 'http://localhost:5174'
const outDir = new URL('../shots-verify/', import.meta.url)
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(base, { waitUntil: 'networkidle' })

// wait for the intro loader to finish (it hides itself at 100%)
await page.waitForTimeout(4000)

/* scroll positions, expressed in px for a 900px viewport:
   intro wrap = 1150vh => 10350px, scrub distance = 10350 - 900 = 9450 */
const D = 10350 - 900
const stops = [
  ['01-intro-beat', Math.round(D * 0.55)], // scene 2 beat over the frontier
  ['02-matchcut', Math.round(D * 0.985)], // pixel-dissolve into the grid
  ['03-chapter01-manifesto', 10350 + 120], // thread + 01/WHY + manifesto title
  ['04-chapter03-expertise', 0], // resolved below by anchor
  ['05-projects-aizona', 0], // resolved below by anchor
  ['06-chapter06-contact', 0], // resolved below by anchor
]

const anchorY = (id, offset) =>
  page.evaluate(
    ([i, o]) => {
      const el = document.getElementById(i)
      return el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY + o) : 0
    },
    [id, offset],
  )

stops[3][1] = (await anchorY('work', -360)) // chapter break sits above the section
stops[4][1] = (await anchorY('projects', 520)) // first sticky card centered
stops[5][1] = (await anchorY('contact', -380))

for (const [name, y] of stops) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(1800) // let scrub render + whileInView reveals settle
  await page.screenshot({ path: new URL(`${name}.png`, outDir).pathname.slice(1) })
  console.log('captured', name, 'at y=' + y)
}

await browser.close()
