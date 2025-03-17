// cleanupPreview.js
const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  const sitemapPath = path.resolve(__dirname, './src/public/sitemap.xml');

  if (fs.existsSync(sitemapPath)) {
    fs.unlinkSync(sitemapPath);
    console.log('Стар sitemap.xml е премахнат от preview средата.');
  } else {
    console.log('Няма sitemap.xml за изтриване в preview средата.');
  }
}
