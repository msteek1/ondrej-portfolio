/* One-off: convert raw site screenshots (shots-tmp/) into the optimized
   project-card media in public/shots/. Advisio gets cropped to drop the top
   promo bar and the cookie dialog at the bottom of the capture. */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

mkdirSync(new URL('../public/shots/', import.meta.url), { recursive: true })

const src = (f) => new URL(`../shots-tmp/${f}`, import.meta.url).pathname.slice(1)
const out = (f) => new URL(`../public/shots/${f}`, import.meta.url).pathname.slice(1)

await sharp(src('aizona.png')).resize({ width: 1280 }).webp({ quality: 82 }).toFile(out('aizona.webp'))

await sharp(src('advisio.png'))
  .extract({ left: 0, top: 34, width: 1600, height: 660 })
  .resize({ width: 1280 })
  .webp({ quality: 82 })
  .toFile(out('advisio.webp'))

console.log('done')
