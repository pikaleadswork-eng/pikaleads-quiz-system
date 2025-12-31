import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to public images directory
const publicDir = path.join(__dirname, '../client/public');
const imagesDir = path.join(publicDir, 'images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  console.log('Images directory not found, creating it...');
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to convert image to WebP
async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(2);
    
    console.log(`✓ Converted: ${path.basename(inputPath)}`);
    console.log(`  Original: ${(inputStats.size / 1024).toFixed(2)} KB`);
    console.log(`  WebP: ${(outputStats.size / 1024).toFixed(2)} KB`);
    console.log(`  Reduction: ${reduction}%\n`);
    
    return true;
  } catch (error) {
    console.error(`✗ Error converting ${path.basename(inputPath)}:`, error.message);
    return false;
  }
}

// Function to process all images in a directory
async function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png'];
  
  let converted = 0;
  let skipped = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const result = await processDirectory(filePath);
      converted += result.converted;
      skipped += result.skipped;
      continue;
    }
    
    const ext = path.extname(file).toLowerCase();
    
    if (!imageExtensions.includes(ext)) {
      continue;
    }
    
    const baseName = path.basename(file, ext);
    const webpPath = path.join(dirPath, `${baseName}.webp`);
    
    // Skip if WebP version already exists
    if (fs.existsSync(webpPath)) {
      console.log(`⊘ Skipped (already exists): ${file}`);
      skipped++;
      continue;
    }
    
    const success = await convertToWebP(filePath, webpPath);
    if (success) {
      converted++;
    }
  }
  
  return { converted, skipped };
}

// Main execution
console.log('🖼️  Starting image optimization...\n');
console.log(`Processing directory: ${publicDir}\n`);

const { converted, skipped } = await processDirectory(publicDir);

console.log('\n✅ Image optimization complete!');
console.log(`   Converted: ${converted} images`);
console.log(`   Skipped: ${skipped} images (already exist)`);
