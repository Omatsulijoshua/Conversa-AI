const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = 'C:\\Users\\Joshua\\.gemini\\antigravity\\brain\\323a6ade-d15a-44b2-9999-0fd18af2289a\\.user_uploaded\\media__1785060663261.jpg';

async function cropLogos() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    console.log('Image dimensions:', metadata.width, 'x', metadata.height);

    const width = metadata.width;
    const height = metadata.height;

    // 1. Crop full dark logo (top 33% height)
    const logoHeight = Math.round(height * 0.33);
    const fullLogo = await image
      .clone()
      .extract({ left: 0, top: 0, width: width, height: logoHeight })
      .toBuffer();

    // 2. Crop the dark app icon (from the third row)
    // The third row is roughly between y = 58% and 72%
    // Let's locate the first icon in the third row:
    // Left boundary: around x = 16% to 24% of the width
    const iconTop = Math.round(height * 0.58);
    const iconHeight = Math.round(height * 0.14);
    const iconLeft = Math.round(width * 0.16);
    const iconWidth = Math.round(width * 0.08); // Adjust to match square icon shape

    // Let's make sure it's square: let's use a box size based on the height
    const boxSize = Math.round(height * 0.11); // size of the icon itself
    const adjustedLeft = Math.round(width * 0.161);
    const adjustedTop = Math.round(height * 0.59);

    const icon = await image
      .clone()
      .extract({ 
        left: adjustedLeft, 
        top: adjustedTop, 
        width: boxSize, 
        height: boxSize 
      })
      .toBuffer();

    // Save to client_frontend/public
    fs.writeFileSync(path.join(__dirname, 'public', 'logo.png'), fullLogo);
    fs.writeFileSync(path.join(__dirname, 'public', 'logo_icon.png'), icon);
    console.log('Saved cropped logos to client_frontend public folder.');

    // Save to admin_dashboard/public
    const adminPublicDir = path.join(__dirname, '..', 'admin_dashboard', 'public');
    if (!fs.existsSync(adminPublicDir)) {
      fs.mkdirSync(adminPublicDir, { recursive: true });
    }
    fs.writeFileSync(path.join(adminPublicDir, 'logo.png'), fullLogo);
    fs.writeFileSync(path.join(adminPublicDir, 'logo_icon.png'), icon);
    console.log('Saved cropped logos to admin_dashboard public folder.');

  } catch (err) {
    console.error('Cropping error:', err);
  }
}

cropLogos();
