const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images/gallery/optimized';
const sizes = [
  { suffix: '-sm', width: 640 },
  { suffix: '-md', width: 1024 }
];

// Hero images to resize
const heroImages = [
  '590295344_122115878463007573_6828961916537642263_n.webp',
  '605340597_122119405491007573_4746787242545134854_n.webp',
  '555385630_122105180217007573_5951213828479555981_n.webp',
  '581931251_122113960773007573_7320039804328164070_n.webp',
  '557636179_122106841755007573_6663589741403764710_n.webp',
  '571197361_122112067671007573_2515374789331075447_n.webp',
  '605359263_122119405011007573_7132557887102658754_n.webp',
  '590298745_122115878679007573_1844884259089963020_n.webp',
  '574104761_122112066819007573_4881499215873013039_n.webp',
  '581936617_122113959447007573_2012506508899052520_n.webp'
];

async function resizeImages() {
  for (const imgFile of heroImages) {
    const inputPath = path.join(inputDir, imgFile);

    if (!fs.existsSync(inputPath)) {
      console.log('Skipping ' + imgFile + ' - not found');
      continue;
    }

    for (const size of sizes) {
      const outputFile = imgFile.replace('.webp', size.suffix + '.webp');
      const outputPath = path.join(inputDir, outputFile);

      try {
        await sharp(inputPath)
          .resize(size.width, null, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);

        const stats = fs.statSync(outputPath);
        console.log('Created ' + outputFile + ' (' + (stats.size / 1024).toFixed(1) + 'KB)');
      } catch (err) {
        console.error('Error resizing ' + imgFile + ':', err.message);
      }
    }
  }
}

resizeImages().then(function() { console.log('Done!'); });
