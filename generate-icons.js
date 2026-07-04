const sharp = require('sharp');
let pngToIco;
try {
  pngToIco = require('png-to-ico');
  if (typeof pngToIco !== 'function' && typeof pngToIco.default === 'function') {
    pngToIco = pngToIco.default;
  }
} catch (e) {}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#1f2937" rx="20" />
  <path d="M 50,50 m -20,0 a 10,10 0 1,0 40,0 a 10,10 0 1,0 0,-40 a 10,10 0 1,0 -40,0 a 10,10 0 1,0 0,40 z" fill="#047857" />
  <circle cx="50" cy="50" r="15" fill="#047857" />
  <circle cx="35" cy="35" r="15" fill="#047857" />
  <circle cx="65" cy="35" r="15" fill="#047857" />
  <circle cx="35" cy="65" r="15" fill="#047857" />
  <circle cx="65" cy="65" r="15" fill="#047857" />
  <circle cx="50" cy="20" r="15" fill="#10b981" />
</svg>`;

async function generate() {
  const svgBuffer = Buffer.from(svg);

  // Generate 16x16 PNG
  await sharp(svgBuffer).resize(16, 16).png().toFile('public/icon-16.png');
  // Generate 32x32 PNG
  await sharp(svgBuffer).resize(32, 32).png().toFile('public/icon-32.png');
  // Generate standard icon.png
  await sharp(svgBuffer).resize(192, 192).png().toFile('public/icon.png');
  // Generate apple-touch-icon.png
  await sharp(svgBuffer).resize(180, 180).png().toFile('public/apple-touch-icon.png');

  if (typeof pngToIco === 'function') {
    pngToIco(['public/icon-16.png', 'public/icon-32.png'])
      .then(buf => {
        require('fs').writeFileSync('public/favicon.ico', buf);
        require('fs').unlinkSync('public/icon-16.png');
        require('fs').unlinkSync('public/icon-32.png');
        console.log('Icons generated successfully.');
      });
  } else {
      require('fs').copyFileSync('public/icon-32.png', 'public/favicon.ico');
      require('fs').unlinkSync('public/icon-16.png');
      require('fs').unlinkSync('public/icon-32.png');
      console.log('Icons generated successfully (fallback ico).');
  }
}
generate();
