import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const IMAGES_DIR = join(PUBLIC_DIR, 'images');

// Configuration
const CONFIG = {
  gallery: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 80,
  },
  team: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 85,
  },
};

async function getImageFiles(dir) {
  const files = await readdir(dir);
  return files.filter(file =>
    ['.jpg', '.jpeg', '.png'].includes(extname(file).toLowerCase())
  );
}

async function optimizeImage(inputPath, outputPath, config) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // Resize if larger than max dimensions
  let resized = image;
  if (metadata.width > config.maxWidth || metadata.height > config.maxHeight) {
    resized = image.resize(config.maxWidth, config.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Output optimized JPEG
  await resized
    .jpeg({ quality: config.quality, mozjpeg: true })
    .toFile(outputPath);

  // Also create WebP version
  const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  await resized
    .webp({ quality: config.quality })
    .toFile(webpPath);

  return { jpeg: outputPath, webp: webpPath };
}

async function processDirectory(subdir, config) {
  const inputDir = join(IMAGES_DIR, subdir);
  const outputDir = join(IMAGES_DIR, subdir, 'optimized');

  try {
    await mkdir(outputDir, { recursive: true });
  } catch (e) {
    // Directory might already exist
  }

  const files = await getImageFiles(inputDir);
  console.log(`\nProcessing ${files.length} images in ${subdir}/`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const inputPath = join(inputDir, file);
    const outputPath = join(outputDir, file.replace(/\.(jpeg|png)$/i, '.jpg'));

    try {
      const originalStats = await stat(inputPath);
      totalOriginal += originalStats.size;

      const result = await optimizeImage(inputPath, outputPath, config);

      const optimizedStats = await stat(result.jpeg);
      const webpStats = await stat(result.webp);
      totalOptimized += optimizedStats.size;

      const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);
      const webpSavings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);

      console.log(`  ${file}`);
      console.log(`    Original: ${(originalStats.size / 1024).toFixed(0)}KB`);
      console.log(`    JPEG: ${(optimizedStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`);
      console.log(`    WebP: ${(webpStats.size / 1024).toFixed(0)}KB (${webpSavings}% smaller)`);
    } catch (error) {
      console.error(`  Error processing ${file}:`, error.message);
    }
  }

  const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
  console.log(`\n${subdir}/ Summary:`);
  console.log(`  Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  Optimized total: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  Savings: ${totalSavings}%`);
}

async function main() {
  console.log('Image Optimization Script');
  console.log('=========================');

  await processDirectory('gallery', CONFIG.gallery);
  await processDirectory('team', CONFIG.team);

  console.log('\n✅ Optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Move optimized images to replace originals');
  console.log('2. Update image references to use .webp with .jpg fallback');
}

main().catch(console.error);
