// Compress the heavy boards/storyboard PNGs to WebP and re-encode the hero video.
// Dev-only (sharp + ffmpeg-static). Originals live outside the repo in ../../boards.
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const ffmpeg = require('ffmpeg-static')
const { execFileSync } = require('child_process')

const pub = path.join(__dirname, '..', 'public')
const boards = path.join(pub, 'boards')
const mb = (n) => (n / 1e6).toFixed(2) + ' MB'

async function images() {
  const jobs = [
    // [src png, out webp, quality, maxWidth|null]
    ['hero-board.png', 'hero-board.webp', 84, null],
    ['creature-board.png', 'creature-board.webp', 84, null],
    ['storyboard-1.png', 'storyboard-1.webp', 80, 2400],
    ['storyboard-2.png', 'storyboard-2.webp', 80, 2400],
  ]
  for (const [src, out, quality, maxW] of jobs) {
    const inp = path.join(boards, src)
    const outp = path.join(boards, out)
    if (!fs.existsSync(inp)) {
      console.log('skip (missing):', src)
      continue
    }
    let img = sharp(inp)
    if (maxW) img = img.resize({ width: maxW, withoutEnlargement: true })
    await img.webp({ quality, effort: 5 }).toFile(outp)
    const a = fs.statSync(inp).size
    const b = fs.statSync(outp).size
    console.log(`${out}: ${mb(a)} -> ${mb(b)}`)
    fs.unlinkSync(inp) // drop the heavy PNG (originals kept outside the repo)
  }
}

function video() {
  const inp = path.join(pub, 'proweb.mp4')
  const tmp = path.join(pub, 'proweb.tmp.mp4')
  if (!fs.existsSync(inp)) return console.log('no video')
  const before = fs.statSync(inp).size
  execFileSync(
    ffmpeg,
    [
      '-y', '-i', inp,
      '-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '128k',
      '-movflags', '+faststart',
      tmp,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  )
  fs.renameSync(tmp, inp)
  console.log(`proweb.mp4: ${mb(before)} -> ${mb(fs.statSync(inp).size)}`)
}

;(async () => {
  await images()
  video()
  console.log('done')
})()
