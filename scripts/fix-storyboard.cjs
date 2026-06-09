// One-off: remove the blank white S5 cell baked into the V01 storyboard sheet
// by detecting the large white block (bottom-left) and painting it the sheet's
// dark background colour so it reads as an empty slot instead of a glaring box.
const fs = require('fs')
const path = require('path')
const { PNG } = require('pngjs')

const file = path.join(__dirname, '..', 'public', 'boards', 'storyboard-1.png')
const png = PNG.sync.read(fs.readFileSync(file))
const { width: W, height: H, data } = png
const idx = (x, y) => (W * y + x) * 4

// sample a dark background pixel from the top-left margin
const bg = [data[idx(8, 8)], data[idx(8, 8) + 1], data[idx(8, 8) + 2]]

// detect near-white pixels in the bottom-left region (where the blank cell lives)
const x0 = 0, x1 = Math.floor(W * 0.32), y0 = Math.floor(H * 0.46), y1 = H
let minx = W, miny = H, maxx = 0, maxy = 0, count = 0
for (let y = y0; y < y1; y++) {
  for (let x = x0; x < x1; x++) {
    const i = idx(x, y)
    if (data[i] > 220 && data[i + 1] > 220 && data[i + 2] > 220) {
      if (x < minx) minx = x; if (x > maxx) maxx = x
      if (y < miny) miny = y; if (y > maxy) maxy = y
      count++
    }
  }
}

console.log(JSON.stringify({ W, H, bg, bbox: [minx, miny, maxx, maxy], count }))

if (count > 5000) {
  const pad = 3
  minx = Math.max(0, minx - pad); miny = Math.max(0, miny - pad)
  maxx = Math.min(W - 1, maxx + pad); maxy = Math.min(H - 1, maxy + pad)
  for (let y = miny; y <= maxy; y++) {
    for (let x = minx; x <= maxx; x++) {
      const i = idx(x, y)
      data[i] = bg[0]; data[i + 1] = bg[1]; data[i + 2] = bg[2]; data[i + 3] = 255
    }
  }
  fs.writeFileSync(file, PNG.sync.write(png))
  console.log('filled blank cell with', bg)
} else {
  console.log('no white block found — nothing changed')
}
