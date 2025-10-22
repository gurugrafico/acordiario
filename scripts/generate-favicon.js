import fs from 'fs';
import path from 'path';
import pngToIco from 'png-to-ico';
import * as Jimp from 'jimp';

const root = process.cwd();
const pngPath = path.join(root, 'favicon.png');
const icoPath = path.join(root, 'favicon.ico');

(async () => {
  try {
    // Create a simple 64x64 PNG with a colored background and a white musical note-like circle
    const size = 64;
    const image = new Jimp(size, size, '#3A86FF');
    // Draw a simple circle to simulate an icon (not a real note)
    const center = size / 2;
    const radius = size * 0.28;
    const white = Jimp.cssColorToHex('#FFFFFF');
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center + size * 0.08;
        const dy = y - center - size * 0.05;
        if (dx * dx + dy * dy < radius * radius) {
          image.setPixelColor(white, x, y);
        }
      }
    }
    await image.writeAsync(pngPath);
    console.log('favicon.png generado en', pngPath);

    const buf = await pngToIco(pngPath);
    fs.writeFileSync(icoPath, buf);
    console.log('favicon.ico generado en', icoPath);
  } catch (err) {
    console.error('Error generando favicon:', err);
    process.exit(1);
  }
})();
