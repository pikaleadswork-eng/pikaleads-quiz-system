import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function updateCaseStudyImages() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('🔄 Updating case study images to WebP format...\n');
    
    // Get all case studies with cover images
    const [rows] = await connection.execute(
      'SELECT id, title, coverImage, images FROM case_studies WHERE coverImage IS NOT NULL'
    );
    
    let updated = 0;
    
    for (const row of rows) {
      const { id, title, coverImage, images } = row;
      
      // Convert coverImage to WebP
      let newCoverImage = coverImage;
      if (coverImage && !coverImage.endsWith('.webp')) {
        // Replace extension with .webp
        newCoverImage = coverImage.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        console.log(`✓ ${title}`);
        console.log(`  Old: ${coverImage}`);
        console.log(`  New: ${newCoverImage}\n`);
      }
      
      // Convert images array to WebP
      let newImages = images;
      if (images) {
        try {
          const imagesArray = JSON.parse(images);
          const newImagesArray = imagesArray.map(img => {
            if (img && !img.endsWith('.webp')) {
              return img.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            }
            return img;
          });
          newImages = JSON.stringify(newImagesArray);
        } catch (e) {
          console.warn(`⚠ Could not parse images for case study ${id}`);
        }
      }
      
      // Update database
      if (newCoverImage !== coverImage || newImages !== images) {
        await connection.execute(
          'UPDATE case_studies SET coverImage = ?, images = ? WHERE id = ?',
          [newCoverImage, newImages, id]
        );
        updated++;
      }
    }
    
    console.log(`\n✅ Updated ${updated} case studies to use WebP images`);
    
  } catch (error) {
    console.error('❌ Error updating case study images:', error);
  } finally {
    await connection.end();
  }
}

updateCaseStudyImages();
